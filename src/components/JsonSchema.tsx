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
import ArrayFieldTemplate from '../jsonSchema/ArrayFieldTemplate';
import ArrayFieldItemTemplate from '../jsonSchema/ArrayFieldItemTemplate';
import ObjectFieldTemplate from '../jsonSchema/ObjectFieldTemplate';
import WrapIfAdditionalTemplate from '../jsonSchema/WrapIfAdditionalTemplate';
// import { JsonSchemaFieldProps,JsonSchemaField as RaJsonSchemaField } from './JsonSchemaField';
const customWidgets = {
    tagsChipInput: MuiChipsInputWidget,
    'java+base64': AceEditorWidget,
    'javascript+base64': AceEditorWidget,
    markdown: AceEditorWidget,
    html: AceEditorWidget,
    yaml: AceEditorWidget,
    css: AceEditorWidget,
    json: AceEditorWidget,
    'json+base64': AceEditorWidget,
    sql: AceEditorWidget,
    'richtext': AceEditorWidget,
    xml: AceEditorWidget,
};
const customTemplates = {
    CoreResourceFieldTemplate,
    KeyValueFieldTemplate,
    VolumeResourceFieldTemplate,
    ArrayFieldTemplate,
    ArrayFieldItemTemplate,
    ObjectFieldTemplate,
    WrapIfAdditionalTemplate,
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
    return (
        <RaJsonSchemaInput
            {...props}
            customWidgets={customWidgets}
            templates={{ ...customTemplates, ...props.templates }}
        />
    );
};
