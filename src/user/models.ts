import { UUID } from "../common/types";

export class User {
    constructor(readonly id: UUID, readonly name: string, readonly password: string) { }
}