import {Field, ID} from "type-graphql";
import {prop as Property} from "@typegoose/typegoose/lib/prop";
import {getModelForClass} from "@typegoose/typegoose";
import {Product} from "../products/Product";
import {ObjectId} from "mongoose";

export class Cart {
    @Field(() => ID)
    id: string;

    @Property({ ref: Product, required: true })
    owner: ObjectId;

    @Property({ ref: Product, required: true })
    products: ObjectId[];
}

export const CartModel = getModelForClass(Cart);