function envVariableOrDefault(key: string, defaultValue: any) {
    return process.env[key] ?? defaultValue;
}

function envVariableOrThrow(key: string) {
    const value = process.env[key];
    if (value) {
        return value;
    }
    throw new Error(`${key} env variable is required, but is undefined`);
}

function envVariableAsNumberOrThrow(key: string) {
    try {
        return parseInt(envVariableOrThrow(key));
    } catch (e) {
        throw new Error(`Can't parse ${key} to number`);
    }
}


export const config = () => ({
    port: envVariableOrDefault("PORT", 3000),
    db: {
        host: envVariableOrThrow("DB_HOST"),
        port: envVariableAsNumberOrThrow("DB_PORT"),
        database: envVariableOrThrow("DB_DATABASE"),
        user: envVariableOrThrow("DB_USER"),
        password: envVariableOrThrow("DB_PASSWORD"),
    }
});