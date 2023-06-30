"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const server_plugin_landing_page_graphql_playground_1 = require("@apollo/server-plugin-landing-page-graphql-playground");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const type_graphql_1 = require("type-graphql");
const category_1 = require("./cat/category");
const mongoose_1 = require("mongoose");
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
const schema = await (0, type_graphql_1.buildSchema)({
    resolvers: [
        category_1.CategoriesResolver,
    ],
    emitSchemaFile: true,
    validate: false,
});
const mongoose = await (0, mongoose_1.connect)('mongodb://root:root@localhost:27017/test?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false');
await mongoose.connection;
const app = (0, express_1.default)();
// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http_1.default.createServer(app);
const server = new server_1.ApolloServer({
    schema,
    // typeDefs,
    // resolvers,
    status400ForVariableCoercionErrors: true,
    includeStacktraceInErrorResponses: true,
    plugins: [
        (0, server_plugin_landing_page_graphql_playground_1.ApolloServerPluginLandingPageGraphQLPlayground)(),
        (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })
    ]
});
await server.start();
app.use('/graphql', (0, body_parser_1.default)(), (0, express4_1.expressMiddleware)(server));
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀  Server ready at: localhost:4000`);
//# sourceMappingURL=index.js.map