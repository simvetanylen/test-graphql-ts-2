import {Arg, Ctx, FieldResolver, Info, Mutation, Query, Resolver, Root} from "type-graphql";
import {Cart, CartModel} from "./Cart";
import {User, UserModel} from "../users/User";
import {Product, ProductModel} from "../products/Product";
import {CreateCartCommand} from "./commands";
import {Context} from "../Context";
import {CartProjection} from "./CartProjection";

@Resolver((_of) => CartProjection)
export class CartResolver {

    private static toProjection(cart: Cart): CartProjection {
        const proj = new CartProjection()
        proj.ownerId = cart.owner.toString()
        proj.id = cart.id

        return proj
    }
    @Query((_returns) => CartProjection, { nullable: false })
    async getCartById(@Arg('id') id: string) {
        const cart = await CartModel.findById({_id: id})
        return CartResolver.toProjection(cart!)
    }

    @Query(() => [CartProjection])
    async getAllCarts(
        @Ctx() context: Context,
    ) {
        const result = await CartModel.find()
        console.log(result)
        const proj =result.map((cart) => {
            return CartResolver.toProjection(cart)
        })

        // @ts-ignore
        context.carts = proj

        return proj;
    }

    @Mutation(() => CartProjection)
    async createCart(
        @Ctx() context: Context,
        @Arg('command') command: CreateCartCommand
    ): Promise<CartProjection> {

        context.subject.assertHasRole('CUSTOMER')

        // TODO : check if product exists
        const result = await (
            await CartModel.create({
                products: [command.productId],
                owner: context.subject.userId!
            })
        ).save();

        return CartResolver.toProjection(result)
    }

    @Mutation(() => Boolean)
    async deleteCart(@Arg('id') id: string) {
        await CartModel.deleteOne({ id });
        return true;
    }

    // @FieldResolver((_type) => Product)
    // async product(@Root() cart: Cart): Promise<Product> {
    //     return (await ProductModel.findById(cart._doc.products))!;
    // }

    @FieldResolver((_type) => User)
    async owner(@Root() cart: CartProjection, @Ctx() context: Context,): Promise<User> {

        // @ts-ignore
        if (context.carts) {
            // @ts-ignore
            const ownerIds = context["carts"].map(cart => cart.ownerId)

            console.log(ownerIds)
        }


        // console.log(typeof carts)
        // console.log(Object.getPrototypeOf(carts))
        // console.log(carts.constructor)
        // console.log(Object.getPrototypeOf(carts.constructor))
        // console.log(carts)
        return (await UserModel.findById(cart.ownerId))!
    }
}