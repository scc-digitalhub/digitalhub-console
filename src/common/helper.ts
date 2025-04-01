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
    regex(ALPHANUMERIC_REGEX, 'messages.validation.wrongChar')
);

export const isValidKind = (kinds: any[]) => (value, values?) => {
    return !isEmpty(value) && !kinds.find(k => k.id === value)
        ? 'messages.validation.invalidKind'
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
    return p1 + p2 + p3;
};

export const keyParser = (
    key: string
): {
    project: string | undefined;
    resource: string | undefined;
    kind: string | undefined;
    name: string | undefined;
    id: string | undefined;
} => {
    const result = {
        project: undefined as string | undefined,
        resource: undefined as string | undefined,
        kind: undefined as string | undefined,
        name: undefined as string | undefined,
        id: undefined as string | undefined,
    };

    if (key?.startsWith('store://')) {
        //store key is a URI
        const url = new URL('http://' + key.substring('store://'.length));

        //project is hostname
        result.project = url.hostname;

        //details are in path variables
        const vars = url.pathname.substring(1).split('/');

        if (vars.length == 3) {
            result.resource = vars[0] + 's';
            result.kind = vars[1];

            const np = vars[2].split(':');
            result.name = np[0];
            result.id = np.length == 2 ? np[1] : undefined;
        }
    }

    return result;
};

export const functionParser = (
    key: string
): {
    project: string | undefined;
    kind: string | undefined;
    name: string | undefined;
    id: string | undefined;
} => {
    // python+run://prj2/f4a21377-fb59-41fe-a16e-157ee5598f28
    const rgx =
        /([a-zA-Z\+\-\_0-9]+):\/\/([a-zA-Z\-\_0-9]+)\/([a-zA-Z\-\_0-9]+):([a-zA-Z\-\_0-9]+)/;
    const result = {
        project: undefined as string | undefined,
        kind: undefined as string | undefined,
        name: undefined as string | undefined,
        id: undefined as string | undefined,
    };

    if (key) {
        const pp = key.match(rgx);

        result.kind = pp && pp[1] ? pp[1] : undefined;
        result.project = pp && pp[2] ? pp[2] : undefined;
        result.name = pp && pp[3] ? pp[3] : undefined;
        result.id = pp && pp[4] ? pp[4] : undefined;
    }

    return result;
};

export const taskParser = (
    key: string
): {
    project: string | undefined;
    kind: string | undefined;
    id: string | undefined;
} => {
    // python+run://prj2/f4a21377-fb59-41fe-a16e-157ee5598f28
    const rgx =
        /([a-zA-Z\+\-\_0-9]+):\/\/([a-zA-Z\-\_0-9]+)\/([a-zA-Z\-\_0-9]+)/;
    const result = {
        project: undefined as string | undefined,
        kind: undefined as string | undefined,
        id: undefined as string | undefined,
    };

    if (key) {
        const pp = key.match(rgx);

        result.kind = pp && pp[1] ? pp[1] : undefined;
        result.project = pp && pp[2] ? pp[2] : undefined;
        result.id = pp && pp[3] ? pp[3] : undefined;
    }

    return result;
};
