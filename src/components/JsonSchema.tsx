import {
    JsonSchemaField as RaJsonSchemaField,
    JsonSchemaFieldProps,
    JSONSchemaFormatInputProps,
    JsonSchemaInput as RaJsonSchemaInput,
} from '@dslab/ra-jsonschema-input';
// import { JsonSchemaInput as RaJsonSchemaInput} from './JsonSchemaInput';
import { MuiChipsInputWidget } from './MuiChipsInputWidget';
//  import { SourceEditor } from './SourceEditor';
const customWidgets = { tagsChipInput: MuiChipsInputWidget, };
//   const customFields = { SourceEditor};

export const JsonSchemaField = (props: JsonSchemaFieldProps) => {
    return <RaJsonSchemaField {...props} customWidgets={customWidgets} />;
};
export const JsonSchemaInput = (props: JSONSchemaFormatInputProps) => {
    //  return <RaJsonSchemaInput {...props} customWidgets={customWidgets} templates={customFields} />;
   return <RaJsonSchemaInput {...props} customWidgets={customWidgets}  />;
};
