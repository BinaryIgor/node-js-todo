import { User } from "../user";
import { OptionalPromise } from "../../common/types";

export interface UserRepository {

    create(user: User): Promise<void>;

    ofName(name: string): OptionalPromise<User>;
}