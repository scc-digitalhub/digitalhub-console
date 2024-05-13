import {
    JsonSchemaField as RaJsonSchemaField,
    JsonSchemaFieldProps,
    JSONSchemaFormatInputProps,
    JsonSchemaInput as RaJsonSchemaInput,
} from '@dslab/ra-jsonschema-input';
// import { JsonSchemaFieldProps,JsonSchemaField as RaJsonSchemaField} from './JsonSchemaField';
//  import { JsonSchemaInput as RaJsonSchemaInput,JSONSchemaFormatInputProps} from './JsonSchemaInput';
import { MuiChipsInputWidget } from './MuiChipsInputWidget';
import { CoreResourceMemWidget } from './resourceInput/CoreResourceMemWidget';
import { CoreResourceGpuWidget } from './resourceInput/CoreResourceGpuWidget';
import { CoreResourceCpuWidget } from './resourceInput/CoreResourceCpuWidget';
import { CoreResourceFieldTemplate } from './resourceInput/CoreResourceFieldTemplate';
import { KeyValueFieldTemplate } from './resourceInput/KeyValueFieldTemplate';
import { VolumeResourceFieldTemplate } from './resourceInput/VolumeResourceFieldTemplate';
import ArrayFieldTemplate from './resourceInput/ArrayFieldTemplate';
import ArrayFieldItemTemplate from './resourceInput/ArrayFieldItemTemplate';
const customWidgets = {
    tagsChipInput: MuiChipsInputWidget,
    coreResourceCpuWidget: CoreResourceCpuWidget,
    coreResourceGpuWidget: CoreResourceGpuWidget,
    coreResourceMemWidget: CoreResourceMemWidget,
};
const customTemplates = {
    CoreResourceFieldTemplate,
    KeyValueFieldTemplate,
    VolumeResourceFieldTemplate,
    ArrayFieldTemplate,
    ArrayFieldItemTemplate,
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
