// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Container } from '@mui/material';
import { TopToolbar } from 'react-admin';
import { EditPageTitle } from '../../common/components/layout/PageTitle';
import { WorkflowIcon } from '../../resources/workflows/icon';
import { BackButton } from '@dslab/ra-back-button';
import Spacer from '../../common/components/layout/Spacer';
import { WorkflowEdit } from '../../resources/workflows/edit/WorkflowEdit';

export const WorkflowEditView = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditPageTitle icon={<WorkflowIcon fontSize={'large'} />} />
            <WorkflowEdit actions={<EditToolbar />} />
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
