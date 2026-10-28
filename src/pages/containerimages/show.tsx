// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Container } from '@mui/material';
import { ShowView } from 'react-admin';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { ShowPageTitle } from '../../common/components/layout/PageTitle';
import { ContainerImageIcon } from '../../resources/containerimages/icon';
import { ShowToolbar } from '../../common/components/toolbars/ShowToolbar';
import { ShowBaseLive } from '../../features/notifications/components/ShowBaseLive';
import { ContainerImageShow } from '../../resources/containerimages/show/ContainerImageShow';

export const ContainerImageShowView = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBaseLive>
                <>
                    <ShowPageTitle
                        icon={<ContainerImageIcon fontSize={'large'} />}
                    />
                    <ShowView actions={<ShowToolbar />} component={FlatCard}>
                        <ContainerImageShow />
                    </ShowView>
                </>
            </ShowBaseLive>
        </Container>
    );
};
