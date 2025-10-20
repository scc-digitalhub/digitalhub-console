// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Stack } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import {
    Labeled,
    ShowView,
    TabbedShowLayout,
    TextField,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { arePropsEqual, countLines } from '../../common/helper';
import { FlatCard } from '../../components/FlatCard';
import { ShowPageTitle } from '../../components/PageTitle';
import { VersionsListWrapper } from '../../components/VersionsList';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { ArtifactIcon } from './icon';
import { MetadataField } from '../../components/MetadataField';
import { FileInfo } from '../../components/FileInfo';
import { IdField } from '../../components/IdField';
import { LineageTabComponent } from '../../components/lineage/LineageTabComponent';
import { ShowToolbar } from '../../components/toolbars/ShowToolbar';
import { StateChips } from '../../components/StateChips';
import { ShowBaseLive } from '../../components/ShowBaseLive';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { toYaml } from '@dslab/ra-export-record-button';

const ShowComponent = () => {
    const record = useRecordContext();

    return <ArtifactShowLayout record={record} />;
};

const ArtifactShowLayout = memo(function ArtifactShowLayout(props: {
    record: any;
}) {
    const { record } = props;
    const schemaProvider = useSchemaProvider();
    const translate = useTranslate();
    const resource = useResourceContext();
    const [spec, setSpec] = useState<any>();
    const kind = record?.kind || undefined;
    const recordSpec = record?.spec;
    const lineCount = countLines(recordSpec);

    useEffect(() => {
        if (!schemaProvider) {
            return;
        }

        if (record && resource) {
            schemaProvider.get(resource, record.kind).then(s => {
                setSpec(s);
            });
        }
    }, [record, schemaProvider, resource]);

    if (!record) return <></>;

    return (
        <TabbedShowLayout syncWithLocation={false} record={record}>
            <TabbedShowLayout.Tab label="fields.summary">
                <Stack direction={'row'} spacing={3}>
                    <Labeled>
                        <TextField source="kind" />
                    </Labeled>

                    <Labeled>
                        <IdField source="id" />
                    </Labeled>
                </Stack>

                <IdField source="key" />
                <StateChips source="status.state" label="fields.status.state" />
                <MetadataField />
            </TabbedShowLayout.Tab>
            {spec && (
                <TabbedShowLayout.Tab label={translate('fields.spec.title')}>
                    <Box sx={{ width: '100%' }}>
                        <AceEditorField
                            width="100%"
                            source="spec"
                            parse={toYaml}
                            mode="yaml"
                            minLines={lineCount[0]}
                            maxLines={lineCount[1]}
                        />
                    </Box>
                </TabbedShowLayout.Tab>
            )}
            <TabbedShowLayout.Tab label="fields.files.tab">
                <FileInfo />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="pages.lineage.title">
                <LineageTabComponent />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
},
arePropsEqual);

export const ArtifactShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBaseLive>
                <>
                    <ShowPageTitle icon={<ArtifactIcon fontSize={'large'} />} />
                    <ShowView
                        actions={<ShowToolbar />}
                        sx={{
                            width: '100%',
                            '& .RaShow-main': {
                                display: 'grid',
                                gridTemplateColumns: { lg: '1fr 350px' },
                                gridTemplateRows: {
                                    xs: 'repeat(1, 1fr)',
                                    lg: '',
                                },
                                gap: 2,
                            },
                        }}
                        component={FlatCard}
                        aside={<VersionsListWrapper />}
                    >
                        <ShowComponent />
                    </ShowView>
                </>
            </ShowBaseLive>
        </Container>
    );
};
