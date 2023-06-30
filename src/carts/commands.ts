import {Field, ID, InputType} from "type-graphql";
import {Cart} from "./Cart";
import {ObjectId} from "mongoose";

@InputType()
export class CreateCartCommand {
    @Field(() => ID)
    productId: ObjectId
}