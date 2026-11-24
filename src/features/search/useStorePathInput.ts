// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { SyntheticEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AutocompleteInputChangeReason } from '@mui/material';
import { useInput, useTranslate } from 'react-admin';
import {
    StoreSearchItem,
    useStorePathSearch,
} from './useStorePathSearch';
import { StorePathInputProps } from '../../common/components/StorePathInput';

export const defaultGetOptionValue = (item: StoreSearchItem) =>
    item.key ?? item.path ?? String(item.id);

export const defaultGetOptionLabel = (item: StoreSearchItem) =>
    item.name ?? String(item.id);

export const useStorePathInput = ({
    source,
    defaultValue,
    filters,
    getOptionValue = defaultGetOptionValue,
    getOptionLabel = defaultGetOptionLabel,
    readOnly,
    label,
    validate,
    onChange,
}: StorePathInputProps) => {
    const translate = useTranslate();

    // Refs to access the latest getter functions without re-triggering effects
    const getOptionValueRef = useRef(getOptionValue);
    getOptionValueRef.current = getOptionValue;

    const getOptionLabelRef = useRef(getOptionLabel);
    getOptionLabelRef.current = getOptionLabel;

    const {
        field,
        fieldState: { error, invalid },
        isRequired,
    } = useInput({
        source,
        defaultValue: defaultValue ?? '',
        validate,
    });

    // Currently selected store item (when picked from autocomplete or resolved from URI)
    const [selectedOption, setSelectedOption] =
        useState<StoreSearchItem | null>(null);

    // Displayed text inside the input field
    const [inputValue, setInputValue] = useState<string>(field.value ?? '');

    // Incremental store search and store:// URI resolution
    const {
        options,
        loading,
        error: searchError,
        resolved,
    } = useStorePathSearch({
        text: inputValue,
        value: field.value ?? '',
        filters,
        paused: Boolean(
            readOnly ||
                (selectedOption &&
                    getOptionValue(selectedOption) === inputValue)
        ),
    });

    // Sync selectedOption when an item matching the current field value is resolved
    useEffect(() => {
        if (resolved && getOptionValueRef.current(resolved) === field.value) {
            setSelectedOption(resolved);
        }
    }, [resolved, field.value]);

    // Keep local input state aligned with external form changes (template, edit, reset)
    useEffect(() => {
        const currentVal = field.value ?? '';
        if (!currentVal) {
            setSelectedOption(null);
            setInputValue('');
            return;
        }
        if (
            selectedOption &&
            getOptionValueRef.current(selectedOption) === currentVal
        ) {
            setInputValue(currentVal);
            return;
        }
        setSelectedOption(null);
        setInputValue(currentVal);
    }, [field.value, selectedOption]);

    // Resolve field label with i18n fallback
    const resolvedLabel = useMemo(() => {
        if (typeof label === 'string') {
            return translate(label, { _: label });
        }
        return (
            label ??
            translate(`fields.${source}.title`, {
                _: translate(`fields.${source}`, { _: 'Path' }),
            })
        );
    }, [label, source, translate]);

    // Propagate value updates to react-hook-form and optional external onChange callback
    const handleValueUpdate = (nextValue: string) => {
        field.onChange(nextValue);
        onChange?.(nextValue);
    };

    // Reset selection, input text, and form field value
    const handleClear = () => {
        setSelectedOption(null);
        setInputValue('');
        handleValueUpdate('');
    };

    const handleInputChange = (
        _: SyntheticEvent,
        newInputValue: string,
        reason: AutocompleteInputChangeReason
    ) => {
        if (reason === 'input') {
            setSelectedOption(null);
            setInputValue(newInputValue);
            handleValueUpdate(newInputValue);
        } else if (reason === 'clear') {
            handleClear();
        }
    };

    const handleChange = (
        _: SyntheticEvent,
        newValue: string | StoreSearchItem | null
    ) => {
        if (!newValue) {
            handleClear();
            return;
        }
        if (typeof newValue === 'string') {
            setSelectedOption(null);
            setInputValue(newValue);
            handleValueUpdate(newValue);
            return;
        }

        const selectedKey = getOptionValue(newValue);
        setSelectedOption(newValue);
        setInputValue(selectedKey);
        handleValueUpdate(selectedKey);
    };

    return {
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
    };
};