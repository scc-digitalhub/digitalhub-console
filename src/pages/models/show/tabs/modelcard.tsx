// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0
import {
    Labeled,
    RaRecord,
    Identifier,
    RecordContextProvider,
    RecordContext,
    TextField,
    useDataProvider,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { Alert, Box, Stack, Typography, useTheme } from '@mui/material';
import { MarkdownBody } from '../../../../common/components/MarkdownBody';
import { useRootSelector } from '@dslab/ra-root-selector';
import { useState, useEffect } from 'react';
import { IdField } from '../../../../common/components/fields/IdField';

const stripMarkdownFrontMatter = (content: string) =>
    content
        .replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(?:\r?\n|$)/, '')
        .trimStart();

export const HuggingfaceModelCard = () => {
    const { root } = useRootSelector();
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const theme = useTheme();
    const translate = useTranslate();

    const [description, setDescription] = useState<any | null>(null);

    useEffect(() => {
        if (!record) return;

        if (record?.status?.huggingface?.model_card) {
            setDescription(record?.status?.huggingface?.model_card);
            return;
        }

        const fetchDescription = async () => {
            try {
                const response = await dataProvider.invoke({
                    path: `/-/${root}/models/${record.id}/modelcard`,
                    options: { method: 'GET' },
                });
                setDescription(response);
            } catch (error) {
                console.error('Error fetching model card:', error);
            }
        };

        fetchDescription();
    }, [record, dataProvider]);

    if (!record && !description) return <></>;
    return (
        <Stack direction={'column'} spacing={3}>
            {description?.content && (
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
        </Stack>
    );
};
