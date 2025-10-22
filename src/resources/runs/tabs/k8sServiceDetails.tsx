// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Labeled,
    RecordContextProvider,
    TextField,
    RaRecord,
    Identifier,
    ArrayField,
} from 'react-admin';
import { Stack, Box } from '@mui/material';
import { ChipsField } from '../../../components/ChipsField';
import { IdField } from '../../../components/IdField';

type K8sServiceDetailsProps = {
    record?: RaRecord<Identifier>;
};

export const K8sServiceDetails = ({ record }: K8sServiceDetailsProps) => {
    const service = (record?.status?.service as any) || {};
    const ports = Array.isArray(service.ports) ? service.ports : [];
    const urls = Array.isArray(service.urls) ? service.urls : [];
    const externalIps = Array.isArray(service.externalIps)
        ? service.externalIps
        : [];

    const isString = (v?: any) => typeof v === 'string' && v.length > 0;
    const isArray = (a?: any[]) => Array.isArray(a) && a.length > 0;

    return (
        <RecordContextProvider value={service}>
            <Stack spacing={4}>
                <Stack direction={'row'} spacing={6}>
                    <Stack direction={'column'} spacing={4}>
                        {isString(service.name) && (
                            <Labeled label="fields.name.title">
                                <TextField source="name" />
                            </Labeled>
                        )}

                        {isString(service.type) && (
                            <Labeled label="fields.serviceType.title">
                                <TextField source="type" />
                            </Labeled>
                        )}
                    </Stack>
                    <Stack direction={'column'} spacing={4}>
                        {isString(service.namespace) && (
                            <Labeled label="fields.namespace.title">
                                <TextField source="namespace" />
                            </Labeled>
                        )}

                        {isString(service.clusterIP) && (
                            <Labeled label="fields.clusterIP.title">
                                <TextField source="clusterIP" />
                            </Labeled>
                        )}
                    </Stack>
                </Stack>

                <Stack spacing={4}>
                    {isString(service.ip) && (
                        <Labeled label="fields.service.ip.title">
                            <TextField source="ip" />
                        </Labeled>
                    )}

                    {isString(service.hostname) && (
                        <Labeled label="fields.service.hostname.title">
                            <TextField source="hostname" />
                        </Labeled>
                    )}

                    {isString(service.externalName) && (
                        <Labeled label="fields.service.externalName.title">
                            <TextField source="externalName" />
                        </Labeled>
                    )}

                    {isString(service.url) && (
                        <Labeled label="fields.service.url.title">
                            <IdField source="url" />
                        </Labeled>
                    )}

                    {isArray(urls) && (
                        <Labeled label="fields.service.urls.title">
                            <ArrayField source="urls">
                                <Stack spacing={1}>
                                    {urls.map((url, index) => (
                                        <Box key={index} sx={{ ml: 2 }}>
                                            <IdField
                                                source="url"
                                                record={{ url }}
                                            />
                                        </Box>
                                    ))}
                                </Stack>
                            </ArrayField>
                        </Labeled>
                    )}

                    {isArray(externalIps) && (
                        <Labeled label="fields.service.externalIps.title">
                            <ChipsField
                                source="externalIps"
                                record={externalIps}
                            />
                        </Labeled>
                    )}

                    {isString(service.externalName) && (
                        <Labeled label="fields.service.externalName.title">
                            <TextField source="externalName" />
                        </Labeled>
                    )}
                </Stack>

                {isArray(ports) && (
                    <ArrayField source="ports">
                        <Stack spacing={2}>
                            {ports.map((port: any, idx: number) => (
                                <Stack key={idx} spacing={6} direction={'row'}>
                                    <Labeled label="fields.protocol.title">
                                        <TextField
                                            record={port}
                                            source="protocol"
                                        />
                                    </Labeled>
                                    <Labeled label="fields.name.title">
                                        <TextField
                                            record={port}
                                            source="name"
                                        />
                                    </Labeled>

                                    <Labeled label="fields.port.title">
                                        <TextField
                                            record={port}
                                            source="port"
                                        />
                                    </Labeled>

                                    <Labeled label="fields.targetPort.title">
                                        <TextField
                                            record={port}
                                            source="targetPort"
                                        />
                                    </Labeled>
                                </Stack>
                            ))}
                        </Stack>
                    </ArrayField>
                )}
            </Stack>
        </RecordContextProvider>
    );
};

export default K8sServiceDetails;
