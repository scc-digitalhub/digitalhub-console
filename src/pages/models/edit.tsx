// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Container } from '@mui/material';
import { TopToolbar } from 'react-admin';
import { EditPageTitle } from '../../common/components/layout/PageTitle';
import { ModelIcon } from '../../resources/models/icon';
import { BackButton } from '@dslab/ra-back-button';
import Spacer from '../../common/components/layout/Spacer';
import { ModelEdit } from '../../resources/models/edit/ModelEdit';

export const ModelEditView = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditPageTitle icon={<ModelIcon fontSize={'large'} />} />

            <ModelEdit actions={<EditToolbar />} />
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
