// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { TextArrayWidget } from '../../common/jsonSchema/components/widgets/TextArrayWidget';
import { FabSourceCodeTemplate } from '../../common/jsonSchema/components/templates/FabSourceCodeTemplate';
import { ServicegraphSourceCodeTemplate } from '../../common/jsonSchema/components/templates/ServicegraphSourceCodeTemplate';

import { SourceCodeTemplate } from '../../common/jsonSchema/components/templates/SourceCodeTemplate';
import { SourceCodeEditorWidget } from '../../common/jsonSchema/components/widgets/SourceCodeEditorWidget';

//TODO cleanup implementation and properly check for source definition in schema!
export const getFunctionUiSpec = (kind?: string) => {
    if (kind?.startsWith('servicegraph')) {
        return {
            source: {
                'ui:ObjectFieldTemplate': ServicegraphSourceCodeTemplate,
                base64: {
                    'ui:widget': SourceCodeEditorWidget,
                    'ui:disabled': 'true',
                },
                code: {
                    'ui:widget': 'hidden',
                    'ui:disabled': 'true',
                },
                handler: {
                    'ui:widget': 'hidden',
                    'ui:disabled': 'true',
                },
                source: {
                    'ui:widget': 'hidden',
                    'ui:disabled': 'true',
                },
                lang: {
                    'ui:widget': 'hidden',
                    'ui:disabled': 'true',
                },
            },
        };
    }

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
            'ui:widget': TextArrayWidget,
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
