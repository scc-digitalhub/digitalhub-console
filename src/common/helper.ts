import { isEmpty, regex } from 'react-admin';
import { ValidatorType, RJSFSchema } from '@rjsf/utils';
import memoize from 'lodash/memoize';

export const UUID_REGEX = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9._+-]+$/;

export const hasWhiteSpace = s => {
    return /\s/g.test(s);
};
export const alphaNumericName = s => {
    return ALPHANUMERIC_REGEX.test(s);
};

export const arePropsEqual = (oldProps: any, newProps: any) => {
    if (!newProps.record) return true;
    return Object.is(oldProps.record, newProps.record);
};

export const isAlphaNumeric = memoize(() =>
    regex(ALPHANUMERIC_REGEX, 'validation.wrongChar')
);

export const isValidKind = (kinds: any[]) => (value, values?) => {
    return !isEmpty(value) && !kinds.find(k => k.id === value)
        ? 'validation.invalidKind'
        : undefined;
};

export const isValidAgainstSchema =
    (ajv: ValidatorType<any, RJSFSchema, any>, schema: any) => value => {
        if (ajv == null || ajv == undefined) {
            return undefined;
        }
        if (!schema || !value) return undefined;
        try {
            const validation = ajv.validateFormData(value, schema);
            if (!validation.errors) {
                return undefined;
            }

            const errors = validation.errors?.map(
                e => e.property + ': ' + e.message
            );
            return errors?.join(',');
        } catch (error) {
            return 'error with validator';
        }
    };

export const randomId = () => {
    //generate a ~random id from (time + rand)
    let p3 = Date.now().toString(36);
    let p2 = Math.random().toString(16).substring(2, 7);
    let p1 = Math.random().toString(36).substring(2);
    return p1 + '-' + p2 + '-' + p3;
};
