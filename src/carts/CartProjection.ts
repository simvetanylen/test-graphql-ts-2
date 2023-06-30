import {Field, ID, ObjectType} from "type-graphql";
import {prop as Property} from "@typegoose/typegoose/lib/prop";
import {Product} from "../products/Product";
import {Ref} from "../types";
import {User} from "../users/User";

@ObjectType({ description: 'The  Cart model' })
export class CartProjection {
    @Field(() => ID)
    id: string;

    @Field((_type) => String)
    ownerId: String

    @Field((_type) => User)
    owner: User;

    // @Field((_type) => String)
    // products: Ref<Product>[];
    // _doc: any;
}