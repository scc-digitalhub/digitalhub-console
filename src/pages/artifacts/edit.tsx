// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Container } from '@mui/material';
import { TopToolbar } from 'react-admin';
import { EditPageTitle } from '../../common/components/layout/PageTitle';
import { ArtifactIcon } from '../../resources/artifacts/icon';
import { BackButton } from '@dslab/ra-back-button';
import Spacer from '../../common/components/layout/Spacer';
import { ArtifactEdit } from '../../resources/artifacts/edit/ArtifactEdit';

export const ArtifactEditView = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditPageTitle icon={<ArtifactIcon fontSize={'large'} />} />

            <ArtifactEdit actions={<EditToolbar />} />
        </Container>
    );
};

const EditToolbar = () => {
    return (
        <TopToolbar>
            <BackButton />
            <Spacer />
        </TopToolbar>
    );
};
