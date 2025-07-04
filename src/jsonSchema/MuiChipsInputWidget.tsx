// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Chip, FormControl, InputLabel, Stack } from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { MuiChipsInput } from 'mui-chips-input';
import { useState, FocusEvent } from 'react';
import { useTranslate } from 'react-admin';

export const MuiChipsInputWidget = function (props: WidgetProps) {
    const {
        id,
        name,
        value,
        label,
        disabled,
        readonly,
        onBlur,
        onChange,
        onFocus,
    } = props;
    const [list, setList] = useState<string[]>(value || []);
    const translate = useTranslate();
    const placeholder = translate('messages.type_and_press_enter');
    const helperText = translate('messages.double_click_to_edit');

    const handleChange = chips => {
        setList(chips);
        onChange(chips);
    };
    const handleBlur = ({ target }: FocusEvent<HTMLInputElement>) =>
        onBlur(id, target.value);
    const handleFocus = ({ target }: FocusEvent<HTMLInputElement>) =>
        onFocus(id, target.value);

    return !readonly ? (
        <MuiChipsInput
            value={list}
            onChange={handleChange}
            disabled={disabled}
            id={id}
            name={name}
            label={label}
            onBlur={!readonly ? handleBlur : undefined}
            onFocus={!readonly ? handleFocus : undefined}
            placeholder={placeholder}
            helperText={helperText}
        />
    ) : (
        <FormControl variant="standard" focused>
            <InputLabel htmlFor={id} disabled>
                {label}
            </InputLabel>

            <Stack direction={'row'} id={id} paddingTop={3}>
                {list.map(item => {
                    return <Chip label={item} key={item} sx={{ mr: 1 }} />;
                })}
            </Stack>
        </FormControl>
    );
};
