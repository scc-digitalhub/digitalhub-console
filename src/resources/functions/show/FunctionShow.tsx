// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Divider, Stack } from '@mui/material';
import {
    Labeled,
    TextField,
    useGetResourceLabel,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { CustomTabbedShowLayout } from '../../../common/components/CustomTabbedShowLayout';
import { IdField } from '../../../common/components/fields/IdField';
import { useExtensionsTabs } from '../../../features/extensions/tabs';
import { cards } from './cards';
import { MetadataTab } from '../../../common/components/tabs/metadata';
import { LabelsField } from '../../../common/components/fields/LabelsField';
import { SpecTab } from '../../../common/components/tabs/spec';
import { RunListView } from './runs';
import tabsDefinitions from './tabs';
import { TriggersListView } from './triggers';

export const FunctionShow = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const extensionTabs = useExtensionsTabs({ source: 'extensions' });

    if (!record) return <></>;

    const kind = record?.kind;
    const Card = kind && cards[kind] ? cards[kind] : null;
    const kindTabs = kind
        ? ([] as any[]).concat(tabsDefinitions[kind] ?? [])
        : null;
    const genericTabs = tabsDefinitions['*'] ?? [];
    const tabs = kindTabs
        ? kindTabs.concat(
              genericTabs.filter(tab =>
                  kindTabs.every(kTab => kTab.key !== tab.key)
              )
          )
        : genericTabs;

    return (
        <CustomTabbedShowLayout record={record} syncWithLocation={false}>
            <CustomTabbedShowLayout.Tab
                value="summary"
                label={translate('fields.summary')}
            >
                <Stack direction={'column'} gap={1}>
                    <Stack direction={'row'} spacing={3}>
                        <Labeled>
                            <TextField source="kind" />
                        </Labeled>

                        <Labeled>
                            <IdField source="id" />
                        </Labeled>
                    </Stack>
                    <Labeled>
                        <IdField source="key" />
                    </Labeled>

                    {record?.metadata?.description && (
                        <Labeled>
                            <TextField
                                label="fields.metadata.description"
                                source="metadata.description"
                            />
                        </Labeled>
                    )}

                    {record?.metadata?.labels && (
                        <Labeled>
                            <LabelsField
                                label="fields.labels.title"
                                source="metadata.labels"
                                sortable={false}
                            />
                        </Labeled>
                    )}
                </Stack>
                <Divider />
                {Card && <Card />}
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab value="metadata" label="metadata">
                <MetadataTab />
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab
                value="spec"
                label={translate('fields.spec.title')}
            >
                <SpecTab />
            </CustomTabbedShowLayout.Tab>

            {tabs
                ?.filter(Tab => (Tab.isVisible ? Tab.isVisible(record) : true))
                .map(Tab => (
                    <CustomTabbedShowLayout.Tab
                        key={Tab.key || kind}
                        value={Tab.key || kind}
                        label={Tab.label || kind}
                    >
                        <Tab.Element />
                    </CustomTabbedShowLayout.Tab>
                ))}
            {/* {fabSourceCode && schema?.schema && (
                <CustomTabbedShowLayout.Tab
                    value="fab_source-code"
                    label={'fields.code'}
                    key={record.id + ':fab_source_code'}
                    path="code"
                >
                    <FilteredJsonSchemaField
                        sourceName="spec"
                        record={{
                            spec: { fab_source: fabSourceCode, requirements },
                        }}
                        fields={['fab_source', 'requirements']}
                        schema={schema.schema}
                        uiSchema={getFunctionUiSpec(record.kind)}
                    />
                </CustomTabbedShowLayout.Tab>
            )} */}
            <CustomTabbedShowLayout.Tab
                value={'runs'}
                label={getResourceLabel('runs', 2)}
            >
                <RunListView />
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab
                value={'triggers'}
                label={getResourceLabel('triggers', 2)}
            >
                <TriggersListView />
            </CustomTabbedShowLayout.Tab>
            {extensionTabs}
        </CustomTabbedShowLayout>
    );
};
