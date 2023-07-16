export function copyObject<T>(source: T, fieldsToOverride: any = {}): T {
    return { ...source, ...fieldsToOverride};
}