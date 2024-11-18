import { Box, Typography } from '@mui/material';
import {
    useDataProvider,
    useNotify,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useEffect, useState } from 'react';
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
                <RecordLineage
                    relationships={relationships}
                    record={record}
                />
            ) : (
                <NoLineage />
            )}
        </Box>
    );
};
