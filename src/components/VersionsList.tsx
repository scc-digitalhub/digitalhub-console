import {
    Box,
    Card,
    CardContent,
    CardHeader,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    List as MuiList,
    SxProps,
    Theme,
} from '@mui/material';
import {
    GetListParams,
    Link,
    RaRecord,
    ShowButton,
    useCreatePath,
    useDataProvider,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { arePropsEqual } from '../common/helper';

import { useRootSelector } from '@dslab/ra-root-selector';
import { memo, useEffect, useState } from 'react';
import { FlatCard } from './FlatCard';

export type VersionListProps = {
    showActions?: boolean;
    sx?: SxProps<Theme>;
    record?: any;
};

export const VersionsList = (props: VersionListProps) => {
    const { showActions = true, sx, ...rest } = props;
    const record = useRecordContext(rest);
    const resource = useResourceContext();
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const createPath = useCreatePath();

    //TODO fetch latest and add label
    const [versions, setVersions] = useState<RaRecord[]>();

    useEffect(() => {
        if (dataProvider && record) {
            const params: GetListParams = {
                pagination: {
                    perPage: 10,
                    page: 1,
                },
                sort: { field: 'created', order: 'DESC' },
                filter: {
                    name: record.name,
                    versions: 'all',
                },
            };

            dataProvider.getList(resource, params).then(res => {
                if (res.data && res.total) {
                    setVersions(res.data);
                }
            });
        }
    }, [dataProvider, record, resource]);

    if (!versions || !record || !dataProvider) return <></>;

    const sxProps = showActions ? { ...sx } : { ml: 2, mr: 2, ...sx };

    return (
        <Box sx={sxProps}>
            <MuiList>
                {versions.map(item => {
                    const path = createPath({
                        type: 'show',
                        resource: resource,
                        id: item.id,
                    });
                    const value = item.metadata?.updated
                        ? new Date(item.metadata.updated).toLocaleString()
                        : item.id;

                    //TODO move to component
                    //TODO add icon for state
                    //TODO add label for latest
                    const text = () => {
                        return item.metadata?.version &&
                            item.metadata.version != item.id ? (
                            <>
                                <strong> {item.metadata.version}</strong> <br />
                                {item.id}
                            </>
                        ) : (
                            <> {item.id} </>
                        );
                    };

                    return (
                        <ListItem
                            selected={record.id == item.id}
                            key={resource + ':versions:' + item.id}
                            sx={{
                                paddingY: '4px',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                },
                            }}
                        >
                            <Link to={path}>
                                <ListItemText
                                    primary={value}
                                    secondary={text()}
                                />
                            </Link>
                            {showActions && (
                                <ListItemSecondaryAction>
                                    <ShowButton record={item} />
                                </ListItemSecondaryAction>
                            )}
                        </ListItem>
                    );
                })}
            </MuiList>
        </Box>
    );
};

// export const VersionsListWrapper = memo(function VersionsListWrapper(props: {
export const VersionsListWrapper = () => {
    const translate = useTranslate();

    return (
        <FlatCard
        // sx={{
        //     height: 'fit-content',
        //     borderRadius: '10px',
        //     order: { xs: 1, lg: 2 },
        // }}
        // variant="outlined"
        >
            <CardHeader title={translate('resources.common.version.title')} />

            <CardContent
                sx={{
                    padding: 0,
                }}
            >
                <VersionsList showActions={false} />
            </CardContent>
        </FlatCard>
    );
};
// },
// arePropsEqual);
