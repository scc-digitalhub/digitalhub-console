// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0
import { useDataProvider, useRecordContext } from 'react-admin';
import { Box, Stack, useTheme } from '@mui/material';
import { MarkdownBody } from '../../../../common/components/MarkdownBody';
import { HtmlBody } from '../../../../common/components/HtmlBody';
import { useRootSelector } from '@dslab/ra-root-selector';
import { useState, useEffect } from 'react';

const stripMarkdownFrontMatter = (content: string) =>
    content
        .replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/, '')
        .trimStart();

export const ModelCard = () => {
    const { root } = useRootSelector();
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const theme = useTheme();

    const [description, setDescription] = useState<any | null>(null);

    useEffect(() => {
        if (!record) return;

        const fetchDescription = async () => {
            try {
                const response = await dataProvider.invoke({
                    path: `/-/${root}/models/${record.id}/modelcard/${record.kind}`,
                    options: { method: 'GET' },
                });
                setDescription(response);
            } catch (error) {
                console.error('Error fetching model card:', error);
            }
        };

        fetchDescription();
    }, [record, dataProvider, root]);

    if (!record && !description) return <></>;
    return (
        <Stack direction={'column'} spacing={3}>
            {description?.content && description.format == 'text/markdown' && (
                <Box sx={{ width: '100%', minWidth: 0 }}>
                    <MarkdownBody
                        style={{
                            padding: 16,
                            borderRadius: 10,
                            backgroundColor:
                                theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.08)'
                                    : 'rgba(0, 0, 0, 0.04)',
                        }}
                    >
                        {stripMarkdownFrontMatter(description.content)}
                    </MarkdownBody>
                </Box>
            )}
            {description?.content && description.format == 'text/html' && (
                <Box sx={{ width: '100%', minWidth: 0 }}>
                    <HtmlBody
                        style={{
                            padding: 16,
                            borderRadius: 10,
                            backgroundColor:
                                theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.08)'
                                    : 'rgba(0, 0, 0, 0.04)',
                        }}
                    >
                        {description.content}
                    </HtmlBody>
                </Box>
            )}
        </Stack>
    );
};
