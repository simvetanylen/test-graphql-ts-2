import {Field, InputType} from "type-graphql";
import {User} from "./User";
import {IsEmail, Length} from "class-validator";
import {Role} from "./Role";

@InputType()
export class CreateUserCommand implements Partial<User> {
    @Field()
    @Length(1, 255)
    username: String;

    @Field()
    @IsEmail()
    email: String;

    @Field()
    @Length(8, 30)
    password: String;

    @Field()
    role: Role;
}