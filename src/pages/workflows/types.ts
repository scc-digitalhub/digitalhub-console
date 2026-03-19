// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { SourceCodeTemplate } from '../../common/jsonSchema/components/templates/SourceCodeTemplate';
import { SourceCodeEditorWidget } from '../../common/jsonSchema/components/widgets/SourceCodeEditorWidget';

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
