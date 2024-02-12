import {
    GRID_DATETIME_COL_DEF,
    GRID_DATE_COL_DEF,
    GridComparatorFn,
    GridValueFormatterParams,
    gridDateComparator,
    gridNumberComparator,
    gridStringOrNumberComparator,
} from '@mui/x-data-grid';
import clsx from 'clsx';

const unsupportedComparator = (
    isFirstValueUnsupported: boolean,
    isSecondValueUnsupported: boolean
) => {
    if (isFirstValueUnsupported && isSecondValueUnsupported) {
        return 0;
    }
    if (isFirstValueUnsupported) {
        return -1;
    }
    return 1;
};

const invalidDateComparator = (
    isFirstDateInvalid: boolean,
    isSecondDateInvalid: boolean
) => {
    if (isFirstDateInvalid && isSecondDateInvalid) {
        return 0;
    }
    if (isFirstDateInvalid) {
        return -1;
    }
    return 1;
};

export const stringComparator: GridComparatorFn = (v1, v2, param1, param2) => {
    const isFirstValueUnsupported = isUnsupported(v1);
    const isSecondValueUnsupported = isUnsupported(v2);
    if (isFirstValueUnsupported || isSecondValueUnsupported) {
        return unsupportedComparator(
            isFirstValueUnsupported,
            isSecondValueUnsupported
        );
    }
    return gridStringOrNumberComparator(v1, v2, param1, param2);
};

const numberComparator: GridComparatorFn = (v1, v2, param1, param2) => {
    const isFirstValueUnsupported = isUnsupported(v1);
    const isSecondValueUnsupported = isUnsupported(v2);
    if (isFirstValueUnsupported || isSecondValueUnsupported) {
        return unsupportedComparator(
            isFirstValueUnsupported,
            isSecondValueUnsupported
        );
    }
    return gridNumberComparator(v1, v2, param1, param2);
};

const dateComparator: GridComparatorFn = (v1, v2, param1, param2) => {
    const isFirstValueUnsupported = isUnsupported(v1);
    const isSecondValueUnsupported = isUnsupported(v2);
    if (isFirstValueUnsupported || isSecondValueUnsupported) {
        return unsupportedComparator(
            isFirstValueUnsupported,
            isSecondValueUnsupported
        );
    }

    const isFirstDateInvalid = v1 && isNaN(v1);
    const isSecondDateInvalid = v2 && isNaN(v2);
    if (isFirstDateInvalid || isSecondDateInvalid) {
        return invalidDateComparator(isFirstDateInvalid, isSecondDateInvalid);
    }

    return gridDateComparator(v1, v2, param1, param2);
};

//method to get column type and, if necessary, valueGetter
export const getTypeFields = (fieldDescriptor: any, translations: any) => {
    const { type, format } = fieldDescriptor;

    const unsupportedFields = {
        sortable: false,
        filterable: false,
        cellClassName: () => clsx('unsupported'),
    };

    switch (type) {
        case 'string':
            switch (format) {
                case 'binary':
                    return unsupportedFields;
            }
            break;
        case 'number':
            return {
                type: 'number',
                sortComparator: numberComparator,
            };
        case 'integer':
            return {
                type: 'number',
                sortComparator: numberComparator,
            };
        case 'boolean':
            return {
                type: 'boolean',
                minWidth: 40,
                sortComparator: numberComparator,
            };
        case 'object':
            //TODO: decide how to handle this case
            return unsupportedFields;
        case 'array':
            return unsupportedFields;
        case 'date':
            return {
                ...GRID_DATE_COL_DEF,
                resizable: false,
                type: 'date',
                valueFormatter: (params: GridValueFormatterParams<any>) => {
                    if (params.value === null || params.value === undefined)
                        return params.value;
                    if (isUnsupported(params.value))
                        return translations.unsupported;
                    if (isNaN(params.value)) return translations.invalidDate;
                    return params.value.toLocaleDateString('en-GB');
                },
                minWidth: 120,
                sortComparator: dateComparator,
            };
        case 'datetime':
            return {
                ...GRID_DATETIME_COL_DEF,
                resizable: false,
                valueFormatter: (params: GridValueFormatterParams<any>) => {
                    if (params.value === null || params.value === undefined)
                        return params.value;
                    if (isUnsupported(params.value))
                        return translations.unsupported;
                    if (isNaN(params.value))
                        return translations.invalidDatetime;
                    return params.value.toLocaleString('en-GB', {
                        timeZone: 'UTC',
                    });
                },
                minWidth: 160,
                sortComparator: dateComparator,
            };
        //TODO: decide how to manage the "geopoint" format
        //case 'geopoint'
        case 'geojson':
            return unsupportedFields;
        case 'any':
            return unsupportedFields;
        default:
            return null;
    }
};

export const getValue = (value: any, fieldDescriptor: any) => {
    if (value === null || value === undefined) return value;
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
        if (isNaN(date)) {
            console.error('Invalid date format');
        }
        return date;
    } else {
        return unsupported;
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
