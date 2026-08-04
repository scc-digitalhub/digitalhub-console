// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Container } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { PageTitle } from '../../../common/components/layout/PageTitle';
import {
    Error as RaError,
    FilterForm,
    ListContextProvider,
    TextInput,
    useList,
    useTranslate,
} from 'react-admin';
import yaml from 'yaml';
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
import { Spinner } from '../../../common/components/layout/Spinner';

export const TutorialsPage = ({ url }: { url: string }) => {
    const translate = useTranslate();
    const [data, setData] = useState<any[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [selectedTutorial, setSelectedTutorial] = useState<any | null>(null);

    useEffect(() => {
        if (!data) {
            setLoading(true);
            setError(null);
            fetch(url)
                .then(res =>
                    res.ok
                        ? res.text()
                        : Promise.reject(
                              new Error(
                                  'Failed to download tutorials catalog, status code is: ' +
                                      res.status
                              )
                          )
                )
                .then(data => {
                    const catalog = yaml.parse(data);
                    if (catalog?.tutorials) {
                        setData(catalog.tutorials);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    setError(
                        err instanceof Error
                            ? err
                            : new Error('File fetch failed')
                    );
                    setLoading(false);
                });
        }
    }, [data, url]);

    const listContext = useList({ data, error, isLoading: loading });

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
    const { data, error, isLoading } = useTutorialsContext();

    //case-insensitive search on every (string) field
    const searchFilter = [
        <TextInput
            key="q"
            source="q"
            label={'pages.hub.search.title'}
            alwaysOn
            resettable
            fullWidth
            helperText={false}
        />,
    ];

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
            <Box
                sx={{
                    width: '100%',
                    '& .RaFilterForm-filterFormInput': { width: '100%' },
                }}
            >
                <FilterForm filters={searchFilter} />
            </Box>
            {isLoading ? (
                <Spinner />
            ) : data && data.length > 0 ? (
                <GridList
                    spacing={2}
                    component={<Box sx={{ width: '100%' }} />}
                    linkType={false}
                >
                    <TutorialCard />
                </GridList>
            ) : error ? (
                <RaError error={error} resetErrorBoundary={() => {}} />
            ) : (
                <Empty resource="tutorials" hasCreate={false} />
            )}
        </FlatCard>
    );
};
