// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useGetResourceLabel, useListContext, useTranslate } from 'react-admin';
import { Container } from '@mui/material';
import { DataObject as DataObjectIcon } from '@mui/icons-material';
import { PageTitle } from '../../../common/components/layout/PageTitle';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { HubFilterBar } from './HubFilterBar';
import { HubCardList } from './HubCardList';

export const HubLayout = () => {
    const translate = useTranslate();
    const context = useListContext() as any;
    const getResourceLabel = useGetResourceLabel();
    const { resource = 'functions' } = useListContext();
    const label = getResourceLabel(resource, 1);

    const { availableFilters } = context;

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <PageTitle
                text={translate('pages.hub.title', {
                    _: `Create a new function from a template`,
                    resource: label,
                })}
                secondaryText={translate('pages.hub.subtitle', {
                    _: 'Browse the available templates',
                })}
                icon={<DataObjectIcon fontSize={'large'} />}
            />

            <FlatCard
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: { xs: 2, md: 2 },
                }}
            >
                <HubFilterBar availableFilters={availableFilters} />
                <HubCardList />
            </FlatCard>
        </Container>
    );
};
