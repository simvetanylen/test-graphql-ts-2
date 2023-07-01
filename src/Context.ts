import {Subject} from "./authentication/Subject";
import {Session} from "express-session";
import DataLoader from "dataloader";
import {User} from "./users/User";
import {Product} from "./products/Product";

export interface Context {
    subject: Subject
    session?: Session
    dataLoaders: {
        users: DataLoader<string, User>
        products: DataLoader<string, Product>
    }
}