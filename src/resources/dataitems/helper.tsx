import {
    GRID_DATETIME_COL_DEF,
    GRID_DATE_COL_DEF,
    GridCellParams,
    GridComparatorFn,
    GridRenderCellParams,
    GridValueFormatterParams,
    gridDateComparator,
    gridNumberComparator,
    gridStringOrNumberComparator,
} from '@mui/x-data-grid';
import * as changeCase from 'change-case';
import clsx from 'clsx';
import { GridCellExpand } from './GridCellExpand';
import { PreviewHeaderCell } from './PreviewHeaderCell';

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
    const isFirstValueUnsupported = isUnsupportedValue(v1);
    const isSecondValueUnsupported = isUnsupportedValue(v2);
    if (isFirstValueUnsupported || isSecondValueUnsupported) {
        return unsupportedComparator(
            isFirstValueUnsupported,
            isSecondValueUnsupported
        );
    }
    return gridStringOrNumberComparator(v1, v2, param1, param2);
};

const numberComparator: GridComparatorFn = (v1, v2, param1, param2) => {
    const isFirstValueUnsupported = isUnsupportedValue(v1);
    const isSecondValueUnsupported = isUnsupportedValue(v2);
    if (isFirstValueUnsupported || isSecondValueUnsupported) {
        return unsupportedComparator(
            isFirstValueUnsupported,
            isSecondValueUnsupported
        );
    }
    return gridNumberComparator(v1, v2, param1, param2);
};

const dateComparator: GridComparatorFn = (v1, v2, param1, param2) => {
    const isFirstValueUnsupported = isUnsupportedValue(v1);
    const isSecondValueUnsupported = isUnsupportedValue(v2);
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

export function renderCellExpand(params: GridRenderCellParams<any, string>) {
    return (
        <GridCellExpand
            value={params.value || ''}
            width={params.colDef.computedWidth}
        />
    );
}

//TODO: optimize this method
export const getBasicFields = (columnDescriptor: any, translations: any) => {
    const { name } = columnDescriptor;

    const basicFields = {
        field: changeCase.camelCase(name),
        flex: 1,
        minWidth: 121,
        headerAlign: 'left',
        align: 'left',
        cellClassName: (params: GridCellParams) =>
            clsx({
                unsupported: isUnsupportedValue(params.value),
            }),
        renderHeader: () => (
            <PreviewHeaderCell columnDescriptor={columnDescriptor} />
        ),
        valueFormatter: (params: GridValueFormatterParams<any>) => {
            if (isUnsupportedValue(params.value)) {
                return translations.unsupported;
            }
            return params.value;
        },
        sortComparator: stringComparator,
    };

    return basicFields;
};

/**
 * Method to obtain the fields for a column according to its characteristics (type and, if available, format)
*/
export const getColumnFields = (columnDescriptor: any, translations: any) => {
    if (isUnsupportedColumn(columnDescriptor)) {
        const fieldsForUnsupportedColumn = {
            sortable: false,
            filterable: false,
            cellClassName: () => clsx('unsupported'),
            headerClassName: () => clsx('unsupported'),
            valueFormatter: () => '',
            renderHeader: () => (
                <PreviewHeaderCell
                    columnDescriptor={columnDescriptor}
                    isUnsupported={true}
                />
            ),
            minWidth: 220,
        };

        return fieldsForUnsupportedColumn;
    }

    const { type } = columnDescriptor;
    const renderCell = {
        renderCell: renderCellExpand,
    };

    switch (type) {
        case 'string':
            return renderCell;
        case 'number':
            return {
                type: 'number',
                sortComparator: numberComparator,
                ...renderCell,
            };
        case 'integer':
            return {
                type: 'number',
                sortComparator: numberComparator,
                ...renderCell,
            };
        case 'boolean':
            return {
                type: 'boolean',
                sortComparator: numberComparator,
            };
        case 'date':
            return {
                ...GRID_DATE_COL_DEF,
                resizable: false,
                type: 'date',
                valueFormatter: (params: GridValueFormatterParams<any>) => {
                    if (params.value === null || params.value === undefined)
                        return params.value;
                    if (isUnsupportedValue(params.value))
                        return translations.unsupported;
                    if (isNaN(params.value)) return translations.invalidDate;
                    return params.value.toLocaleDateString('en-GB');
                },
                sortComparator: dateComparator,
            };
        case 'time':
            return renderCell;
        case 'datetime':
            return {
                ...GRID_DATETIME_COL_DEF,
                resizable: false,
                valueFormatter: (params: GridValueFormatterParams<any>) => {
                    if (params.value === null || params.value === undefined)
                        return params.value;
                    if (isUnsupportedValue(params.value))
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
        case 'year':
            return renderCell;
        case 'yearmonth':
            return renderCell;
        case 'duration':
            return renderCell;
        case 'geopoint':
            return renderCell;
        default:
            return null;
    }
};

export const getValue = (value: any, columnDescriptor: any) => {
    if (value === null || value === undefined) return value;

    if (isUnsupportedColumn(columnDescriptor)) {
        return unsupported;
    }

    const { type, format } = columnDescriptor;
    // The maximum allowed length for values returned using the "toString" method is 10000
    //TODO: check the values that are returned with the use of the "toString" method
    switch (type) {
        case 'string':
            return stringTransform(value);
        case 'number':
            return numberTransform(value);
        case 'integer':
            return integerTransform(value);
        case 'boolean':
            return booleanTransform(value);
        case 'date':
            return dateTransform(value);
        case 'time':
            return value.toString().slice(0, 10000);
        case 'datetime':
            return dateTransform(value);
        case 'year':
            return value.toString().slice(0, 10000);
        case 'yearmonth':
            return value.toString().slice(0, 10000);
        case 'duration':
            return value.toString().slice(0, 10000);
        case 'geopoint':
            return geopointTransform(value, format);
        default:
            return unsupported;
    }
};

const stringTransform = (value: any) => {
    // The maximum allowed length for strings is 10000 
    return value.toString().slice(0, 10000);
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
    //TODO: decide if and how to manage the "array" format. Now it is unsupported
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
        default:
            if (typeof value === 'string') return value;
            else return unsupported;
    }
};

interface Return {
    type: string;
}

export const isUnsupportedValue = (value: any): value is Return =>
    value &&
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'unsupported';

const unsupported: Return = {
    type: 'unsupported',
};

/**
 * Determines if the given column is unsupported based on its type and format.
 * Combinations of column types and formats, if present, that are not supported:
  - string with binary format
  - object
  - array
  - geopoint with array format
  - geojson
  - any
 */
export const isUnsupportedColumn = (columnDescriptor: any) => {
    const { type, format } = columnDescriptor;

    switch (type) {
        case 'string': {
            switch (format) {
                case 'binary':
                    return true;
                default:
                    return false;
            }
        }
        case 'number':
            return false;
        case 'integer':
            return false;
        case 'boolean':
            return false;
        case 'object':
            //TODO: decide if and how to manage the "array" type
            return true;
        case 'array':
            return true;
        case 'date':
            return false;
        case 'time':
            return false;
        case 'datetime':
            return false;
        case 'year':
            return false;
        case 'yearmonth':
            return false;
        case 'duration':
            return false;
        case 'geopoint':
            switch (format) {
                //TODO: decide if and how to manage the "array" format
                case 'object':
                    return false;
                case 'array':
                    return true;
                default:
                    return false;
            }
        case 'geojson':
            return true;
        case 'any':
            return true;
        default:
            return true;
    }
};
