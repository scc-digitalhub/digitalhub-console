import {
    JsonSchemaField as RaJsonSchemaField,
    JsonSchemaFieldProps,
    JSONSchemaFormatInputProps,
    JsonSchemaInput as RaJsonSchemaInput,
} from '@dslab/ra-jsonschema-input';

import { MuiChipsInputWidget } from './MuiChipsInputWidget';
import { CoreResourceFieldTemplate } from './resourceInput/CoreResourceFieldTemplate';
import { KeyValueFieldTemplate } from './resourceInput/KeyValueFieldTemplate';
import { VolumeResourceFieldTemplate } from './resourceInput/VolumeResourceFieldTemplate';
import ArrayFieldTemplate from './resourceInput/ArrayFieldTemplate';
import ArrayFieldItemTemplate from './resourceInput/ArrayFieldItemTemplate';
import ObjectFieldTemplate from './resourceInput/ObjectFieldTemplate';
import WrapIfAdditionalTemplate from './resourceInput/WrapIfAdditionalTemplate';
const customWidgets = {
    tagsChipInput: MuiChipsInputWidget,
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
