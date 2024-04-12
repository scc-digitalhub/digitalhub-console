import React from 'react';
import { InputProps, useRecordContext } from 'react-admin';
import validator from '@rjsf/validator-ajv8';
import { RJSFSchema, RegistryFieldsType, RegistryWidgetsType, UiSchema,
    StrictRJSFSchema, FormContextType} from '@rjsf/utils';
import { Form } from '@rjsf/mui';
import { get, useController } from 'react-hook-form';
import { useRJSchema } from '@dslab/ra-jsonschema-input';

export const JsonSchemaInput = (props: JSONSchemaFormatInputProps) => {
    const {
        schema,
        uiSchema = {},
        label,
        helperText,
        resource:resourceFromProps,
        source,
        customWidgets,
        templates,
        fields
    } = props;
    const record = useRecordContext();

    const {
        field,
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
    const resource = resourceFromProps || "";
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

    return (
        <Form
            tagName={'div'}
            schema={rjsSchema}
            uiSchema={ruiSchema}
            templates={templates}
            fields={ fields }
            formData={field.value}
            validator={validator}
            onChange={(e: any) => update(e.formData)}
            omitExtraData={true}
            liveValidate={true}
            showErrorList={false}
            widgets={customWidgets}
        >
            <></>
        </Form>
    );
};

export type JSONSchemaFormatInputProps<T = any, S extends StrictRJSFSchema = RJSFSchema, F extends FormContextType = any> = Omit<InputProps,'resource'> & {
    schema: RJSFSchema | object | string;
    uiSchema?: UiSchema | object | string;
    templates?: any;
    resource?:string;
    fields?: RegistryFieldsType<T, S, F>;
    customWidgets?: RegistryWidgetsType;
};

export default JsonSchemaInput;
