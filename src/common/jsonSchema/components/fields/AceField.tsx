// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ErrorSchema,
    FieldProps,
    FormContextType,
    getUiOptions,
    getWidget,
    RJSFSchema,
    StrictRJSFSchema,
} from '@rjsf/utils';
import { useCallback } from 'react';

function AceField<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: FieldProps<T, S, F>) {
    const {
        schema,
        name,
        uiSchema,
        idSchema,
        formData,
        required,
        disabled = false,
        readonly = false,
        autofocus = false,
        onChange,
        onBlur,
        onFocus,
        registry,
        rawErrors,
        hideError,
    } = props;

    const { title } = schema;
    const { widgets, formContext, globalUiOptions, schemaUtils } = registry;
    const {
        widget = 'ace',
        placeholder = '',
        title: uiTitle,
        ...options
    } = getUiOptions<T, S, F>(uiSchema, globalUiOptions);
    const Widget = getWidget<T, S, F>(schema, widget, widgets);
    const label = uiTitle ?? title ?? name;
    const displayLabel = schemaUtils.getDisplayLabel(
        schema,
        uiSchema,
        globalUiOptions
    );

    const handleChange = useCallback(
        (
            value: FieldProps<T, S, F>['value'],
            errorSchema?: ErrorSchema<T>,
            id?: string
        ) => {
            let obj = formData;
            try {
                obj = JSON.parse(value);
            } catch (e: any) {
                //fail silently and keep last valid value
            }
            onChange(obj, errorSchema, id);
        },
        [onChange]
    );

    return (
        <Widget
            options={{ ...options }}
            schema={schema}
            uiSchema={uiSchema}
            id={idSchema.$id}
            name={name}
            label={label}
            hideLabel={!displayLabel}
            hideError={hideError}
            value={JSON.stringify(formData)}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            required={required}
            disabled={disabled}
            readonly={readonly}
            formContext={formContext}
            autofocus={autofocus}
            registry={registry}
            placeholder={placeholder}
            rawErrors={rawErrors}
        />
    );
}

export default AceField;
