import { ConsoleTabContribution } from '../../../../features/extensions/ConsoleExtension';
import { SchemaTabComponent } from '../../components/schema-table/SchemaTabComponent';
import { PreviewTabComponent } from '../../components/preview-table/PreviewTabComponent';

export const tabs: Record<string, ConsoleTabContribution[]> = {
    table: [
        {
            key: 'schema',
            Element: SchemaTabComponent,
            label: 'resources.dataitems.tab.schema',
        },
        {
            key: 'preview',
            Element: PreviewTabComponent,
            label: 'resources.dataitems.tab.preview',
            isVisible: (record?: any) => !!record?.status?.preview,
        },
    ],
};
