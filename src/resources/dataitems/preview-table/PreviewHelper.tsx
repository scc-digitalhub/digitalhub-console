// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    GRID_DATETIME_COL_DEF,
    GRID_DATE_COL_DEF,
    GridCellParams,
    GridComparatorFn,
    GridRenderCellParams,
    gridDateComparator,
    gridNumberComparator,
    gridStringOrNumberComparator,
} from '@mui/x-data-grid';
import * as changeCase from 'change-case';
import clsx from 'clsx';
import { ExpandableCellWrapper } from './GridCellExpand';
import { PreviewHeaderCell } from './PreviewHeaderCell';

export class PreviewHelper {
    static invalidComparator = (
        isFirstValueInvalid: boolean,
        isSecondValueInvalid: boolean
    ) => {
        if (isFirstValueInvalid && isSecondValueInvalid) {
            return 0;
        }
        if (isFirstValueInvalid) {
            return -1;
        }
        return 1;
    };

    static invalidDateComparator = (
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

    static stringComparator: GridComparatorFn = (v1, v2, param1, param2) => {
        const row1 = param1.api.getRow(param1.id);
        const row2 = param2.api.getRow(param2.id);
        const isFirstValueInvalid = PreviewHelper.isContentInvalid(
            row1,
            param1.field
        );
        const isSecondValueInvalid = PreviewHelper.isContentInvalid(
            row2,
            param2.field
        );

        if (isFirstValueInvalid || isSecondValueInvalid) {
            return PreviewHelper.invalidComparator(
                isFirstValueInvalid,
                isSecondValueInvalid
            );
        }
        return gridStringOrNumberComparator(v1, v2, param1, param2);
    };

    static numberComparator: GridComparatorFn = (v1, v2, param1, param2) => {
        const row1 = param1.api.getRow(param1.id);
        const row2 = param2.api.getRow(param2.id);
        const isFirstValueInvalid = PreviewHelper.isContentInvalid(
            row1,
            param1.field
        );
        const isSecondValueInvalid = PreviewHelper.isContentInvalid(
            row2,
            param2.field
        );

        if (isFirstValueInvalid || isSecondValueInvalid) {
            return PreviewHelper.invalidComparator(
                isFirstValueInvalid,
                isSecondValueInvalid
            );
        }
        return gridNumberComparator(v1, v2, param1, param2);
    };

    static dateComparator: GridComparatorFn = (v1, v2, param1, param2) => {
        const row1 = param1.api.getRow(param1.id);
        const row2 = param2.api.getRow(param2.id);
        const isFirstValueInvalid = PreviewHelper.isContentInvalid(
            row1,
            param1.field
        );
        const isSecondValueInvalid = PreviewHelper.isContentInvalid(
            row2,
            param2.field
        );

        if (isFirstValueInvalid || isSecondValueInvalid) {
            return PreviewHelper.invalidComparator(
                isFirstValueInvalid,
                isSecondValueInvalid
            );
        }

        const isFirstDateInvalid = v1 && isNaN(v1);
        const isSecondDateInvalid = v2 && isNaN(v2);
        if (isFirstDateInvalid || isSecondDateInvalid) {
            return PreviewHelper.invalidDateComparator(
                isFirstDateInvalid,
                isSecondDateInvalid
            );
        }

        return gridDateComparator(v1, v2, param1, param2);
    };

    //TODO: optimize this method
    static getBasicFields = (columnDescriptor: any, translations: any) => {
        const { name } = columnDescriptor;

        const basicFields = {
            field: changeCase.camelCase(name),
            flex: 1,
            minWidth: 120,
            headerAlign: 'left',
            align: 'left',
            cellClassName: (params: GridCellParams) => {
                const isContentInvalid = PreviewHelper.isContentInvalid(
                    params.row,
                    params.field
                );
                return clsx({
                    invalid: isContentInvalid,
                });
            },
            renderHeader: () => (
                <PreviewHeaderCell columnDescriptor={columnDescriptor} />
            ),
            valueFormatter: (value, row, column) => {
                if (PreviewHelper.isContentInvalid(row, column.field)) {
                    return translations.invalidValue;
                }
                return value;
            },
            sortComparator: PreviewHelper.stringComparator,
            renderCell: (params: GridRenderCellParams<any>) => (
                <ExpandableCellWrapper params={params} />
            ),
        };

        return basicFields;
    };

    /**
     * Method to obtain the fields for a column according to its characteristics (type and, if available, format)
     */
    static getColumnFields = (columnDescriptor: any, translations: any) => {
        if (PreviewHelper.isUnsupportedColumn(columnDescriptor)) {
            const fieldsForUnsupportedColumn = {
                sortable: false,
                filterable: false,
                cellClassName: () => clsx('unsupported'),
                headerClassName: () => clsx('unsupported'),
                valueFormatter: () => '',
                renderHeader: () => (
                    <PreviewHeaderCell
                        columnDescriptor={columnDescriptor}
                        isUnsupportedColumn={true}
                    />
                ),
                renderCell: () => '',
                minWidth: 220,
            };

            return fieldsForUnsupportedColumn;
        }

        const { type } = columnDescriptor;

        switch (type) {
            case 'string':
                return null;
            case 'number':
                return {
                    type: 'number',
                    sortComparator: PreviewHelper.numberComparator,
                };
            case 'integer':
                return {
                    type: 'number',
                    sortComparator: PreviewHelper.numberComparator,
                };
            case 'boolean':
                return {
                    type: 'boolean',
                    sortComparator: PreviewHelper.numberComparator,
                };
            case 'date':
                return {
                    ...GRID_DATE_COL_DEF,
                    resizable: false,
                    type: 'date',
                    valueFormatter: (value, row, column) => {
                        if (value === null || value === undefined) return value;
                        if (
                            PreviewHelper.isContentInvalid(
                                row,
                                column.field,
                                Type.InvalidValue
                            )
                        )
                            return translations.invalidValue;
                        if (
                            PreviewHelper.isContentInvalid(
                                row,
                                column.field,
                                Type.InvalidDate
                            )
                        )
                            return translations.invalidDate;
                        //manage date properly (UTC time offsets, right locale)
                        return value.toLocaleDateString();
                    },
                    minWidth: 120,
                    sortComparator: PreviewHelper.dateComparator,
                };
            case 'time':
                return null;
            case 'datetime':
                return {
                    ...GRID_DATETIME_COL_DEF,
                    resizable: false,
                    valueFormatter: (value, row, column) => {
                        if (value === null || value === undefined)
                            return value;
                        if (
                            PreviewHelper.isContentInvalid(
                                row,
                                column.field,
                                Type.InvalidValue
                            )
                        )
                            return translations.invalidValue;
                        if (
                            PreviewHelper.isContentInvalid(
                                row,
                                column.field,
                                Type.InvalidDatetime
                            )
                        )
                            return translations.invalidDatetime;
                        //manage datetime properly (UTC time offsets, right locale)
                        return value.toLocaleString();
                    },
                    minWidth: 120,
                    sortComparator: PreviewHelper.dateComparator,
                };
            case 'year':
                return null;
            case 'yearmonth':
                return null;
            case 'duration':
                return null;
            case 'geopoint':
                return null;
            default:
                return null;
        }
    };

    static getValue = (value: any, columnDescriptor: any): Value => {
        if (value === null || value === undefined) return new Value(value);

        if (PreviewHelper.isUnsupportedColumn(columnDescriptor)) {
            return new Value(value.toString(), false, Type.UnsupportedColumn);
        }

        const { type, format } = columnDescriptor;
        // The maximum allowed length for values returned using the "toString" method is 10000
        //TODO: check the values that are returned with the use of the "toString" method
        switch (type) {
            case 'string':
                return PreviewHelper.stringTransform(value);
            case 'number':
                return PreviewHelper.numberTransform(value);
            case 'integer':
                return PreviewHelper.integerTransform(value);
            case 'boolean':
                return PreviewHelper.booleanTransform(value);
            case 'date':
                return PreviewHelper.dateTransform(value, type);
            case 'time':
                return new Value(value.toString());
            case 'datetime':
                return PreviewHelper.dateTransform(value, type);
            case 'year':
                return new Value(value.toString());
            case 'yearmonth':
                return new Value(value.toString());
            case 'duration':
                return new Value(value.toString());
            case 'geopoint':
                return PreviewHelper.geopointTransform(value, format);
            default:
                return new Value(value.toString(), false, Type.InvalidValue);
        }
    };

    static stringTransform = (value: any) => {
        return new Value(value.toString());
    };

    static integerTransform = (value: any) =>
        typeof value === 'number' && !Number.isNaN(value)
            ? new Value(value)
            : typeof value === 'string' && !Number.isNaN(parseInt(value))
            ? new Value(parseInt(value))
            : new Value(value.toString(), false, Type.InvalidValue);

    static numberTransform = (value: any) =>
        //TODO: manage the following properties: decimalChar, groupChar, bareNumber
        typeof value === 'number' && !Number.isNaN(value)
            ? new Value(value)
            : typeof value === 'string' && !Number.isNaN(parseFloat(value))
            ? new Value(parseFloat(value))
            : new Value(value.toString(), false, Type.InvalidValue);

    static booleanTransform = (value: any) =>
        typeof value === 'boolean'
            ? new Value(value)
            : new Value(value.toString(), false, Type.InvalidValue);

    static dateTransform = (value: any, type: string) => {
        if (typeof value === 'string' || typeof value === 'number') {
            const date = new Date(value);
            if (!isNaN(date)) return new Value(date);
            else if (type === 'date')
                return new Value(value.toString(), false, Type.InvalidDate);
            return new Value(value.toString(), false, Type.InvalidDatetime);
        } else {
            return new Value(value.toString(), false, Type.InvalidValue);
        }
    };

    static geopointTransform = (value: any, format?: string) => {
        //TODO: decide if and how to manage the "array" format. Now it is invalid
        switch (format) {
            case 'object':
                if (
                    value.lon &&
                    value.lat &&
                    typeof value.lon === 'number' &&
                    typeof value.lat === 'number'
                ) {
                    return new Value(`${value.lon}, ${value.lat}`);
                } else
                    return new Value(
                        value.toString(),
                        false,
                        Type.InvalidValue
                    );
            default:
                if (typeof value === 'string') return new Value(value);
                else
                    return new Value(
                        value.toString(),
                        false,
                        Type.InvalidValue
                    );
        }
    };

    static isContentInvalid(row: any, field: string, type?: Type) {
        return row.invalidFieldsInfo?.some((info: InvalidFieldInfo) => {
            return (
                info.field === field && (!type || info.invalidityType === type)
            );
        });
    }

    /**
     * Determines if the given column is unsupported based on its type and format.
     * Combinations of column types and formats, if present, that are not supported:
     * - string with binary format
     * - object
     * - array
     * - geopoint with array format
     * - geojson
     * - any
     */
    static isUnsupportedColumn = (columnDescriptor: any) => {
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
}

export enum Type {
    InvalidValue = 'INVALID_VALUE',
    UnsupportedColumn = 'UNSUPPORTED_COLUMN',
    InvalidDate = 'INVALID_DATE',
    InvalidDatetime = 'INVALID_DATETIME',
}

export class Value {
    value: any;
    isValid: boolean;
    invalidityType?: Type;

    constructor(value: any, isValid = true, invalidityType?: Type) {
        this.value =
            value && typeof value === 'string' ? value.slice(0, 10000) : value;
        this.isValid = isValid;
        if (invalidityType) this.invalidityType = invalidityType;
    }
}

export class InvalidFieldInfo {
    field: string;
    invalidityType: Type;

    constructor(field: string, invalidityType: Type) {
        this.field = field;
        this.invalidityType = invalidityType;
    }
}
