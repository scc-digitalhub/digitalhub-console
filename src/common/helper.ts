import { isEmpty, regex } from 'react-admin';

export const hasWhiteSpace = s => {
    return /\s/g.test(s);
};
export const alphaNumericName = s => {
    return /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(s);
};

export const arePropsEqual = (oldProps: any, newProps: any) => {
    if (!newProps.record) return true;
    return Object.is(oldProps.record, newProps.record);
};

export const isAlphaNumeric = regex(
    /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/,
    'validation.wrongChar'
);

export const isValidKind = (kinds: any[]) => (value, values?) => {
    return !isEmpty(value) && !kinds.find(k => k.id === value)
        ? 'validation.invalidKind'
        : undefined;
};