// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { FabSourceCodeTemplate } from '../../jsonSchema/FabSourceCodeTemplate';
import { TextArrayWidget } from '../../jsonSchema/TextArrayWidget';
import {
    SourceCodeTemplate,
    SourceCodeEditorWidget,
} from '../../jsonSchema/SourceCodeTemplate';

//TODO cleanup implementation and properly check for source definition in schema!
export const getFunctionUiSpec = (kind?: string) => {
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
        requirements: { 
            "ui:widget": TextArrayWidget 
        },
                fab_source: {
            'ui:ObjectFieldTemplate': FabSourceCodeTemplate,
            clientbase64: {
                'ui:widget': SourceCodeEditorWidget,
                'ui:disabled': 'true',
            },
            serverbase64: {
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
