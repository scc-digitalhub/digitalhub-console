// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState, SyntheticEvent, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { HttpClient } from './HttpClient';
import { useTranslate } from 'react-admin';
import { HealthChips } from './components/HealthChips';
import { useHttpClientProvider } from './HttpClientContext';

interface InferenceV2ClientProps {
    baseUrl: string;
    model: string;
    historyKey?: string;
}

interface HealthStatus {
    ready: boolean;
    live: boolean;
    message?: string;
}

export const InferenceV2Client = ({
    baseUrl,
    model,
    historyKey,
}: InferenceV2ClientProps) => {
    const [activeTab, setActiveTab] = useState(0);
    const translate = useTranslate();
    const provider = useHttpClientProvider();
    const [healthStatus, setHealthStatus] = useState<HealthStatus>({
        ready: false,
        live: false,
    });

    useEffect(() => {
        if (!baseUrl || !provider) return;

        const checkHealth = async (ctrl: AbortController) => {
            try {
                const readyRes = await provider.get(
                    baseUrl + '/v2/health/ready',
                    {},
                    ctrl.signal
                );
                if (ctrl.signal.aborted) return;

                if (readyRes?.status !== 200) {
                    return setHealthStatus({
                        ready: false,
                        live: false,
                        message:
                            readyRes?.status !== 200
                                ? readyRes?.json?.message?.toString()
                                : 'pages.http-client.modelNotReady',
                    });
                }

                const liveRes = await provider.get(
                    baseUrl + '/v2/health/live',
                    {},
                    ctrl.signal
                );
                if (ctrl.signal.aborted) return;

                if (liveRes?.status !== 200) {
                    return setHealthStatus({
                        ready: true,
                        live: false,
                        message:
                            liveRes?.status !== 200
                                ? liveRes?.json?.message?.toString()
                                : 'pages.http-client.modelNotLive',
                    });
                }

                setHealthStatus({ ready: true, live: true });
            } catch (error) {
                if (!ctrl.signal.aborted) {
                    setHealthStatus({ ready: false, live: false });
                }
            }
        };

        const ctrl = new AbortController();
        checkHealth(ctrl);
        return () => ctrl.abort();
    }, [baseUrl, provider]);

    const handleTabChange = (event: SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <>
            <HealthChips
                ready={healthStatus.ready}
                live={healthStatus.live}
                message={healthStatus.message}
            />

            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label={translate('pages.http-client.tabs.inference')} />
                <Tab label={translate('pages.http-client.tabs.metadata')} />
            </Tabs>

            {activeTab === 0 && (
                <Box>
                    <HttpClient
                        urls={[`${baseUrl}/v2/models/${model}/infer`]}
                        allowedMethods={['POST']}
                        allowedContentTypes={['application/json']}
                        allowHeaders={false}
                        showRequestBody={true}
                        historyKey={historyKey}
                    />
                </Box>
            )}

            {activeTab === 1 && (
                <HttpClient
                    urls={[`${baseUrl}/v2/models/${model}`]}
                    allowedMethods={['GET']}
                    allowHeaders={false}
                    showRequestBody={false}
                    historyKey={false}
                />
            )}
        </>
    );
};
