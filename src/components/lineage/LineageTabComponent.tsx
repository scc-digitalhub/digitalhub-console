import { Box, Typography } from '@mui/material';
import {
    useDataProvider,
    useNotify,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useCallback, useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useRootSelector } from '@dslab/ra-root-selector';
import { NoLineage } from './NoLineage';
import { RecordLineage } from './RecordLineage';

export const LineageTabComponent = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    const [relationships, setRelationships] = useState<any[]>(
        record?.metadata?.relationships || []
    );
    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const notify = useNotify();

    useEffect(() => {
        if (dataProvider) {
            dataProvider
                .getLineage(resource, { id: record.id, meta: { root } })
                .then(data => {
                    if (data?.lineage) {
                        setRelationships([...data.lineage]);
                    }
                })
                .catch(error => {
                    const e =
                        typeof error === 'string'
                            ? error
                            : error.message || 'error';
                    notify(e);
                });
        }
    }, [dataProvider, notify, record.id, resource, root]);

    // Callback fired when handles are clicked
    // - if handleType=target, call api with nodeId and filter on dest
    // - if handleType=source, call api with nodeId and filter on source
    const onConnectStart = useCallback(
        (event, { nodeId, handleId, handleType }) => {
            if (dataProvider) {
                dataProvider
                    .getLineage(handleId.split(':')[0], {
                        id: nodeId,
                        meta: { root },
                    })
                    .then(data => {
                        if (data?.lineage) {
                            const sourceOrTarget =
                                handleType == 'target' ? 'source' : 'dest';
                            const expansions = data.lineage
                                .filter(rel =>
                                    rel[sourceOrTarget].endsWith(nodeId)
                                )
                                .map(exp => ({ ...exp, expands: nodeId }));
                            if (expansions.length === 0) {
                                notify('messages.lineage.noExpansion', {
                                    type: 'info',
                                });
                            } else {
                                setRelationships(old => [
                                    ...old,
                                    ...expansions,
                                ]);
                            }
                        }
                    })
                    .catch(error => {
                        const e =
                            typeof error === 'string'
                                ? error
                                : error.message || 'error';
                        notify(e);
                    });
            }
        },
        [dataProvider, notify, root]
    );

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('pages.lineage.title')}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                {translate('pages.lineage.description')}
            </Typography>
            {relationships.length !== 0 ? (
                <ReactFlowProvider>
                    <RecordLineage
                        relationships={relationships}
                        record={record}
                        onConnectStart={onConnectStart}
                    />
                </ReactFlowProvider>
            ) : (
                <NoLineage />
            )}
        </Box>
    );
};
