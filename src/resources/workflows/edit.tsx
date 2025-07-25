// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Container, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import deepEqual from 'deep-is';
import { useEffect, useState } from 'react';
import {
    EditBase,
    EditView,
    LoadingIndicator,
    SelectInput,
    SimpleForm,
    TextInput,
    useNotify,
    useRecordContext,
    useRedirect,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
import { EditPageTitle } from '../../components/PageTitle';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { WorkflowIcon } from './icon';
import { getWorkflowUiSpec } from './types';
import { JsonSchemaInput } from '../../components/JsonSchema';
import { MetadataInput } from '../../components/MetadataInput';
import { EditToolbar } from '../../components/toolbars/EditToolbar';

const SpecInput = (props: {
    source: string;
    onDirty?: (state: boolean) => void;
}) => {
    const { source, onDirty } = props;
    const translate = useTranslate();
    const resource = useResourceContext();
    const record = useRecordContext();
    const value = useWatch({ name: source });
    const eq = deepEqual(record?.[source], value);

    const schemaProvider = useSchemaProvider();
    const [spec, setSpec] = useState<any>();
    const kind = record?.kind || null;

    useEffect(() => {
        if (schemaProvider && record && resource) {
            schemaProvider.get(resource, kind).then(s => setSpec(s));
        }
    }, [record, schemaProvider, resource]);

    useEffect(() => {
        if (onDirty) {
            onDirty(!eq);
        }
    }, [eq]);

    if (!record || !record.kind || !spec) {
        return (
            <Card
                sx={{
                    width: 1,
                    textAlign: 'center',
                }}
            >
                <CardContent>
                    {translate('resources.common.emptySpec')}{' '}
                </CardContent>
            </Card>
        );
    }

    return (
        <JsonSchemaInput
            source={source}
            schema={{ ...spec.schema, title: 'Spec' }}
            uiSchema={getWorkflowUiSpec(record.kind)}
        />
    );
};

export const WorkflowEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.list('workflows').then(res => {
                if (res) {
                    const values = res.map(s => ({
                        id: s.kind,
                        name: s.kind,
                    }));
                    setKinds(values);
                }
            });
        }
    }, [schemaProvider, setKinds]);

    if (!kinds) {
        return <LoadingIndicator />;
    }

    const onSuccess = (data, variables, context) => {};
    const onSettled = (data, variables, context) => {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        redirect('show', resource, data.id, data);
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditBase
                redirect={'show'}
                mutationMode="optimistic"
                mutationOptions={{
                    meta: { update: !isSpecDirty },
                    onSuccess: onSuccess,
                    onSettled: onSettled,
                }}
            >
                <>
                    <EditPageTitle icon={<WorkflowIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm toolbar={<EditToolbar />}>
                                <FormLabel label="fields.base" />

                                <Stack direction={'row'} spacing={3} pt={4}>
                                    <TextInput source="name" readOnly />

                                    <SelectInput
                                        source="kind"
                                        choices={kinds}
                                        readOnly
                                    />
                                </Stack>

                                <MetadataInput />

                                <SpecInput
                                    source="spec"
                                    onDirty={setIsSpecDirty}
                                />
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
