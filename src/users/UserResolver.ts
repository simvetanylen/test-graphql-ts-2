import {Arg, Mutation, Query, Resolver} from "type-graphql";

import {User, UserModel} from "./User";
import {CreateUserCommand} from "./commands";


@Resolver((_of) => User)
export class UserResolver {
    @Query((_returns) => User, { nullable: false })
    async getUserById(@Arg('id') id: string) {
        return UserModel.findById({ _id: id });
    }

    @Query(() => [User])
    async getAllUsers() {
        return UserModel.find();
    }

    @Mutation(() => User)
    async createUser(
        @Arg('command') command: CreateUserCommand
    ): Promise<User> {
        const user = (
            await UserModel.create({
                ...command
            })
        ).save();
        // @ts-ignore
        return user;
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg('id') id: string) {
        await UserModel.deleteOne({ id });
        return true;
    }
}