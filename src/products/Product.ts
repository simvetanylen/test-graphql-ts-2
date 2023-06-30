import {Field, Float, ID, Int, ObjectType} from "type-graphql";
import {prop as Property} from "@typegoose/typegoose/lib/prop";
import {getModelForClass} from "@typegoose/typegoose";

@ObjectType({ description: 'The Product model' })
export class Product {
    @Field(() => ID)
    id: String;

    @Field()
    @Property()
    name: String;

    @Field()
    @Property()
    description: String;

    @Field((_type) => Int)
    @Property()
    stock: number;

    @Field((_type) => Float)
    @Property()
    price: number;

    _doc: any;
}

export const ProductModel = getModelForClass(Product);