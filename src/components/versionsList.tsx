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
    Link,
    RaRecord,
    ShowButton,
    useCreatePath,
    useDataProvider,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';

import { useRootSelector } from '@dslab/ra-root-selector';
import { useEffect, useState } from 'react';

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

    const [versions, setVersions] = useState<RaRecord[]>();

    useEffect(() => {
        if (dataProvider && record) {
            dataProvider
                .getLatest(resource, { record, root })
                .then(versions => {
                    setVersions(versions.data);
                });
        }
    }, [dataProvider, record, resource]);

    if (!versions || !record || !dataProvider) return <></>;

    const sxProps = showActions ? { ...sx } : { ml: 2, pl: 1, mr: 2, ...sx };

    return (
        <Box sx={sxProps}>
            <MuiList>
                {versions.map(item => {
                    const path = createPath({
                        type: 'show',
                        resource: resource,
                        id: item.id,
                    });
                    return (
                        <ListItem
                            disablePadding
                            key={resource + ':versions:' + item.id}
                        >
                            <Link to={path}>
                                <ListItemText
                                    primary={item.id}
                                    secondary={item.metadata.updated}
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
