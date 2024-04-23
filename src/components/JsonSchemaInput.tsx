import React, { useRef } from 'react';
import {  InputProps, useRecordContext } from 'react-admin';
import validator from '@rjsf/validator-ajv8';
import { CustomValidator, RJSFSchema, RegistryFieldsType, RegistryWidgetsType, UiSchema,ErrorTransformer,ErrorSchema } from '@rjsf/utils';
import { Form } from '@rjsf/mui';
import { get, useController,useForm } from 'react-hook-form';
import { useRJSchema } from '@dslab/ra-jsonschema-input';

export const JsonSchemaInput = (props: JSONSchemaFormatInputProps) => {
    const {
        schema,
        uiSchema = {},
        label,
        helperText,
        resource,
        source,
        customWidgets,
        customValidate,
        templates,
        fields,
        extraErrors,
        transformErrors
    } = props;
    const record = useRecordContext();

    const {
        field,
        fieldState,
        formState: { isLoading },
    } = useController({
        name: source,
        defaultValue: get(record, source, {}),
    });
    const { register, handleSubmit, formState: { errors },setError } = useForm();

    const onError = (error:any) => {
        console.log(error);
    } 
    const update = (data: any) => {
        if (!isLoading) {
            field.onChange(data);
            if (formRef.current)
            {
                formRef?.current?.validateForm();
                
            }
        }
    };

    const { schema: rjsSchema, uiSchema: ruiSchema } = useRJSchema({
        resource,
        source,
        schema,
        uiSchema,
        title: label && typeof label === 'string' ? label : undefined,
        description:
            helperText && typeof helperText === 'string'
                ? helperText
                : undefined,
    });

    console.log('uiSchema', ruiSchema);
    const formRef = useRef(null);
    return (
        <Form
            tagName={'div'}
            schema={rjsSchema}
            uiSchema={ruiSchema}
            templates={templates}
            fields={ fields }
            formData={field.value}
            validator={validator}
            onError={onError}
            onChange={(e: any) => update(e.formData)}
            omitExtraData={true}
            liveValidate={true}
            // showErrorList={false}
            widgets={customWidgets}
            customValidate={customValidate}
            transformErrors={transformErrors}
            extraErrors={extraErrors}
            showErrorList={'bottom'}
            ref={formRef}
        >
            <></>
        </Form>
    );
};

export type JSONSchemaFormatInputProps = InputProps & {
    schema: RJSFSchema | object | string;
    uiSchema?: UiSchema | object | string;
    templates?: object;
    fields?: RegistryFieldsType;
    customWidgets?: RegistryWidgetsType;
    customValidate?:CustomValidator;
    transformErrors?:ErrorTransformer;
    extraErrors?:ErrorSchema;
    showErrorList?:false | 'top' | 'bottom';
};

export default JsonSchemaInput;
