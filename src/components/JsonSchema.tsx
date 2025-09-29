// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    JsonSchemaField as RaJsonSchemaField,
    JsonSchemaFieldProps,
    JSONSchemaFormatInputProps,
    JsonSchemaInput as RaJsonSchemaInput,
} from '@dslab/ra-jsonschema-input';

import { MuiChipsInputWidget } from '../jsonSchema/MuiChipsInputWidget';
import { CoreResourceFieldTemplate } from '../jsonSchema/CoreResourceFieldTemplate';
import { KeyValueFieldTemplate } from '../jsonSchema/KeyValueFieldTemplate';
import { VolumeResourceFieldTemplate } from '../jsonSchema/VolumeResourceFieldTemplate';
import { AceEditorWidget } from '../jsonSchema/AceEditorWidget';
import TitleField from '../jsonSchema/TitleField';
import { JsonParamsWidget } from '../jsonSchema/JsonParamsWidget';
import MultiSchemaFieldTemplate from '../jsonSchema/MultiSchemaFieldTemplate';
import WrapIfAdditionalTemplate from '../jsonSchema/WrapIfAdditionalTemplate';
import AceField from '../jsonSchema/AceField';

const customWidgets = {
    tagsChipInput: MuiChipsInputWidget,
    parameters: JsonParamsWidget,
    'java+base64': AceEditorWidget,
    'javascript+base64': AceEditorWidget,
    markdown: AceEditorWidget,
    html: AceEditorWidget,
    yaml: AceEditorWidget,
    css: AceEditorWidget,
    json: AceEditorWidget,
    'json+base64': AceEditorWidget,
    sql: AceEditorWidget,
    richtext: AceEditorWidget,
    xml: AceEditorWidget,
    ace: AceEditorWidget,
};
const customTemplates = {
    CoreResourceFieldTemplate,
    KeyValueFieldTemplate,
    VolumeResourceFieldTemplate,
    TitleFieldTemplate: TitleField,
    MultiSchemaFieldTemplate,
    WrapIfAdditionalTemplate,
};
const customFields = {
    AceField,
};

export const JsonSchemaField = (props: JsonSchemaFieldProps) => {
    return (
        <RaJsonSchemaField
            {...props}
            customWidgets={customWidgets}
            templates={{ ...customTemplates, ...props.templates }}
        />
    );
};

export const JsonSchemaInput = (props: JSONSchemaFormatInputProps) => {
    const { schema, uiSchema, ...rest } = props;

    return (
        <RaJsonSchemaInput
            schema={schema}
            uiSchema={uiSchema}
            customWidgets={customWidgets}
            templates={{ ...customTemplates, ...props.templates }}
            fields={{ ...customFields }}
            {...rest}
        />
    );
};
