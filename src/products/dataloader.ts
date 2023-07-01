import DataLoader from "dataloader";
import {Product, ProductModel} from "./Product";

export function productsDataLoader() {
    return new DataLoader(async (ids: readonly string[]): Promise<Product[]> => {
        return ProductModel.find({
            _id: {
                $in: ids
            }
        })
    })
}