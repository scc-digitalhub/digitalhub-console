import {
    JsonSchemaField as RaJsonSchemaField,
    JsonSchemaFieldProps,
    JSONSchemaFormatInputProps,
} from '@dslab/ra-jsonschema-input';
import { JsonSchemaInput as RaJsonSchemaInput} from './JsonSchemaInput';
import { MuiChipsInputWidget } from './MuiChipsInputWidget';
import { CoreResourceMemWidget } from './resourceInput/CoreResourceMemWidget';
import { CoreResourceGpuWidget } from './resourceInput/CoreResourceGpuWidget';
import { CoreResourceCpuWidget } from './resourceInput/CoreResourceCpuWidget';
import { CoreResourceField } from './resourceInput/CoreResourceField';
const customWidgets = { tagsChipInput: MuiChipsInputWidget, coreResourceCpuWidget:CoreResourceCpuWidget,coreResourceGpuWidget:CoreResourceGpuWidget,coreResourceMemWidget:CoreResourceMemWidget};
const customFields = { CoreResourceField};

export const JsonSchemaField = (props: JsonSchemaFieldProps) => {
    return <RaJsonSchemaField {...props} customWidgets={customWidgets} />;
};
export const JsonSchemaInput = (props: JSONSchemaFormatInputProps) => {
    return <RaJsonSchemaInput {...props} customWidgets={customWidgets} templates={customFields} />;
};
