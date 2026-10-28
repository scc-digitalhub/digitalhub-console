import {
    DateField,
    SelectInput,
    TextField,
    TextInput,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { StateColors } from '../../../../common/components/StateChips';
import { functionParser } from '../../../../common/utils/parsers';
import { MetricsGrid } from '../../../../features/metrics/components/MetricsGrid';

export const MetricsTab = () => {
    const record = useRecordContext();
    const translate = useTranslate();

    if (!record) return <> </>;

    const states: any[] = [];
    for (const c in StateColors) {
        states.push({ id: c, name: translate('states.' + c.toLowerCase()) });
    }

    const metricsComparisonFilters = [
        <TextInput
            label="fields.name.title"
            source="q"
            alwaysOn
            resettable
            key={1}
        />,
        <SelectInput
            alwaysOn
            key={2}
            label="fields.status.state"
            source="state"
            choices={states}
            sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
        />,
    ];

    const metricsDatagridFields = [
        <TextField
            source="name"
            label="fields.name.title"
            sortable={false}
            key={'df1'}
        />,
        <DateField
            source="metadata.created"
            showTime
            label="fields.metadata.created"
            key={'df2'}
        />,
        <TextField
            source="spec.task"
            label="fields.task.title"
            sortable={false}
            key={'df3'}
        />,
    ];

    return (
        <MetricsGrid
            record={record}
            filters={metricsComparisonFilters}
            datagridFields={metricsDatagridFields}
            postFetchFilter={v =>
                //TODO refactor properly
                {
                    if (!v.spec?.function) {
                        return false;
                    }

                    if (!v.kind || v.kind != record.kind) {
                        return false;
                    }

                    if (
                        functionParser(v.spec.function).name !=
                        functionParser(record.spec.function).name
                    ) {
                        return false;
                    }

                    return true;
                }
            }
        />
    );
};
