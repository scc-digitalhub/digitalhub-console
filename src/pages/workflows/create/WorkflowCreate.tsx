// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import { CreateBase, CreateView, LoadingIndicator } from 'react-admin';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../../common/components/layout/PageTitle';
import { WorkflowIcon } from '../icon';
import { useGetSchemas } from '../../../common/jsonSchema/schemaController';
import { WorkflowForm } from './WorkflowForm';
import { CreateToolbar } from './CreateToolbar';

export const WorkflowCreate = () => {
    const { root } = useRootSelector();
    const { data: schemas } = useGetSchemas();

    const kinds = schemas?.map(s => ({ id: s.kind, name: s.kind }));

    const transform = data => ({
        ...data,
        project: root || '',
    });

    if (!kinds) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase transform={transform} redirect="list">
                <>
                    <CreatePageTitle
                        icon={<WorkflowIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <WorkflowForm kinds={kinds} />
                        </FlatCard>
                    </CreateView>
                </>
            </CreateBase>
        </Container>
    );
};
