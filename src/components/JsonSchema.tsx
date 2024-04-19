import {
    JsonSchemaField as RaJsonSchemaField,
    JsonSchemaFieldProps,
    JSONSchemaFormatInputProps,
    JsonSchemaInput as RaJsonSchemaInput,
} from '@dslab/ra-jsonschema-input';

// import { JsonSchemaInput as RaJsonSchemaInput} from './JsonSchemaInput';
import { MuiChipsInputWidget } from './MuiChipsInputWidget';
import { CoreResourceMemWidget } from './resourceInput/CoreResourceMemWidget';
import { CoreResourceGpuWidget } from './resourceInput/CoreResourceGpuWidget';
import { CoreResourceCpuWidget } from './resourceInput/CoreResourceCpuWidget';
import { CoreResourceFieldWidget } from './resourceInput/CoreResourceFieldWidget';
import { KeyValueFieldWidget } from './resourceInput/KeyValueFieldWidget';
import { VolumeResourceFieldWidget } from './resourceInput/VolumeResourceFieldWidget';
import ArrayFieldTemplate from './resourceInput/ArrayFieldTemplate';
import ArrayFieldItemTemplate from './resourceInput/ArrayFieldItemTemplate';
const customWidgets = { tagsChipInput: MuiChipsInputWidget, coreResourceCpuWidget:CoreResourceCpuWidget,coreResourceGpuWidget:CoreResourceGpuWidget,coreResourceMemWidget:CoreResourceMemWidget};
const customFields = { CoreResourceFieldWidget,KeyValueFieldWidget,VolumeResourceFieldWidget,ArrayFieldTemplate,ArrayFieldItemTemplate};

export const JsonSchemaField = (props: JsonSchemaFieldProps) => {
    return <RaJsonSchemaField {...props} customWidgets={customWidgets} />;
};
export const JsonSchemaInput = (props: JSONSchemaFormatInputProps) => {
    return <RaJsonSchemaInput {...props} customWidgets={customWidgets} templates={customFields} />;
};
