import path from "path";
import fs from "fs";

export async function pathUpFromCurrentDir(toFindPath: string) {
    let current = __dirname;

    for (let i = 0; i < 10; i++) {
        const dirs = await fs.promises.readdir(current);
        for (let d of dirs) {
            if (d.endsWith(toFindPath)) {
                return path.join(current, d);
            }
        }

        current = current.replace(`${path.sep}${path.basename(current)}`, "");
    }

    throw new Error(`Can't find ${toFindPath} starting from ${__dirname}`);
}