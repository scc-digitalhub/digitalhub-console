import { BlankSchema } from '../../common/schemas';
import {
    SourceCodeTemplate,
    SourceCodeEditorWidget,
} from '../../jsonSchema/SourceCodeTemplate';

export enum WorkflowTypes {
    KFP = 'kfp',
}
export const TaskMap = {
    kfp: ['pipeline'],
};
export const getTaskByFunction = kind => {
    return TaskMap[kind];
};

export const getWorkflowSpec = (kind: string | undefined) => {
    if (!kind) {
        return BlankSchema;
    }

    return BlankSchema;
};

export const getWorkflowUiSpec = (kind: string | undefined) => {
    return {
        source: {
            'ui:ObjectFieldTemplate': SourceCodeTemplate,
            base64: {
                'ui:widget': SourceCodeEditorWidget,
                'ui:disabled': 'true',
            },
            code: {
                'ui:widget': 'hidden',
                'ui:disabled': 'true',
            },
        },
    };
};
