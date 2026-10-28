// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Container } from '@mui/system';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { EditPageTitle } from '../../common/components/layout/PageTitle';
import SettingsIcon from '@mui/icons-material/Settings';
import { ProjectEdit } from '../../resources/projects/ProjectEdit';

export const ProjectEditView = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditPageTitle icon={<SettingsIcon fontSize={'large'} />} />

            <FlatCard sx={{ paddingBottom: '12px' }}>
                <ProjectEdit />
            </FlatCard>
        </Container>
    );
};
