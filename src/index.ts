import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginLandingPageGraphQLPlayground} from "@apollo/server-plugin-landing-page-graphql-playground";
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import json from 'body-parser';
import http from "http";
import {connect} from "mongoose";
import {CartResolver} from "./carts/CartResolver";
import sessions from "express-session";
import cookieParser from "cookie-parser";
import {Subject} from "./authentication/Subject";
import {Role} from "./users/Role";
import cors from 'cors'
import {usersDataLoader} from "./users/dataloader";
import {buildSchema} from "type-graphql";
import {ProductResolver} from "./products/ProductResolver";
import {UserResolver} from "./users/UserResolver";
import {AuthenticationResolver} from "./authentication/AuthenticationResolver";
import {Context} from "./Context";
import {productsDataLoader} from "./products/dataloader";


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
            ApolloServerPluginDrainHttpServer({httpServer})
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
        context: async ({req, res}): Promise<Context> => {
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
                dataLoaders: {
                    users: usersDataLoader(),
                    products: productsDataLoader(),
                }
            }
        },
    }));

    await new Promise<void>((resolve) => httpServer.listen({port: 4000}, resolve));

    console.log(`🚀  Server ready at: localhost:4000`);
}


main().catch((err) => {
    console.log(err)
})