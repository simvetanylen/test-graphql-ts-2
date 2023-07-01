import {Field, ID, ObjectType} from "type-graphql";
import {Product} from "../products/Product";
import {User} from "../users/User";

@ObjectType({description: 'The  Cart model'})
export class CartProjection {
    @Field(() => ID)
    id: string;

    @Field((_type) => String)
    ownerId: string

    @Field((_type) => User)
    owner: User;

    @Field(_ => [String])
    productIds: string[]

    @Field(_ => [Product])
    products: Product[];
}