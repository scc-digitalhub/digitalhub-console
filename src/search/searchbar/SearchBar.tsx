// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';

import { useSearch } from './SearchContext';
import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Stack,
    TextField as MuiTextField,
    Menu,
    MenuItem,
    useTheme,
    BoxProps,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Form, RecordContextProvider } from 'react-admin';
import { useFormContext, useFormState, useController } from 'react-hook-form';
import { SearchFilter } from './SearchProvider';
import { InputProps } from 'ra-core';

const getEntries = (o, prefix = '') =>
    Object.entries(o).flatMap(([k, v]) =>
        Object(v) === v && !Array.isArray(v)
            ? getEntries(v, `${prefix}${k}.`)
            : [[`${prefix}${k}`, v]]
    );

function unflatten(object, keys, value) {
    const last = keys.pop();
    keys.reduce((o, k) => (o[k] = o[k] || {}), object)[last] = value;
}

const extractQ = (input: string, filterSeparator: string) => {
    const reg = new RegExp(
        `[^\\s${filterSeparator}"]+(${filterSeparator}"){1}[^${filterSeparator}]+"\\s?`,
        'g'
    );
    return input.replace(reg, '');
};

const isEmpty = value => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim().length === 0) ||
        (Array.isArray(value) && value.length === 0)
    );
};

export type SearchBarProps = BoxProps & {
    hintText?: string;
    to?: string;
    filters?:
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>[]
        | undefined;
    filterSeparator?: string;
};

export const SearchBar = (props: SearchBarProps) => {
    const {
        hintText = 'Search',
        to,
        filters,
        filterSeparator = ':',
        ...boxProps
    } = props;
    const { setParams } = useSearch();
    const navigate = useNavigate();
    const [record, setRecord] = useState({ id: '1', q: '' });
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClickShowFilters = event => setAnchorEl(event.currentTarget);
    const handleCloseFilters = useCallback(() => setAnchorEl(null), []);

    let conversionMap = {}; //{"metadata.name": {parse: f, format: f}}
    let defaultValues = {}; //{metadata: {name: "", description: ""}, type: ""}

    function isInputProps(object: any): object is InputProps {
        return 'source' in object && 'format' in object && 'parse' in object;
    }

    const cloneFilter = (
        element: React.ReactElement<
            any,
            string | React.JSXElementConstructor<any>
        >
    ) => {
        if (element !== undefined) {
            if (isInputProps(element.props)) {
                conversionMap[element.props.source] = {
                    parse: element.props.parse,
                    format: element.props.format,
                };
                unflatten(
                    defaultValues,
                    element.props.source.split('.'),
                    element.props.defaultValue
                );
                return React.cloneElement(element, {
                    format: undefined,
                    parse: undefined,
                });
            }
            return React.cloneElement(element);
        }
        return undefined;
    };

    let newFilters: any | undefined = undefined;

    if (filters !== undefined) {
        if (Array.isArray(filters)) {
            newFilters = filters.map(filter => cloneFilter(filter));
        } else {
            newFilters = cloneFilter(filters);
        }
    }

    const handleClickSearch = (filterInputs: any) => {
        console.log('searchbar filterInputs ', filterInputs);
        let q = filterInputs.q;
        let fq: SearchFilter[] = [];

        //build fq using parse functions defined on filters
        if (filterInputs !== undefined) {
            const flattenedInputs = Object.fromEntries(
                getEntries(filterInputs)
            );

            fq = Object.keys(conversionMap)
                .map(source => {
                    const value = flattenedInputs[source];
                    const parse = conversionMap[source].parse;
                    if (!isEmpty(value)) {
                        return {
                            field: source,
                            value: value,
                            filter: parse(value),
                        };
                    }
                    return null;
                })
                .filter(value => value !== null);
        }

        //write input values into context
        setParams({ q: extractQ(q, filterSeparator), fq: fq });
        //close filter box
        handleCloseFilters();
        if (to) {
            navigate(to);
        }
    };

    return (
        <Box {...boxProps}>
            <RecordContextProvider value={record}>
                <Stack>
                    <Form defaultValues={defaultValues}>
                        <div style={{ position: 'relative' }}>
                            <ActualSearchBar
                                hintText={hintText}
                                handleEnter={handleClickSearch}
                                handleClickShowFilters={handleClickShowFilters}
                                showFiltersIcon={!!filters}
                            />
                            <FilterBox
                                filters={newFilters}
                                handleClickSearch={handleClickSearch}
                                anchorElement={anchorEl}
                                handleCloseFilters={handleCloseFilters}
                            />
                        </div>
                    </Form>
                </Stack>
            </RecordContextProvider>
        </Box>
    );
};

const ActualSearchBar = (props: any) => {
    const { hintText, handleEnter, handleClickShowFilters, showFiltersIcon } =
        props;
    const { field } = useController({ name: 'q', defaultValue: '' });

    const formContext = useFormContext();

    const handleClickClear = () => {
        formContext.reset();
    };

    const theme = useTheme();

    return (
        <MuiTextField
            {...field}
            variant="outlined"
            id="search-input"
            type="text"
            placeholder={hintText}
            onKeyDown={e => {
                if (e.key === 'Enter' && field.value)
                    handleEnter(formContext.getValues());
            }}
            slotProps={{
                input: {
                    sx: {
                        width: '50ch',
                        backgroundColor: theme.palette.background.paper,
                        '& .MuiInputBase-input': {
                            padding: '8px 0',
                        },
                    },
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="cancel search input"
                                onClick={handleClickClear}
                                edge="end"
                            >
                                <ClearIcon />
                            </IconButton>
                            {showFiltersIcon && (
                                <IconButton
                                    aria-label="toggle filters visibility"
                                    onClick={handleClickShowFilters}
                                    edge="end"
                                >
                                    <TuneIcon />
                                </IconButton>
                            )}
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
};

const FilterBox = (props: any) => {
    const { filters, handleClickSearch, anchorElement, handleCloseFilters } =
        props;
    const [disabled, setDisabled] = useState(true);
    const formContext = useFormContext();
    const { isDirty } = useFormState();
    const open = Boolean(anchorElement);

    useEffect(() => {
        if (isDirty) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [isDirty]);

    if (!filters || (Array.isArray(filters) && filters.length === 0)) {
        return null;
    }

    return (
        <Menu
            id="search-filters"
            anchorEl={anchorElement}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={open}
            onClose={handleCloseFilters}
            sx={{
                '& .MuiMenuItem-root:hover': {
                    backgroundColor: 'inherit',
                    cursor: 'default',
                },
            }}
        >
            {filters.map((f, i) => (
                <MenuItem
                    disableTouchRipple
                    onKeyDown={e => e.stopPropagation()}
                    key={i}
                >
                    {f}
                </MenuItem>
            ))}
            <MenuItem disableTouchRipple sx={{ justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    aria-controls="search-button"
                    aria-label="search"
                    disabled={disabled}
                    onClick={() => handleClickSearch(formContext.getValues())}
                >
                    Search
                </Button>
            </MenuItem>
        </Menu>
    );
};

export default SearchBar;
