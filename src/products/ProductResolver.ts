import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {Product, ProductModel} from "./Product";
import {CreateProductCommand} from "./commands";
import {Context} from "../Context";

@Resolver((_of) => Product)
export class ProductResolver {
    @Query((_returns) => Product, { nullable: false })
    async getProductById(@Arg('id') id: string) {
        return ProductModel.findById({_id: id});
    }

    @Query(() => [Product])
    async getAllProducts() {
        return ProductModel.find();
    }

    @Mutation(() => Product)
    async createProduct(
        @Ctx() context: Context,
        @Arg('command') command: CreateProductCommand,
    ): Promise<Product> {

        context.subject.assertHasRole('MANAGER')

        return (
            await ProductModel.create({
                name: command.name,
                description: command.description,
                stock: command.stock,
                price: command.price,
            })
        ).save();
    }

    @Mutation(() => Boolean)
    async deleteProduct(
        @Ctx() context: Context,
        @Arg('id') id: string
    ) {
        context.subject.assertHasRole('MANAGER')

        await ProductModel.deleteOne({ id });
        return true;
    }
}