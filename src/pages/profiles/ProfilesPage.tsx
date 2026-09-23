import { Container } from '@mui/system';
import { useState, useCallback, useEffect } from 'react';
import {
    useTranslate,
    LoadingIndicator,
    ResourceContextProvider,
    useList,
    DataTable,
    ListContextProvider,
    fetchUtils,
    FunctionField,
    TextField,
    useDataProvider,
} from 'react-admin';
import { PageTitle } from '../../common/components/layout/PageTitle';
import { Divider, Stack, Typography } from '@mui/material';
import { ProfilesIcon } from './icon';
import { IdField } from '../../common/components/fields/IdField';

const API_URL: string =
    (globalThis as any).REACT_APP_API_URL ||
    (process.env.REACT_APP_API_URL as string);

const WELL_KNOWN_URL =
    API_URL && API_URL.endsWith('/api/v1')
        ? API_URL.substring(0, API_URL.length - 7)
        : API_URL;

export const ProfilesPage = () => {
    const translate = useTranslate();
    const [data, setData] = useState<any[] | null>(null);

    const fetchJson = fetchUtils.fetchJson;
    const fetchProfiles = useCallback(() => {
        const url = `${WELL_KNOWN_URL}/.well-known/k8s-profiles`;

        fetchJson(url, { method: 'GET' }).then(res => {
            if (res.json) {
                setData(res.json);
            }
        });
    }, [fetchJson]);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    if (data === null) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <PageTitle
                text={translate('pages.profiles.header')}
                icon={<ProfilesIcon fontSize={'large'} />}
                sx={{ pl: 0, pr: 0 }}
            />
            <Typography
                variant="body1"
                color="textSecondary"
                gutterBottom
                mb={2}
            >
                {translate('pages.profiles.subheader')}
            </Typography>
            <ResourceContextProvider value="profiles">
                <ProfilesList data={data} />
            </ResourceContextProvider>
        </Container>
    );
};

const ProfilesList = (props: { data: any[] }) => {
    const listContext = useList({ data: props.data });
    return (
        <ListContextProvider value={listContext}>
            <DataTable
                resource="profiles"
                rowClick={false}
                bulkActionButtons={false}
            >
                <DataTable.Col source="id">
                    <Stack direction="column" spacing={1}>
                        <IdField source="id" color="textSecondary" />

                        <TextField
                            source="name"
                            color="primary"
                            variant="h6"
                            pt={1}
                        />
                        <TextField
                            source="description"
                            color="textSecondary"
                            variant="body2"
                        />
                    </Stack>
                </DataTable.Col>
                <DataTable.Col source="resources" disableSort>
                    <FunctionField
                        render={record =>
                            record.resources?.requests &&
                            Object.entries(record.resources.requests)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')
                        }
                    />
                </DataTable.Col>
                <DataTable.Col source="Usage" disableSort>
                    <FunctionField
                        render={record => <ProfilesUsage id={record.id} />}
                    />
                </DataTable.Col>
            </DataTable>
        </ListContextProvider>
    );
};
const ProfilesUsage = (props: { id: string }) => {
    const { id } = props;
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const [metrics, setMetrics] = useState<any | null>(null);

    const fetchMetrics = useCallback(() => {
        const url = `/k8s-profiles/${id}/usage`;

        dataProvider
            .invoke({
                path: url,
                options: { method: 'GET' },
            })
            .then(res => {
                if (res) {
                    setMetrics(res);
                }
            });
    }, [dataProvider, id]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    if (metrics === null) {
        return <LoadingIndicator />;
    }
    const value = metrics?.metrics?.find(m => m.name === 'pods')?.metrics?.[0]
        ? metrics.metrics.find(m => m.name === 'pods').metrics[0]
        : { value: 0 };

    const quota = value?.quota ? value.quota : null;

    return value && quota ? `${value.value} / ${quota}` : `${value.value}`;
};

const ProfilesMetrics = (props: { id: string }) => {
    const { id } = props;
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const [metrics, setMetrics] = useState<any[] | null>(null);

    const fetchMetrics = useCallback(() => {
        const url = `/k8s-profiles/${id}/metrics`;

        dataProvider
            .invoke({
                path: url,
                options: { method: 'GET' },
            })
            .then(res => {
                if (res) {
                    setMetrics(res);
                }
            });
    }, [dataProvider, id]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    if (metrics === null) {
        return <LoadingIndicator />;
    }

    return <pre>{JSON.stringify(metrics, null, 2)}</pre>;
};
