// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Container } from '@mui/material';
import { TopToolbar } from 'react-admin';
import { EditPageTitle } from '../../common/components/layout/PageTitle';
import { DataItemIcon } from '../../resources/dataitems/icon';
import { BackButton } from '@dslab/ra-back-button';
import Spacer from '../../common/components/layout/Spacer';
import { DataItemEdit } from '../../resources/dataitems/edit/DataItemEdit';

export const DataItemEditView = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditPageTitle icon={<DataItemIcon fontSize={'large'} />} />

            <DataItemEdit actions={<EditToolbar />} />
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
