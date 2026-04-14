import  { useRef, useEffect } from 'react';
import { useInput, useResourceContext } from 'react-admin';
import { IChangeEvent } from '@rjsf/core';
import { RJSFSchema, RJSFValidationError } from '@rjsf/utils';
import { customizeValidator } from '@rjsf/validator-ajv8';
import Ajv2020 from 'ajv/dist/2020';
import { withTheme } from '@rjsf/core';
import { Theme } from '@rjsf/mui';
import { styled } from '@mui/system';

import {
    JSONSchemaFormatInputProps,
    ObjectFieldTemplate,
    ArrayFieldTemplate,
    ArrayFieldItemTemplate,
    DescriptionFieldTemplate,
    SchemaField,
    useRJSchema
} from '@dslab/ra-jsonschema-input';
import TitleFieldTemplate from './templates/TitleFieldTemplate'; // il tuo template custom

// Setup Validator
const validator = customizeValidator({ AjvClass: Ajv2020 });

// Setup Theme
Theme.templates = {
    ...Theme.templates,
    ObjectFieldTemplate,
    ArrayFieldTemplate,
    ArrayFieldItemTemplate,
    TitleFieldTemplate,
    DescriptionFieldTemplate,
};
Theme.fields = {
    ...Theme.fields,
    SchemaField,
};

const MuiForm = withTheme(Theme);
const PREFIX = 'RaJsonSchemaInput';
const StyledForm = styled(MuiForm, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})(() => ({}));

// Il componente
export const JsonSchemaInput = (props: JSONSchemaFormatInputProps) => {
    const {
        schema,
        uiSchema = {},
        label,
        helperText,
        source,
        customWidgets,
        customValidate,
        templates,
        fields,
        noHtml5Validate = false,
    } = props;

    const resource = useResourceContext(props);
    const errors = useRef<any[]>([]);

    // 1. Processa lo schema
    const { schema: rjsSchema, uiSchema: ruiSchema } = useRJSchema({
        resource,
        source,
        schema,
        uiSchema,
        title: label && typeof label === 'string' ? label : undefined,
        description: helperText && typeof helperText === 'string' ? helperText : undefined,
    });

    // 2. Mantiene una ref aggiornata per la validazione sincrona
    const schemaRef = useRef(rjsSchema);
    useEffect(() => {
        schemaRef.current = rjsSchema;
    }, [rjsSchema]);

    // 3. Validazione sincrona per React-Hook-Form
    const validate = (value: any) => {
        if (schemaRef.current) {
            const result = validator.validateFormData(value ?? {}, schemaRef.current);
            if (result && result.errors && result.errors.length > 0) {
                return result.errors[0].message || result.errors[0].stack;
            }
        }
        
        // Fallback per vecchi errori rjsf nativi
        if (errors.current && errors.current.length > 0) {
            const e: any = errors.current.find(() => true);
            return typeof e === 'string' ? e : e.stack;
        }

        return undefined;
    };

    // 4. Hook principale di react-admin
    const {
        field,
        fieldState: { error, invalid, isTouched },
        formState: { isLoading, isSubmitted },
    } = useInput({
        defaultValue: {},
        resource,
        source,
        validate,
    });

    const data = field.value;

    const onChange = (e: IChangeEvent<any, RJSFSchema, any>) => {
        setTimeout(() => {
            if (e.errors && e.errors.length > 0) {
                errors.current = e.errors;
            } else {
                errors.current = [];
            }
            if (e.formData) {
                field.onChange(e.formData);
            }
        }, 0);
    };

    const onError = (values: RJSFValidationError[]) => {
        errors.current = [];
        if (values && values.length > 0) {
            values.forEach(e => errors.current.push(e));
        }
    };

    return (
        <StyledForm
            className={PREFIX}
            tagName={'div'}
            schema={rjsSchema}
            uiSchema={ruiSchema}
            templates={templates}
            fields={fields}
            formData={data}
            formContext={{ resource, source }}
            validator={validator}
            onChange={onChange}
            onError={onError}
            omitExtraData={true}
            liveValidate={invalid || isTouched} 
            showErrorList={false}
            widgets={customWidgets}
            customValidate={customValidate}
            noHtml5Validate={noHtml5Validate}
        >
            <></>
        </StyledForm>
    );
};