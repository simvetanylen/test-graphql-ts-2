import {Field, InputType} from "type-graphql";
import {Product} from "./Product";
import {Length} from "class-validator";

@InputType()
export class CreateProductCommand implements Partial<Product> {
    @Field()
    name: String;

    @Field()
    @Length(1, 255)
    description: String;

    @Field()
    stock: number;

    @Field()
    price: number;

}