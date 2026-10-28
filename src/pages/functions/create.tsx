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
import { CreatePageTitle } from '../../common/components/layout/PageTitle';
import { FunctionIcon } from '../../resources/functions/icon';
import { TemplatesSelector } from '../../common/components/TemplatesSelector';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { useGetTemplates } from '../../common/provider/templateProvider';

import { FunctionCreateForm } from '../../resources/functions/create/FunctionForm';
import { HubButton } from '../../common/components/buttons/HubButton';
import { FunctionCreate } from '../../resources/functions/create/FunctionCreate';

const CreateToolbar = () => {
    return (
        <TopToolbar>
            <HubButton />
            <ListButton />
        </TopToolbar>
    );
};

export const FunctionCreateView = () => {
    const resource = useResourceContext();
    const redirect = useRedirect();

    const { data: templates, isLoading } = useGetTemplates(resource);
    const [template, setTemplate] = useState<any | undefined>();

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreatePageTitle icon={<FunctionIcon fontSize={'large'} />} />

            {isLoading ? (
                <LinearProgress />
            ) : templates && templates.length > 0 && template === undefined ? (
                <TemplatesSelector
                    templates={templates}
                    template={template}
                    onSelected={setTemplate}
                />
            ) : (
                <FunctionCreate
                    template={template}
                    redirect="list"
                    actions={<CreateToolbar />}
                >
                    <FlatCard sx={{ paddingBottom: '12px' }}>
                        <FunctionCreateForm
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
                </FunctionCreate>
            )}
        </Container>
    );
};
