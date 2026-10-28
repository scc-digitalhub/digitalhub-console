// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Container } from '@mui/material';
import { TopToolbar, ListButton } from 'react-admin';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../common/components/layout/PageTitle';
import { DataItemIcon } from '../../resources/dataitems/icon';
import { DataItemCreateForm } from '../../resources/dataitems/create/DataItemCreateForm';
import { DataItemCreate } from '../../resources/dataitems/create/DataItemCreate';
import { BackButton } from '@dslab/ra-back-button';
import Spacer from '../../common/components/layout/Spacer';

export const DataItemCreateView = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreatePageTitle icon={<DataItemIcon fontSize={'large'} />} />

            <DataItemCreate actions={<CreateToolbar />}>
                <FlatCard sx={{ paddingBottom: '12px' }}>
                    <DataItemCreateForm />
                </FlatCard>
            </DataItemCreate>
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
