import { User } from "../models";
import { OptionalPromise } from "../../common/types";

export interface UserRepository {

    create(user: User): Promise<void>;

    ofName(name: string): OptionalPromise<User>;
}