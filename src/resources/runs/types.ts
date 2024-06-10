import { mergeUiTemplate } from '../../common/schemas';
import AccordionArrayFieldTemplate from '../../jsonSchema/AccordionArrayFieldTemplate';
import { KeyValueFieldTemplate } from '../../jsonSchema/KeyValueFieldTemplate';
import {
    MapEditorFieldTemplate,
    MapEditorWidget,
} from '../../jsonSchema/MapEditorWidget';
import ObjectFieldTemplate from '../../jsonSchema/ObjectFieldTemplate';

export const getRunUiSpec = (schema: any | undefined) => {
    //filter and merge with template
    if (!schema || !('properties' in schema)) {
        return {};
    }

    const base = {
        'ui:order': ['task', 'local_execution'],

        task: {
            'ui:readonly': true,
        },
        local_execution: {
            'ui:widget': 'hidden',
        },
    };

    return mergeUiTemplate(schema, base, template);
};

const template = {
    'ui:order': ['inputs', 'parameters'],
    inputs: {},
    parameters: {
    //     'ui:ObjectFieldTemplate': MapEditorFieldTemplate,
    //     'ui:widget': MapEditorWidget,
    //     value: {
    //         'ui:widget': MapEditorWidget,
    //     },
    },
};
