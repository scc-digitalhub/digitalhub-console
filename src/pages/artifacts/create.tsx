// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Container } from '@mui/material';
import { TopToolbar, ListButton } from 'react-admin';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../common/components/layout/PageTitle';
import { ArtifactIcon } from '../../resources/artifacts/icon';
import { ArtifactCreateForm } from '../../resources/artifacts/create/ArtifactCreateForm';
import { ArtifactCreate } from '../../resources/artifacts/create/ArtifactCreate';
import { BackButton } from '@dslab/ra-back-button';
import Spacer from '../../common/components/layout/Spacer';

export const ArtifactCreateView = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreatePageTitle icon={<ArtifactIcon fontSize={'large'} />} />

            <ArtifactCreate actions={<CreateToolbar />}>
                <FlatCard sx={{ paddingBottom: '12px' }}>
                    <ArtifactCreateForm />
                </FlatCard>
            </ArtifactCreate>
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
