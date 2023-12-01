import {
    useInput,
    useTranslate,
    useTranslateLabel,
    InputProps,
    useRecordContext,
} from 'react-admin';
import validator from '@rjsf/validator-ajv8';
import React from 'react';
import { RJSFSchema, UiSchema, GenericObjectType } from '@rjsf/utils';
import { Form } from '@rjsf/mui';
import { get, useController } from 'react-hook-form';

export const JsonSchemaInput = (props: JSONSchemaFormatInputProps) => {
    const {
        schema,
        uiSchema = {},
        label,
        helperText,
        resource,
        source,
        onBlur,
        onChange,
    } = props;
    const translate = useTranslate();
    const translateLabel = useTranslateLabel();
    const record = useRecordContext();

    const {
        field,
        fieldState: { isTouched, error },
        formState: { isLoading },
    } = useController({
        name: source,
        defaultValue: get(record, source, {}),
    });

    const update = (data: any) => {
        if (!isLoading) {
            field.onChange(data);
        }
    };

    const rjsSchema: RJSFSchema =
        typeof schema === 'string'
            ? JSON.parse(schema)
            : (schema as RJSFSchema);

    const ruiSchema: UiSchema =
        typeof uiSchema === 'string'
            ? JSON.parse(uiSchema)
            : (uiSchema as UiSchema);

    //auto-add values from translation to uiSchema if missing
    const ui: GenericObjectType = ruiSchema as GenericObjectType;
    if (label && !('ui:title' in ui)) {
        ui['ui:title'] =
            typeof label === 'string'
                ? translate(label)
                : typeof label === 'boolean'
                ? translate(source)
                : '';
    }
    if (helperText && !('ui:description' in ui)) {
        ui['ui:description'] =
            typeof helperText === 'string' ? translate(helperText) : '';
    }

    //auto-enrich schema with titles from key when missing
    if (rjsSchema && 'properties' in rjsSchema) {
        for (const k in rjsSchema.properties) {
            const p: GenericObjectType = rjsSchema.properties[
                k
            ] as GenericObjectType;
            if (!('title' in p)) {
                p.title = k;
            }
            if (ui) {
                if (!(k in ui)) {
                    ui[k] = {};
                }

                if (!('ui:title' in ui[k])) {
                    //auto generate key and translate
                    ui[k]['ui:title'] = translateLabel({
                        source: source + '.' + k,
                        resource: resource,
                    });
                } else {
                    //translate user-provided
                    ui[k]['ui:title'] = translate(ui[k]['ui:title']);
                }
            }
        }
    }

    return (
        <Form
            tagName={'div'}
            schema={rjsSchema}
            uiSchema={ruiSchema}
            formData={field.value}
            validator={validator}
            onChange={(e: any) => update(e.formData)}
            omitExtraData={true}
            liveValidate={true}
            showErrorList={false}
        >
            <></>
        </Form>
    );
};

export type JSONSchemaFormatInputProps = InputProps & {
    schema: RJSFSchema | object | string;
    uiSchema?: UiSchema | object | string;
};

export default JsonSchemaInput;
