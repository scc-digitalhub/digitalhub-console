// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Box,
    CardContent,
    SxProps,
    Theme,
    Typography,
    Tab as MuiTab,
    useTheme,
    alpha,
} from '@mui/material';
import {
    List,
    Pagination,
    ShowButton,
    SimpleList,
    SimpleListProps,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';

import { useMemo } from 'react';
import { FlatCard } from './FlatCard';

export type VersionListProps = VersionsListWrapperProps & {
    showActions?: boolean;
    usePagination?: boolean;
    perPage?: number;
    sx?: SxProps<Theme>;
    record?: any;
};

export const VersionsList = (props: VersionListProps) => {
    const {
        showActions = true,
        usePagination = false,
        perPage = 10,
        leftIcon,
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
                rowClick="show"
                rowSx={rowSx}
                key={resource + ':versions:'}
                primaryText={item => {
                    const value = item.metadata?.updated
                        ? new Date(item.metadata.updated).toLocaleString()
                        : item.id;

                    return (
                        <Typography sx={{ color: 'primary' }}>
                            {value}
                        </Typography>
                    );
                }}
                secondaryText={item => {
                    return item.metadata?.version &&
                        item.metadata.version != item.id ? (
                        <>
                            <strong> {item.metadata.version}</strong> <br />
                            {item.id}
                        </>
                    ) : (
                        <> {item.id} </>
                    );
                }}
                rightIcon={item =>
                    showActions ? <ShowButton record={item} /> : undefined
                }
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

export type VersionsListWrapperProps = Pick<SimpleListProps, 'leftIcon'>;

export const VersionsListWrapper = (props: VersionsListWrapperProps) => {
    const translate = useTranslate();

    return (
        <FlatCard>
            <MuiTab
                label={translate('resources.common.version.title')}
                disableFocusRipple
                disableRipple
            />
            <CardContent
                sx={{
                    padding: 0,
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
