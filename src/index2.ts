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
  type User {
    id: String
    username: String
    email: String
    password: String
    role: String
  }
  
  type Cart {
    id: String
    ownerId: String
    owner: User
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    allCarts: [Cart]
  }
`;

const carts = [
    {
        id: "1",
        ownerId: "1",
        owner: {
            id: "1",
            username: "oreste",
            email: "test",
            password: "eee",
            role: "cust"
        }
    },
    {
        id: "2",
        ownerId: "2",
        owner: {
            id: "2",
            username: "fabiana",
            email: "test",
            password: "eee",
            role: "cust"
        }
    },
];

const resolvers = {
    Query: {
        allCarts: (parent: any, args: any, contextValue: any, info: any) => {
            console.log(parent)
            console.log(args)
            console.log(contextValue)
            console.log(JSON.stringify(info, undefined, 2))

            return carts
        }
    }
};

const main = async () => {

    const mongoose = await connect('mongodb://root:root@localhost:27017/test?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false')
    await mongoose.connection;

    const expressApp = express();

// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
    const httpServer = http.createServer(expressApp);

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        status400ForVariableCoercionErrors: true,
        includeStacktraceInErrorResponses: true,
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
            ApolloServerPluginDrainHttpServer({ httpServer })
        ]
    });

    await apolloServer.start()

    expressApp.use('/graphql', json(), expressMiddleware(apolloServer, {}));

    await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));

    console.log(`🚀  Server ready at: localhost:4000`);
}


main().catch((err)=> {
    console.log(err)
})