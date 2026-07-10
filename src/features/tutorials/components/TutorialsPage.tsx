// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Container } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { PageTitle } from '../../../common/components/layout/PageTitle';
import { ListContextProvider, useList, useTranslate } from 'react-admin';
import { TutorialsIcon } from './icon';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { Empty } from '../../../common/components/layout/Empty';
import { GridList } from '../../../common/components/layout/GridList';
import { TutorialCard } from './TutorialCard';
import {
    TutorialsContext,
    TutorialsContextValue,
    useTutorialsContext,
} from '../TutorialsContext';
import { TutorialView } from './TutorialView';

export const TutorialsPage = ({ url }: { url: string }) => {
    const translate = useTranslate();
    const [data, setData] = useState<any>(null);
    const [selectedTutorial, setSelectedTutorial] = useState<any | null>(null);

    useEffect(() => {
        if (!data) {
            fetch(url)
                .then(res => res.json())
                .then(data => setData(data))
                .catch(err => console.error('Failed to load data:', err));
        }
    }, [data, url]);

    const listContext = useList({ data });

    const tutorialsContext: TutorialsContextValue = useMemo(() => {
        const selectTutorial = (tutorial: any) => {
            setSelectedTutorial(tutorial);
        };

        return {
            ...listContext,
            selectedTutorial,
            selectTutorial,
        };
    }, [listContext, selectedTutorial]);

    return (
        <Container maxWidth={false} sx={{ pb: 2, overflowX: 'hidden' }}>
            <PageTitle
                text={translate('pages.tutorials.title')}
                secondaryText={translate('pages.tutorials.subtitle')}
                icon={<TutorialsIcon />}
            />
            <TutorialsContext.Provider value={tutorialsContext}>
                {selectedTutorial ? (
                    <TutorialView />
                ) : (
                    // provide also ListContext for RA components that use it
                    <ListContextProvider value={listContext}>
                        <TutorialsList />
                    </ListContextProvider>
                )}
            </TutorialsContext.Provider>
        </Container>
    );
};

const TutorialsList = () => {
    const { data } = useTutorialsContext();

    return (
        <FlatCard
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                p: 2,
                width: '100%',
                overflowX: 'hidden',
                boxSizing: 'border-box',
            }}
        >
            {data && data.length > 0 ? (
                <GridList
                    spacing={2}
                    component={<Box sx={{ width: '100%' }} />}
                    linkType={false}
                >
                    <TutorialCard />
                </GridList>
            ) : (
                <Empty resource="tutorials" hasCreate={false} />
            )}
        </FlatCard>
    );
};
