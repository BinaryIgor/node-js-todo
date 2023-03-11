import { Config } from "./../config";
import { postgresDb } from "./postgres-db";

export const db = postgresDb(Config.db);