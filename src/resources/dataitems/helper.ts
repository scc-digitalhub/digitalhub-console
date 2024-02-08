import { GridValueFormatterParams } from '@mui/x-data-grid';

//method to get column type and, if necessary, valueGetter
export const getTypeFields = (fieldDescriptor: any) => {
    const { type } = fieldDescriptor;

    const unsupportedFields = {
        sortable: false,
        filterable: false,
    };

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
                valueFormatter: (
                    params: GridValueFormatterParams<Date | null>
                ) => {
                    if (params.value === null) return 'Invalid date';
                    return params.value.toLocaleDateString('en-GB');
                },
            };
        case 'datetime':
            return {
                type: 'datetime',
                valueFormatter: (
                    params: GridValueFormatterParams<Date | null>
                ) => {
                    if (params.value === null) return 'Invalid datetime';
                    return params.value.toLocaleString('en-GB', {
                        timeZone: 'UTC',
                    });
                },
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
            return dateTransform(value);
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
        const date = new Date(value);
        if (!isNaN(date)) {
            return date;
        } else {
            console.error('Invalid date format');
            return null;
        }
    } else {
        return null;
    }
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
    value &&
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'unsupported';

const unsupported: Return = {
    type: 'unsupported',
};
