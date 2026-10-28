// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { Container } from '@mui/material';
import {
    LinearProgress,
    ListButton,
    TopToolbar,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../common/components/layout/PageTitle';
import { TemplatesSelector } from '../../common/components/TemplatesSelector';
import { useGetTemplates } from '../../common/provider/templateProvider';
import { WorkflowCreate } from '../../resources/workflows/create/WorkflowCreate';
import { WorkflowIcon } from '../../resources/workflows/icon';
import { WorkflowCreateForm } from '../../resources/workflows/create/WorkflowForm';

const CreateToolbar = () => {
    return (
        <TopToolbar>
            <ListButton />
        </TopToolbar>
    );
};

export const WorkflowCreateView = () => {
    const resource = useResourceContext();
    const redirect = useRedirect();

    const { data: templates, isLoading } = useGetTemplates(resource);
    const [template, setTemplate] = useState<any | undefined>();

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreatePageTitle icon={<WorkflowIcon fontSize={'large'} />} />

            {isLoading ? (
                <LinearProgress />
            ) : templates && templates.length > 0 && template === undefined ? (
                <TemplatesSelector
                    templates={templates}
                    template={template}
                    onSelected={setTemplate}
                />
            ) : (
                <WorkflowCreate
                    template={template}
                    redirect="list"
                    actions={<CreateToolbar />}
                >
                    <FlatCard sx={{ paddingBottom: '12px' }}>
                        <WorkflowCreateForm
                            isFromTemplate={!!template}
                            onCancel={() => {
                                if (templates?.length) {
                                    setTemplate(undefined);
                                } else {
                                    redirect('list', resource);
                                }
                            }}
                        />
                    </FlatCard>
                </WorkflowCreate>
            )}
        </Container>
    );
};
