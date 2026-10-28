// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Container } from '@mui/material';
import { TopToolbar } from 'react-admin';
import { EditPageTitle } from '../../common/components/layout/PageTitle';
import { FunctionIcon } from '../../resources/functions/icon';
import { BackButton } from '@dslab/ra-back-button';
import Spacer from '../../common/components/layout/Spacer';
import { FunctionEdit } from '../../resources/functions/edit/FunctionEdit';

export const FunctionEditView = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditPageTitle icon={<FunctionIcon fontSize={'large'} />} />
            <FunctionEdit actions={<EditToolbar />} />
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
