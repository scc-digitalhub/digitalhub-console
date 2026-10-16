import { DateField, TextField, TextInput, useRecordContext } from 'react-admin';
import { ChipsField } from '../../../../common/components/fields/ChipsField';
import { MetricsGrid } from '../../../../features/metrics/components/MetricsGrid';

export const MetricsTab = () => {
    const record = useRecordContext();

    const metricsComparisonFilters = [
        <TextInput
            label="fields.name.title"
            source="q"
            alwaysOn
            resettable
            key={1}
        />,
    ];
    const metricsDatagridFields = [
        <TextField
            source="id"
            label="fields.id"
            sortable={false}
            key={'df1'}
        />,
        <DateField
            source="metadata.created"
            showTime
            label="fields.metadata.created"
            key={'df2'}
        />,
        <ChipsField
            label="fields.labels.title"
            source="metadata.labels"
            sortable={false}
            key={'df3'}
        />,
    ];

    if (!record?.status?.metrics) return <> </>;

    return (
        <MetricsGrid
            record={record}
            filter={{ name: record?.name, versions: 'all' }}
            filters={metricsComparisonFilters}
            datagridFields={metricsDatagridFields}
        />
    );
};
