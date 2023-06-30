import {Role} from "../users/Role";
import {Field, ObjectType} from "type-graphql";
import {UnauthenticatedException, UnauthorizedException} from "../exceptions";

@ObjectType()
export class Subject {
    @Field() readonly authenticated: Boolean
    @Field({ nullable: true}) readonly role?: String
    @Field({ nullable: true}) readonly userId?: String

    private constructor(
        authenticated: boolean,
        role?: Role,
        userId?: string,
    ) {
        this.authenticated = authenticated
        this.role = role
        this.userId = userId
    }

    public assertIsAuthenticated() {
        if (!this.authenticated) {
            throw new UnauthenticatedException()
        }
    }

    public assertHasRole(role: Role) {
        this.assertIsAuthenticated()

        if (this.role !== role) {
            throw new UnauthorizedException('Required role : ' + role)
        }
    }

    static unauthenticated() {
        return new Subject(false, undefined, undefined)
    }

    static user(role: Role, userId: string) {
        return new Subject(true, role, userId)
    }
}