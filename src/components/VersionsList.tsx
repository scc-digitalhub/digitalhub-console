import {
    Box,
    CardContent,
    CardHeader,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    List as MuiList,
    SxProps,
    Theme,
    Typography,
    Tab as MuiTab,
    TabProps as MuiTabProps,
} from '@mui/material';
import {
    GetListParams,
    Link,
    List,
    Pagination,
    RaRecord,
    ShowButton,
    SimpleList,
    useCreatePath,
    useDataProvider,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';

import { useRootSelector } from '@dslab/ra-root-selector';
import { useEffect, useMemo, useState } from 'react';
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
        sx,
        ...rest
    } = props;
    const record = useRecordContext(rest);
    const resource = useResourceContext();
    const filter = useMemo(() => {
        return { name: record?.name, versions: 'all' };
    }, [record]);

    console.log('record', record);

    if (!record) {
        return <></>;
    }

    //TODO fetch latest and add label

    const sxProps = showActions ? { ...sx } : { ml: 2, mr: 2, ...sx };
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
                linkType="show"
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

// export const VersionsListWrapper = memo(function VersionsListWrapper(props: {
export const VersionsListWrapper = () => {
    const translate = useTranslate();

    return (
        <FlatCard>
            {/* <CardHeader title={translate('resources.common.version.title')} /> */}
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
// },
// arePropsEqual);

const VersionsSimpleList = (props: VersionListProps) => {
    const { showActions = true, usePagination = false, sx, ...rest } = props;
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
