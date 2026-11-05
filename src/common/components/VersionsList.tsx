// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Box,
    CardContent,
    IconButton,
    SxProps,
    Theme,
    Typography,
    Tooltip,
    Tab as MuiTab,
    useTheme,
    alpha,
    Stack,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    List,
    Pagination,
    ShowButton,
    SimpleList,
    SimpleListProps,
    useDataProvider,
    useRecordContext,
    useResourceContext,
    useStore,
    useTranslate,
} from 'react-admin';

import { ReactElement, useEffect, useId, useMemo, useState } from 'react';
import { FlatCard } from './layout/FlatCard';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';

export type VersionListProps = VersionsListAsideProps & {
    showActions?: boolean;
    usePagination?: boolean;
    perPage?: number;
    sx?: SxProps<Theme>;
    record?: any;
};

export const primaryText = item => {
    const value = item.metadata?.updated
        ? new Date(item.metadata.updated).toLocaleString()
        : item.id;

    return <Typography sx={{ color: 'primary' }}>{value}</Typography>;
};

export const secondaryText = item => {
    return item.metadata?.version && item.metadata.version != item.id ? (
        <>
            <strong> {item.metadata.version}</strong> <br />
            {item.id}
        </>
    ) : (
        <> {item.id} </>
    );
};

export const VersionsList = (props: VersionListProps) => {
    const {
        showActions = true,
        usePagination = false,
        perPage = 10,
        leftIcon,
        rowClick,
        primaryText: primaryTextProps,
        secondaryText: secondaryTextProps,
        rightIcon: rightIconProps,
        ...rest
    } = props;
    const record = useRecordContext(rest);
    const resource = useResourceContext();
    const theme = useTheme();
    const filter = useMemo(() => {
        return { name: record?.name, versions: 'all' };
    }, [record]);

    if (!record) {
        return <></>;
    }

    //TODO fetch latest and add label

    const rowSx = item => {
        return record.id == item.id
            ? {
                  backgroundColor: alpha(theme.palette?.primary?.main, 0.08),
              }
            : {};
    };

    const rightIcon = item =>
        showActions ? <ShowButton record={item} /> : undefined;
    return (
        <List
            component={Box}
            resource={resource}
            actions={false}
            sort={{ field: 'created', order: 'DESC' }}
            filter={filter}
            perPage={perPage}
            pagination={
                usePagination ? (
                    <Pagination rowsPerPageOptions={[perPage]} />
                ) : (
                    false
                )
            }
            disableSyncWithLocation
            storeKey={false}
        >
            <SimpleList
                rowClick={rowClick || 'show'}
                rowSx={rowSx}
                key={resource + ':versions:'}
                primaryText={primaryTextProps || primaryText}
                secondaryText={secondaryTextProps || secondaryText}
                rightIcon={rightIconProps || rightIcon}
                leftIcon={leftIcon}
                sx={{
                    '& .MuiListItemIcon-root': {
                        minWidth: 40,
                    },
                }}
            />
        </List>
    );
};

export type VersionsListAsideProps = Pick<
    SimpleListProps,
    'rowClick' | 'primaryText' | 'secondaryText' | 'rightIcon' | 'leftIcon'
>;

export const VersionsListAside = (props: VersionsListAsideProps) => {
    const translate = useTranslate();
    const [open, setOpen] = useStore<boolean>('versionsListAside.open', true);
    const contentId = useId();
    const toggleLabel = `${translate(
        open ? 'ra.action.close' : 'ra.action.expand'
    )} ${translate('resources.common.version.title')}`;

    return (
        <FlatCard
            sx={{
                boxSizing: 'border-box',
                minWidth: 0,
                width: open ? { xs: '100%', lg: 350 } : 56,
                justifySelf: 'end',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', minHeight: 48 }}>
                <MuiTab
                    label={translate('resources.common.version.title')}
                    disableFocusRipple
                    disableRipple
                    sx={{ display: open ? 'inline-flex' : 'none' }}
                />
                <Tooltip title={toggleLabel}>
                    <IconButton
                        aria-label={toggleLabel}
                        aria-expanded={open}
                        aria-controls={contentId}
                        onClick={() => setOpen(value => !value)}
                        sx={{ ml: 'auto' }}
                    >
                        {open ? (
                            <ChevronRightIcon />
                        ) : (
                            <Stack direction="row" gap={0.3}>
                                <DynamicFeedIcon />
                                <VersionsCount
                                    message={c => {
                                        return c ? ` ${c}` : ``;
                                    }}
                                />
                            </Stack>
                        )}
                    </IconButton>
                </Tooltip>
            </Box>
            <CardContent
                id={contentId}
                sx={{
                    padding: 0,
                    display: open ? 'block' : 'none',
                }}
            >
                <VersionsList
                    usePagination={true}
                    showActions={false}
                    {...props}
                />
            </CardContent>
        </FlatCard>
    );
};

export const VersionsCount = (props: {
    message?: string | ((count: number) => string | ReactElement);
}) => {
    const { message } = props;
    const record = useRecordContext();
    const resource = useResourceContext();
    const dataProvider = useDataProvider();
    const theme = useTheme();
    const translate = useTranslate();

    const [count, setCount] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (resource && record) {
            dataProvider
                .getList(resource, {
                    filter: { name: record?.name, versions: 'all' },
                    pagination: { page: 1, perPage: 1 },
                    sort: { field: 'created', order: 'DESC' },
                })
                .then(({ total }) => setCount(total))
                .catch(() => setCount(undefined));
        }
    }, [record, resource, dataProvider]);

    const content = count => {
        if (message) {
            return typeof message === 'function'
                ? message(count)
                : translate(message, {
                      resource:
                          count > 1
                              ? translate('resources.common.version.title')
                              : translate('resources.common.version.version'),
                      smart_count: count,
                  }).toLocaleLowerCase();
        }

        return translate('messages.navigation.x-elements', {
            resource:
                count > 1
                    ? translate('resources.common.version.title')
                    : translate('resources.common.version.version'),
            smart_count: count,
        }).toLocaleLowerCase();
    };

    return (
        <Typography
            variant="body2"
            color="textSecondary"
            sx={{ color: theme.palette.text.secondary }}
        >
            {count ? content(count) : ''}
        </Typography>
    );
};
