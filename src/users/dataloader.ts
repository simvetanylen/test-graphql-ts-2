import DataLoader from "dataloader";
import {User, UserModel} from "./User";

export function usersDataLoader() {
    return new DataLoader(async (ids: readonly string[]): Promise<User[]> => {
        console.log('fetch: ' + ids)
        return UserModel.find({
            _id: {
                $in: ids
            }
        })
    })
}