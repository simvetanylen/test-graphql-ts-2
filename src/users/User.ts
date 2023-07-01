import {Field, ID, ObjectType} from "type-graphql";
import {prop as Property} from "@typegoose/typegoose/lib/prop";
import {getModelForClass} from "@typegoose/typegoose";
import {Role} from "./Role";
import {Length} from "class-validator";

@ObjectType({ description: 'The User model' })
export class User {
    @Field(() => ID)
    id: String;

    @Field()
    @Property({ required: true })
    username: String;

    @Field()
    @Property({ required: true })
    email: String;

    @Field()
    @Length(1, 30)
    @Property({ required: true})
    password: String;

    @Field()
    @Property({ required: true })
    role: Role;
}

export const UserModel = getModelForClass(User);