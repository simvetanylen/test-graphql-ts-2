import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import {ApolloServerPluginLandingPageGraphQLPlayground} from "@apollo/server-plugin-landing-page-graphql-playground";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import json from 'body-parser';
import http from "http";
import {buildSchema} from "type-graphql";
import {connect} from "mongoose";
import {UserResolver} from "./users/UserResolver";
import {ProductResolver} from "./products/ProductResolver";
import {CartResolver} from "./carts/CartResolver";
import sessions, {SessionOptions} from "express-session";
import cookieParser from "cookie-parser";
import {Subject} from "./authentication/Subject";
import {Role} from "./users/Role";
import {AuthenticationResolver} from "./authentication/AuthenticationResolver";
import cors from 'cors'

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

const resolvers = {
    Query: {
        books: () => books,
    },
};

const main = async () => {
    const schema = await buildSchema({
        resolvers: [
            CartResolver,
            ProductResolver,
            UserResolver,
            AuthenticationResolver,
        ],
        emitSchemaFile: true,
        // TODO : put to true ?
        validate: false,
    });

    const mongoose = await connect('mongodb://root:root@localhost:27017/test?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false')
    await mongoose.connection;

    const expressApp = express();

// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
    const httpServer = http.createServer(expressApp);

    const apolloServer = new ApolloServer({
        schema,
        status400ForVariableCoercionErrors: true,
        includeStacktraceInErrorResponses: true,
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
            ApolloServerPluginDrainHttpServer({ httpServer })
        ]
    });

    await apolloServer.start()

    const corsOptions = {
        origin: '*',
        credentials: true, // <-- REQUIRED backend setting
        allowCredentials: true
    };
    expressApp.use(cors(corsOptions))
    expressApp.options('*', cors(corsOptions))

    // Note : put "request.credentials": "include" on playground config
    expressApp.use(sessions({
        name: 'test-session',
        secret: 'random secret to set',
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            // TODO : put true for prod, false because of localhost
            secure: false,
            httpOnly: true
        },
        resave: false,
        store: new sessions.MemoryStore()
    }))
    expressApp.use(cookieParser())

    expressApp.use('/graphql', json(), expressMiddleware(apolloServer, {
        context: async ({ req, res }) => {
            let subject: Subject
            // @ts-ignore
            let session = req.session as {
                subject?: {
                    authenticated?: boolean,
                    userId?: string,
                    role?: Role
                }
            }

            if (session.subject?.authenticated === true) {
                subject = Subject.user(
                    session.subject.role!,
                    session.subject.userId!
                )
            } else {
                subject = Subject.unauthenticated()
            }

            return {
                subject,
                session: req.session,
            }
        },
    }));

    await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));

    console.log(`🚀  Server ready at: localhost:4000`);
}


main().catch((err)=> {
    console.log(err)
})