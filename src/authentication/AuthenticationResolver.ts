import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {Subject} from "./Subject";
import {Context} from "../Context";
import {LoginCommand} from "./commands";
import {UserModel} from "../users/User";


@Resolver((_of) => Subject)
export class AuthenticationResolver {

    @Query((_returns) => Subject, {nullable: false})
    async getSubject(@Ctx() context: Context) {
        return context.subject
    }

    @Mutation(() => Subject )
    async login(@Arg('command') command: LoginCommand, @Ctx() context: Context) {
        const user = await UserModel.findOne({email: command.email})

        if (user === null || user.password !== command.password) {
            throw new Error('Wrong login')
        }

        const subject = Subject.user(user.role, user.id)

        // @ts-ignore
        context.session['subject'] = {
            authenticated: true,
            userId: user.id,
            role: user.role
        }

        // context.session['subject'] = instanceToPlain(...)

        return subject
    }

    @Mutation(() => Subject)
    async logout(@Ctx() context: Context) {
        context.session?.destroy(() => {})
        return Subject.unauthenticated()
    }

}