// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState, SyntheticEvent } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { HttpClient } from './HttpClient';
import { useTranslate } from 'react-admin';

interface InferenceV2ClientProps {
    urls: string[];
    proxy: string;
}

export const InferenceV2Client = ({ urls, proxy }: InferenceV2ClientProps) => {
    const [activeTab, setActiveTab] = useState(0);
    const translate = useTranslate();

    const handleTabChange = (event: SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label={translate('pages.http-client.tabs.inference')} />
                <Tab label={translate('pages.http-client.tabs.metadata')} />
            </Tabs>

            {activeTab === 0 && (
                <Box>
                    <HttpClient
                        urls={urls}
                        proxy={proxy}
                        fixedMethod="POST"
                        fixedUrl={urls.find(url => url.includes('infer'))}
                        fixedContentType="application/json"
                        showRequestBody={true}
                    />
                </Box>
            )}

            {activeTab === 1 && (
                <HttpClient
                    urls={urls}
                    proxy={proxy}
                    fixedMethod="GET"
                    fixedUrl={urls
                        .find(url => url.includes('infer'))
                        ?.replace('/infer', '')}
                />
            )}
        </>
    );
};
