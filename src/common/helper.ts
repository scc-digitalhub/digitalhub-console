import { isEmpty, regex } from 'react-admin';

import Ajv from 'ajv/dist/2020';

const ajv = new Ajv({
    strictTypes: false,
    strict: false,
    allErrors: true,
}) 


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

export const validateSchemas = (value: any, schema: any[]) => {
    if (!schema || schema.length == 0) {
        return {};
    }
    const s = { ...schema[0] };
    for (let i = 1; i < schema.length; i++) {
        if (schema[i].$defs) s.$defs = { ...s.$defs, ...schema[i].$defs };
        if (schema[i].properties) s.properties = { ...s.properties, ...schema[i].properties };
        if (schema[i].required) s.required = [...s.required, ...schema[i].required];
    }
    s.additionalProperties = false;

    if (s.allOf && s.allOf.length == 0) {
        delete s.allOf
    }
    console.log('schema', s);

    const validate = ajv.compile(s);

    const valid = validate(value);
    if (!valid) {
        const errors = {};
        for (let i = 0; i < validate.errors!.length; i++) {
            errors[validate.errors![i].schemaPath] = validate.errors![i].message
        }
        console.log('errors', errors);
        return errors
    } else return {}
}
