// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Autocomplete,
    Box,
    CircularProgress,
    TextField,
} from '@mui/material';
import { CommonInputProps, InputHelperText, useTranslate } from 'react-admin';
import { SearchFilter } from '../../features/search/SearchProvider';
import { StoreSearchItem } from '../../features/search/useStorePathSearch';
import { SelectedResourceCard } from './SelectedResourceCard';
import { StoreResourceSummary } from './StoreResourceSummary';
import { useStorePathInput } from '../../features/search/useStorePathInput';

export type { StoreSearchItem } from '../../features/search/useStorePathSearch';

export type StorePathInputProps = Omit<
    CommonInputProps,
    'defaultValue' | 'onChange'
> & {
    defaultValue?: string | null;
    filters?: SearchFilter[];
    getOptionValue?: (option: StoreSearchItem) => string;
    getOptionLabel?: (option: StoreSearchItem) => string;
    readOnly?: boolean;
    onChange?: (value: string) => void;
};

export const StorePathInput = (props: StorePathInputProps) => {
    const { readOnly, helperText } = props;
    const translate = useTranslate();
    const {
        field,
        error,
        invalid,
        isRequired,
        resolvedLabel,
        options,
        loading,
        searchError,
        selectedOption,
        inputValue,
        getOptionValue,
        getOptionLabel,
        handleInputChange,
        handleChange,
        handleClear,
    } = useStorePathInput(props);

    return (
        <>
            <Autocomplete<StoreSearchItem, false, false, true>
                freeSolo
                fullWidth
                disabled={readOnly}
                options={options}
                loading={loading}
                inputValue={inputValue}
                value={selectedOption ?? field.value ?? ''}
                filterOptions={x => x}
                isOptionEqualToValue={(option, val) =>
                    typeof val === 'string'
                        ? getOptionValue(option) === val
                        : option.id === val.id
                }
                getOptionLabel={option =>
                    typeof option === 'string' ? option : getOptionLabel(option)
                }
                onInputChange={handleInputChange}
                onChange={handleChange}
                renderOption={(optionProps, option) => (
                    <li {...optionProps} key={option.id}>
                        <Box sx={{ width: '100%', py: 0.5 }}>
                            <StoreResourceSummary
                                item={option}
                                resourceKey={getOptionValue(option)}
                            />
                        </Box>
                    </li>
                )}
                renderInput={params => (
                    <TextField
                        {...params}
                        label={resolvedLabel}
                        required={isRequired}
                        error={invalid}
                        helperText={
                            !error?.message && searchError ? (
                                translate('ra.notification.data_provider_error')
                            ) : (
                                <InputHelperText
                                    error={error?.message}
                                    helperText={helperText}
                                />
                            )
                        }
                        onBlur={field.onBlur}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {loading ? (
                                        <CircularProgress
                                            color="inherit"
                                            size={18}
                                        />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />

            {selectedOption && (
                <SelectedResourceCard
                    item={selectedOption}
                    resourceKey={getOptionValue(selectedOption)}
                    readOnly={readOnly}
                    onClear={handleClear}
                />
            )}
        </>
    );
};