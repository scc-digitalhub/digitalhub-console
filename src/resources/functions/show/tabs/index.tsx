import { ConsoleTabContribution } from '../../../../features/extensions/ConsoleExtension';
import { SourceCode } from './SourceCode';
import { FabSourceCode } from './flower';
import { PythonSourceCode } from './python';

export const tabs: Record<string, ConsoleTabContribution[]> = {
    '*': [
        {
            key: 'code',
            Element: SourceCode,
            label: 'fields.code',
            isVisible: (record?: any) => !!record?.spec?.source,
        },
    ],
    python: [
        {
            key: 'code',
            Element: PythonSourceCode,
            label: 'fields.code',
            isVisible: (record?: any) => !!record?.spec?.source,
        },
    ],
    'flower-app': [
        {
            key: 'code',
            Element: FabSourceCode,
            label: 'fields.code',
            isVisible: (record?: any) => !!record?.spec?.fab_source,
        },
    ],
};

export default tabs;
