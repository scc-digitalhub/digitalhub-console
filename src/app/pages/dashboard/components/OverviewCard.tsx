// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    styled,
    Grid,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    useTheme,
} from '@mui/material';
import {
    ReactElement,
    ReactNode,
    isValidElement,
    useState,
    useEffect,
} from 'react';
import { Link } from 'react-router-dom';
import { CounterBadge } from '../../../../common/components/CounterBadge';
import { RecentList } from './RecentList';
import {
    useDataProvider,
    useTranslate,
    GetListResult,
    ListButton,
    CreateButton,
    useCreatePath,
} from 'react-admin';
import { ResourceIcon } from './ResourceIcon';
import { EmptyList } from './EmptyList';
import { alpha } from '@mui/material';

export const OverviewCard = (props: {
    resource: string;
    showBadge?: boolean;
    title?: string;
    icon?: ReactElement;
}): ReactNode => {
    const {
        resource,
        showBadge = true,
        title: titleProps,
        icon: iconProps,
    } = props;
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const createPath = useCreatePath();
    const theme = useTheme();

    const [data, setData] = useState<GetListResult<any>>();

    const title = titleProps || 'pages.dashboard.' + resource + '.title';
    const icon =
        iconProps && isValidElement(iconProps) ? (
            iconProps
        ) : (
            <ResourceIcon resource={resource} />
        );

    useEffect(() => {
        let loading = true;
        if (dataProvider && loading) {
            dataProvider
                .getList(resource, {
                    pagination: { page: 1, perPage: 5 },
                    sort: { field: 'updated', order: 'DESC' },
                    filter: {},
                })
                .then(res => {
                    if (loading && res.data) {
                        setData(res);
                    }
                });
        }
        return () => {
            loading = false;
        };
    }, [dataProvider]);

    const total = data?.total;
    const records = data?.data || [];
    const isEmpty = !(records && records.length > 0);

    const bgColor = alpha(theme.palette?.primary?.main, 0.08);

    return (
        <StyledCard>
            <CardHeader
                title={translate(title)}
                avatar={icon}
                slotProps={{
                    title: {
                        variant: 'h5',
                        color: 'secondary.main',
                    },
                }}
            />
            <CardContent>
                {showBadge && (
                    <Grid container justifyContent="center">
                        <Link to={createPath({ resource, type: 'list' })}>
                            <CounterBadge
                                value={total}
                                color="secondary.main"
                                backgroundColor={bgColor}
                                size="large"
                            />
                        </Link>
                    </Grid>
                )}

                {!isEmpty ? (
                    <RecentList resource={resource} records={records} />
                ) : (
                    <EmptyList resource={resource} />
                )}
            </CardContent>
            <CardActions
                disableSpacing
                sx={{
                    mt: 'auto',
                    justifyContent: isEmpty ? 'center' : 'left',
                }}
            >
                {!isEmpty ? (
                    <ListButton resource={resource} variant="text" />
                ) : (
                    <CreateButton resource={resource} variant="contained" />
                )}
            </CardActions>
        </StyledCard>
    );
};

export const StyledCard = styled(Card, {
    name: 'DashboardOverviewCard',
    overridesResolver: (props, styles) => styles.root,
})({ height: '100%', display: 'flex', flexDirection: 'column' });
