// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { CSSProperties, FocusEvent } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {
    ADDITIONAL_PROPERTY_FLAG,
    ANY_OF_KEY,
    buttonId,
    FormContextType,
    ONE_OF_KEY,
    RJSFSchema,
    StrictRJSFSchema,
    WrapIfAdditionalTemplateProps,
} from '@rjsf/utils';
import { useTranslate } from 'react-admin';

/** The `WrapIfAdditional` component is used by the `FieldTemplate` to rename, or remove properties that are
 * part of an `additionalProperties` part of a schema.
 *
 * @param props - The `WrapIfAdditionalProps` for this component
 */
export default function WrapIfAdditionalTemplate<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: WrapIfAdditionalTemplateProps<T, S, F>) {
    const {
        children,
        classNames,
        style,
        disabled,
        id,
        label,
        onDropPropertyClick,
        onKeyChange,
        readonly,
        required,
        schema,
        uiSchema,
        registry,
        hideError,
        rawErrors,
    } = props;
    const translate = useTranslate();
    const { templates } = registry;
    // Button templates are not overridden in the uiSchema
    const { RemoveButton } = templates.ButtonTemplates;
    const additional = ADDITIONAL_PROPERTY_FLAG in schema;

    const classNamesList = ['form-group', classNames];
    if (!hideError && rawErrors && rawErrors.length > 0) {
        classNamesList.push('has-error has-danger');
    }
    const uiClassNames = classNamesList.join(' ').trim();

    if (!additional) {
        return (
            <div className={uiClassNames} style={style}>
                {children}
            </div>
        );
    }

    const isMultiSchema = ANY_OF_KEY in schema || ONE_OF_KEY in schema;

    const btnStyle: CSSProperties = {
        flex: 1,
        paddingLeft: 6,
        paddingRight: 6,
        fontWeight: 'bold',
    };

    const handleBlur = ({ target }: FocusEvent<HTMLInputElement>) =>
        onKeyChange(target && target.value);

    return (
        <Grid
            container
            key={`${id}-key`}
            alignItems="start"
            spacing={2}
            className={uiClassNames}
            style={style}
            sx={{
                padding: readonly ? '18px 0' : '0px',
            }}
        >
            <Grid size={isMultiSchema ? 3 : 'grow'}>
                <TextField
                    fullWidth={true}
                    required={required}
                    label={translate('fields.key.title')}
                    defaultValue={label}
                    disabled={disabled || readonly}
                    id={`${id}-key`}
                    name={`${id}-key`}
                    onBlur={!readonly ? handleBlur : undefined}
                    type="text"
                />
            </Grid>
            <Grid
                size={isMultiSchema ? 8 : 'grow'}
                sx={{
                    //remove extra margins from children to align at the top
                    '.MuiFormControl-marginDense:not(.MuiTextField-root)': {
                        marginY: 0,
                    },
                }}
            >
                {children}
            </Grid>
            {!readonly && (
                <Grid size={1}>
                    <RemoveButton
                        id={buttonId<T>(id, 'remove')}
                        iconType="default"
                        style={btnStyle}
                        disabled={disabled || readonly}
                        onClick={onDropPropertyClick(label)}
                        uiSchema={uiSchema}
                        registry={registry}
                    />
                </Grid>
            )}
        </Grid>
    );
}
