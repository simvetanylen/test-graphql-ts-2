import {Field, ID, InputType} from "type-graphql";
import {ObjectId} from "mongoose";

@InputType()
export class CreateCartCommand {
    @Field(() => ID)
    productId: ObjectId
}