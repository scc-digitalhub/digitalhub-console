// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Autocomplete,
    Box,
    Chip,
    CircularProgress,
    TextField,
    Typography,
} from '@mui/material';
import { CommonInputProps, useInput, useTranslate } from 'react-admin';
import { SearchFilter } from '../../features/search/SearchProvider';
import {
    StoreSearchItem,
    useStorePathSearch,
} from '../../features/search/useStorePathSearch';
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

const defaultGetOptionValue = (item: StoreSearchItem) =>
    item.key ?? item.path ?? String(item.id);

const defaultGetOptionLabel = (item: StoreSearchItem) =>
    item.name ?? String(item.id);

export const StorePathInput = ({
    source,
    defaultValue,
    filters,
    getOptionValue = defaultGetOptionValue,
    getOptionLabel = defaultGetOptionLabel,
    readOnly,
    label,
    helperText,
    validate,
    onChange,
}: StorePathInputProps) => {
    const translate = useTranslate();

    // Riferimenti per le funzioni di estrazione dei valori e delle etichette delle opzioni
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
    // Stato locale per l'opzione selezionata e il valore di input visualizzato
    const [selectedOption, setSelectedOption] =
        useState<StoreSearchItem | null>(null);
    // Stato locale per il valore di input visualizzato, sincronizzato con l'opzione selezionata e il campo del form
    const [inputValue, setInputValue] = useState<string>(field.value ?? '');
    // Hook per la ricerca incrementale dei percorsi nello store:
    // restituisce le opzioni disponibili, lo stato di caricamento,
    // eventuali errori e l'elemento risolto corrispondente al valore corrente
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
                    getOptionLabel(selectedOption) === inputValue)
        ),
    });
    // Effetto per aggiornare l'opzione selezionata quando 
    // viene risolto un elemento corrispondente al valore corrente --> modifica
    useEffect(() => {
        if (resolved && getOptionValueRef.current(resolved) === field.value) {
            setSelectedOption(resolved);
        }
    }, [resolved, field.value]);

    // Mantiene il nome visualizzato se corrisponde all'opzione selezionata,
    // altrimenti sincronizza con eventuali modifiche esterne (template, edit, reset)
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
            setInputValue(getOptionLabelRef.current(selectedOption));
            return;
        }
        setSelectedOption(null);
        setInputValue(currentVal);
    }, [field.value, selectedOption]);

    // Risolve l'etichetta da visualizzare per il campo, utilizzando la traduzione se disponibile
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

    // Gestisce l'aggiornamento del valore del campo e chiama l'eventuale callback onChange esterna
    const handleValueUpdate = (nextValue: string) => {
        field.onChange(nextValue);
        onChange?.(nextValue);
    };

    return (
        // Componente Autocomplete per la selezione del percorso nello store, testo libero consentito
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
            // Determina se un'opzione è uguale al valore corrente, confrontando l'ID o il valore della stringa
            getOptionLabel={option =>
                typeof option === 'string' ? option : getOptionLabel(option)
            }
            // Gestisce i cambiamenti dell'input, aggiornando lo stato locale e il valore del campo,
            //  resetta selected  quando cambia
            onInputChange={(_, newInputValue, reason) => {
                if (reason === 'input') {
                    setSelectedOption(null);
                    setInputValue(newInputValue);
                    handleValueUpdate(newInputValue);
                } else if (reason === 'clear') {
                    setSelectedOption(null);
                    setInputValue('');
                    handleValueUpdate('');
                }
            }}
            // Gestisce i cambiamenti della selezione (quando l'utente seleziona un'opzione),
            //  aggiornando lo stato locale e il valore del campo. 3 casi gestiti: nessun valore, stringa, oggetto selezionato
            onChange={(_, newValue) => {
                if (!newValue) {
                    setSelectedOption(null);
                    setInputValue('');
                    handleValueUpdate('');
                    return;
                }
                if (typeof newValue === 'string') {
                    setSelectedOption(null);
                    setInputValue(newValue);
                    handleValueUpdate(newValue);
                    return;
                }
                const selectedKey = getOptionValue(newValue);
                const selectedLabel = getOptionLabel(newValue);
                setSelectedOption(newValue);
                setInputValue(selectedLabel);
                handleValueUpdate(selectedKey);
            }}
            // Personalizza il rendering di ciascuna opzione nell'elenco a discesa,
            //  mostrando etichetta, tipo e genere se disponibili
            // Utilizza Box e Typography per la disposizione e lo stile degli elementi
            renderOption={(props, option) => {
                const optionKey = getOptionValue(option);
                return (
                    <li {...props} key={option.id}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                py: 0.5,
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Typography variant="body2" fontWeight={600}>
                                    {getOptionLabel(option)}
                                </Typography>
                                {option.type && (
                                    <Chip
                                        size="small"
                                        label={option.type.toLowerCase()}
                                        variant="outlined"
                                    />
                                )}
                                {option.kind && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        ({option.kind})
                                    </Typography>
                                )}
                            </Box>
                            {optionKey && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontFamily: 'monospace' }}
                                >
                                    {optionKey}
                                </Typography>
                            )}
                        </Box>
                    </li>
                );
            }}
            renderInput={params => (
                <TextField
                    {...params}
                    label={resolvedLabel}
                    required={isRequired}
                    error={invalid}
                    helperText={
                        error?.message ??
                        (searchError
                            ? translate('ra.notification.data_provider_error')
                            : undefined) ??
                        (typeof helperText === 'string'
                            ? translate(helperText, { _: helperText })
                            : helperText)
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
    );
};
