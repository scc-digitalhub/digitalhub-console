// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Autocomplete, Box, CircularProgress, TextField } from '@mui/material';
import { InputHelperText, useTranslate } from 'react-admin';
import { StorePathInputProps, StoreSearchItem } from './types';
import { SelectedResourceCard } from './SelectedResourceCard';
import { StoreResourceSummary } from './StoreResourceSummary';
import { useStorePathInput } from './useStorePathInput';

export type { StorePathInputProps, StoreSearchItem } from './types';

/**
 * Form input for a resource path, with autocomplete over the store search.
 *
 * - Typing searches store entities (optionally narrowed by `filters`) and
 *   shows matches in a dropdown; free text is accepted too (e.g. s3://, http://).
 * - Picking an option writes its key (store://...) into the form field and
 *   shows the selected resource in a card below the input.
 * - When the field already holds a store:// key (edit, template, paste),
 *   the matching entity is resolved and shown in the card.
 */
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
                // MUI's key is label-based (not unique): drop it and use the option id
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                renderOption={({ key: _key, ...optionProps }, option) => (
                    <li key={option.id} {...optionProps}>
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
