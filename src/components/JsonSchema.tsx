import {
    JsonSchemaField as RaJsonSchemaField,
    JsonSchemaInput as RaJsonSchemaInput,
    JsonSchemaFieldProps,
    JSONSchemaFormatInputProps,
} from '@dslab/ra-jsonschema-input';
import { TagsChipInput } from './TagsChipInput';
import { MuiChipsInputWidget } from './MuiChipsInputWidget';
const customWidgets = { tagsChipInput: MuiChipsInputWidget };

export const JsonSchemaField = (props: JsonSchemaFieldProps) => {
    return <RaJsonSchemaField {...props} customWidgets={customWidgets} />;
};
export const JsonSchemaInput = (props: JSONSchemaFormatInputProps) => {
    return <RaJsonSchemaInput {...props} customWidgets={customWidgets} />;
};
