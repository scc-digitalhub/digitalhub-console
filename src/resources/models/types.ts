import { JsonParamsWidget } from '../../jsonSchema/JsonParamsWidget';

export enum ModelTypes {
    MODEL = 'Model',
}

export const getModelSpecUiSchema = (kind: string | undefined) => {
    if (!kind) {
        return {};
    }

    return {
        metrics: {
            'ui:widget': 'hidden',
        },
        parameters: {
            'ui:ObjectFieldTemplate': JsonParamsWidget,
            'ui:title': 'fields.parameters.title',
        },
    };
};
