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
} from '@mui/material';
import {
    List,
    Pagination,
    ShowButton,
    SimpleList,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';

import { useMemo } from 'react';
import { FlatCard } from './FlatCard';

export type VersionListProps = {
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
        ...rest
    } = props;
    const record = useRecordContext(rest);
    const resource = useResourceContext();
    const filter = useMemo(() => {
        return { name: record?.name, versions: 'all' };
    }, [record]);

    if (!record) {
        return <></>;
    }

    //TODO fetch latest and add label

    const rowSx = (item, index) => {
        return record.id == item.id
            ? {
                  //TODO pick style from theme rule
                  backgroundColor: 'rgba(224, 112, 27, 0.08)',
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

                    return <Typography color={'primary'}>{value}</Typography>;
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
            />
        </List>
    );
};

export const VersionsListWrapper = () => {
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
                <VersionsList usePagination={true} showActions={false} />
            </CardContent>
        </FlatCard>
    );
};
