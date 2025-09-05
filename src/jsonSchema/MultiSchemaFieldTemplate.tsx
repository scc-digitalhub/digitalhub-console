// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Grid } from '@mui/material';
import {
    FormContextType,
    MultiSchemaFieldTemplateProps,
    RJSFSchema,
    StrictRJSFSchema,
} from '@rjsf/utils';
import { cloneElement, isValidElement } from 'react';
import { useTranslate } from 'react-admin';

export default function MultiSchemaFieldTemplate<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: MultiSchemaFieldTemplateProps<T, S, F>) {
    const { selector, optionSchemaField } = props;
    const translate = useTranslate();

    return (
        <Grid container direction="row" spacing={2}>
            <Grid className="form-group" size={3}>
                {isValidElement<any>(selector)
                    ? cloneElement(selector, {
                          label: translate('fields.type.title'),
                      })
                    : selector}
            </Grid>
            <Grid size={9}>
                {optionSchemaField}
            </Grid>
        </Grid>
    );
}
