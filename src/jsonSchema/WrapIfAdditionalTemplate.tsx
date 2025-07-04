// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { CSSProperties, FocusEvent } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {
    ADDITIONAL_PROPERTY_FLAG,
    FormContextType,
    RJSFSchema,
    StrictRJSFSchema,
    TranslatableString,
    WrapIfAdditionalTemplateProps,
} from '@rjsf/utils';

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
    } = props;
    const { templates, translateString } = registry;
    // Button templates are not overridden in the uiSchema
    const { RemoveButton } = templates.ButtonTemplates;
    const keyLabel = translateString(TranslatableString.KeyLabel, [label]);
    const additional = ADDITIONAL_PROPERTY_FLAG in schema;
    const btnStyle: CSSProperties = {
        flex: 1,
        paddingLeft: 6,
        paddingRight: 6,
        fontWeight: 'bold',
    };

    if (!additional) {
        return (
            <div className={classNames} style={style}>
                {children}
            </div>
        );
    }

    const handleBlur = ({ target }: FocusEvent<HTMLInputElement>) =>
        onKeyChange(target.value);

    return (
        <Grid
            container
            key={`${id}-key`}
            alignItems="center"
            spacing={2}
            className={classNames}
            style={style}
            sx={{ padding: readonly ? '18px 0' : '0px' }}
        >
            <Grid size="grow">
                <TextField
                    fullWidth={true}
                    required={required}
                    label={keyLabel}
                    defaultValue={label}
                    disabled={disabled || readonly}
                    id={`${id}-key`}
                    name={`${id}-key`}
                    onBlur={!readonly ? handleBlur : undefined}
                    type="text"
                />
            </Grid>
            <Grid size="grow">{children}</Grid>
            {!readonly && (
                <Grid>
                    <RemoveButton
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
