export const toBase64 = <T = unknown>(val: T) => {
    const stringified = JSON.stringify(val);
    const base64String = btoa(stringified);
    return base64String;
};
