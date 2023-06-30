import {Subject} from "./authentication/Subject";
import {Session} from "express-session";

export interface Context {
    subject: Subject
    session?: Session
}