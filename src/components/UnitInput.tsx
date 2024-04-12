import {
    Chip,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import { useState, FocusEvent } from 'react';
import { useTranslate } from 'react-admin';

export const UnitInput = function (props: WidgetProps) {
    const {
        id,
        value, 
        disabled,
        readonly,
        onBlur,
        onChange,
        onFocus,
    } = props;

    return (
        <div>
            {id}
        </div>
    );
};

