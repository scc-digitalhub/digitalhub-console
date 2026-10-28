// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Container } from '@mui/material';
import {
    TopToolbar,
    ListButton,
    useRedirect,
    useResourceContext,
    LinearProgress,
} from 'react-admin';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../common/components/layout/PageTitle';
import { ModelIcon } from '../../resources/models/icon';

import { BackButton } from '@dslab/ra-back-button';
import Spacer from '../../common/components/layout/Spacer';
import { useState } from 'react';
import { useGetTemplates } from '../../common/provider/templateProvider';
import { TemplatesSelector } from '../../common/components/TemplatesSelector';
import { ModelCreate } from '../../resources/models/create/ModelCreate';
import { ModelCreateForm } from '../../resources/models/create/ModelCreateForm';

export const ModelCreateView = () => {
    const resource = useResourceContext();
    const redirect = useRedirect();

    const { data: templates, isLoading } = useGetTemplates(resource);
    const [template, setTemplate] = useState<any | undefined>();

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreatePageTitle icon={<ModelIcon fontSize={'large'} />} />
            {isLoading ? (
                <LinearProgress />
            ) : templates && templates.length > 0 && template === undefined ? (
                <FlatCard sx={{ paddingBottom: '12px' }}>
                    <TemplatesSelector
                        templates={templates}
                        template={template}
                        onSelected={setTemplate}
                    />
                </FlatCard>
            ) : (
                <ModelCreate
                    template={template}
                    redirect="list"
                    actions={<CreateToolbar />}
                >
                    <FlatCard sx={{ paddingBottom: '12px' }}>
                        <ModelCreateForm
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
                </ModelCreate>
            )}
        </Container>
    );
};

const CreateToolbar = () => {
    return (
        <TopToolbar>
            <BackButton />
            <Spacer />
            <ListButton />
        </TopToolbar>
    );
};
