// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
// Copyright 2025 the original author or authors
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useTranslate } from 'react-admin';
import { Container } from '@mui/material';
import { Location, useLocation } from 'react-router';

import { useGetStores } from '../../stores/useGetStores';
import { BrowserIcon } from './icon';
import { PageTitle } from '../../../../common/components/layout/PageTitle';
import { FileBrowser } from './FileBrowser';

const getPathFromLocation = (location: Location) => {
    if (location.search?.length > 0 && location.search.includes('path=')) {
        const path = location.search
            .split('&')
            .find(s => s.includes('path='))
            ?.split('=')[1];
        if (path) return path;
    }
    return null;
};

export const Browser = () => {
    const translate = useTranslate();
    const getStores = useGetStores();
    const location = useLocation();

    const [store, setStore] = useState<string | null>(null);

    useEffect(() => {
        getStores().then(json => {
            if (json && json.length == 1) {
                //select first
                setStore(json[0]);
            }
        });
    }, [getStores]);

    const root = store ? (store.endsWith('/') ? store : store + '/') : null;
    const initialPath = root
        ? root + (getPathFromLocation(location) ?? '')
        : null;

    return (
        <Container maxWidth={false}>
            <PageTitle
                text={translate('pages.files.title')}
                secondaryText={translate('pages.files.helperText')}
                icon={<BrowserIcon fontSize={'large'} />}
                sx={{ pl: 0, pr: 0 }}
            />
            {root && initialPath && (
                <FileBrowser
                    // remount when the requested location changes
                    key={initialPath}
                    root={root}
                    initialPath={initialPath}
                />
            )}
        </Container>
    );
};
