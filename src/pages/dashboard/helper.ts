export const convertToDate = value => {
    if (typeof value === 'string' || typeof value === 'number') {
        return new Date(value);
    }
    return value;
};