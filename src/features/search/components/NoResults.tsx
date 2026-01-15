// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { isEmpty, useTranslate } from 'react-admin';
import { Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FlatCard } from '../../../components/FlatCard';
import { useSearch } from '../SearchContext';
import Inbox from '@mui/icons-material/Inbox';

export const NoResults = () => {
    const translate = useTranslate();
    const { params: searchParams } = useSearch();
    const noSearchFilters =
        Object.keys(searchParams).length === 0 ||
        Object.values(searchParams).every(s => isEmpty(s));

    return (
        <Container maxWidth={false} sx={{ paddingTop: '18px', marginX: 0 }}>
            <FlatCard sx={{ paddingY: '18px' }}>
                <Root className="RaList-noResults">
                    <div className={EmptyClasses.message}>
                        <Inbox className={EmptyClasses.icon} />
                        <Typography
                            variant="h4"
                            component="p"
                            sx={{ marginBottom: '16px' }}
                        >
                            {noSearchFilters
                                ? translate('messages.search.enter_filters')
                                : translate('messages.search.no_results')}
                        </Typography>
                    </div>
                </Root>
            </FlatCard>
        </Container>
    );
};

const PREFIX = 'RaEmpty';

const EmptyClasses = {
    message: `${PREFIX}-message`,
    icon: `${PREFIX}-icon`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flex: 1,
    [`& .${EmptyClasses.message}`]: {
        textAlign: 'center',
        opacity: theme.palette.mode === 'light' ? 0.5 : 0.8,
        margin: '0 1em',
        color:
            theme.palette.mode === 'light'
                ? 'inherit'
                : theme.palette.text.primary,
    },

    [`& .${EmptyClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },
}));
