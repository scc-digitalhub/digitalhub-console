//method to get column type and, if necessary, valueGetter
export const getTypeFields = (fieldDescriptor: any) => {
    const { type } = fieldDescriptor;

    const unsupportedFields = { sortable: false, filterable: false };

    switch (type) {
        case 'number':
            return {
                type: 'number',
            };
        case 'integer':
            return {
                type: 'number',
            };
        case 'boolean':
            return {
                type: 'boolean',
            };
        case 'object':
            //TODO: decide how to handle this case
            return unsupportedFields;
        case 'array':
            return unsupportedFields;
        case 'date':
            return {
                type: 'date',
            };
        case 'datetime':
            return {
                type: 'datetime',
            };
        case 'geojson':
            return unsupportedFields;
        case 'any':
            return unsupportedFields;
        default:
            return null;
    }
};

export const getValue = (value: any, fieldDescriptor: any) => {
    if (value === null || value === undefined) return '';
    const { type, format } = fieldDescriptor;

    //TODO: check the values (first of all the length) that are returned with the use of the toString method
    switch (type) {
        case 'string':
            return stringTransform(value, format);
        case 'number':
            return numberTransform(value);
        case 'integer':
            return integerTransform(value);
        case 'boolean':
            return booleanTransform(value);
        case 'object':
            //TODO: decide how to handle this case
            return unsupported;
        case 'array':
            return unsupported;
        case 'date':
            return dateTransform(value);
        case 'time':
            return value.toString();
        case 'datetime':
            return dateTimeTransform(value);
        case 'year':
            return value.toString();
        case 'month':
            return value.toString();
        case 'duration':
            return value.toString();
        case 'geopoint':
            return geopointTransform(value, format);
        case 'geojson':
            return unsupported;
        case 'any':
            return unsupported;
        default:
            return unsupported;
    }
};

const stringTransform = (value: any, format?: string) => {
    //TODO: max length check (1800)
    switch (format) {
        case 'binary':
            return unsupported;
        default:
            return value;
    }
};

const integerTransform = (value: any) =>
    typeof value === 'number' && !Number.isNaN(value)
        ? value
        : typeof value === 'string' && !Number.isNaN(parseInt(value))
        ? parseInt(value)
        : unsupported;

const numberTransform = (value: any) =>
    //TODO: manage the following properties: decimalChar, groupChar, bareNumber
    typeof value === 'number' && !Number.isNaN(value)
        ? value
        : typeof value === 'string' && !Number.isNaN(parseFloat(value))
        ? parseFloat(value)
        : unsupported;

const booleanTransform = (value: any) =>
    typeof value === 'boolean' ? value : unsupported;

const dateTransform = (value: any) => {
    if (typeof value === 'string' || typeof value === 'number') {
        try {
            return new Date(value);
            //return date.toLocaleDateString('en-GB');
        } catch (e) {
            console.error(e);
            return unsupported;
        }
    } else return unsupported;
};

const dateTimeTransform = (value: any) => {
    if (typeof value === 'string' || typeof value === 'number') {
        try {
            return new Date(value);
            //return date.toLocaleString('en-GB', { timeZone: 'UTC' });
        } catch (e) {
            console.error(e);
            return unsupported;
        }
    } else return unsupported;
};

const geopointTransform = (value: any, format?: string) => {
    //TODO: manage properly the "array" format
    switch (format) {
        case 'object':
            if (
                value.lon &&
                value.lat &&
                typeof value.lon === 'number' &&
                typeof value.lat === 'number'
            ) {
                return `${value.lon}, ${value.lat}`;
            } else return unsupported;
        case 'array':
            return unsupported;
        default:
            if (typeof value === 'string') return value;
            else return unsupported;
    }
};

interface Return {
    type: string;
}

export const isUnsupported = (value: any): value is Return =>
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'unsupported';

const unsupported: Return = {
    type: 'unsupported',
};
