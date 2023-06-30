import {Field, InputType} from "type-graphql";
import {IsEmail, Length} from "class-validator";

@InputType()
export class LoginCommand {
    @Field()
    @IsEmail()
    email: String

    @Field()
    @Length(8, 30)
    password: String
}
