import {parse} from "graphql/language";


export const schemaStr = `type CartProjection {
  id: ID!
  owner: User!
  ownerId: String!
}

input CreateCartCommand {
  productId: ID!
}

input CreateProductCommand {
  description: String!
  name: String!
  price: Float!
  stock: Float!
}

input CreateUserCommand {
  email: String!
  password: String!
  role: String!
  username: String!
}

input LoginCommand {
  email: String!
  password: String!
}

type Mutation {
  createCart(command: CreateCartCommand!): CartProjection!
  createProduct(command: CreateProductCommand!): Product!
  createUser(command: CreateUserCommand!): User!
  deleteCart(id: String!): Boolean!
  deleteProduct(id: String!): Boolean!
  deleteUser(id: String!): Boolean!
  login(command: LoginCommand!): Subject!
  logout: Subject!
}

type Product {
  description: String!
  id: ID!
  name: String!
  price: Float!
  stock: Int!
}

type Query {
  getAllCarts: [CartProjection!]!
  getAllProducts: [Product!]!
  getAllUsers: [User!]!
  getCartById(id: String!): CartProjection!
  getProductById(id: String!): Product!
  getSubject: Subject!
  getUserById(id: String!): User!
}

type Subject {
  authenticated: Boolean!
  role: String
  userId: String
}

type User {
  email: String!
  id: ID!
  password: String!
  role: String!
  username: String!
}`

export const schema = parse(schemaStr)