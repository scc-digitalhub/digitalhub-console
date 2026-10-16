// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0
import {
    Labeled,
    IconButtonWithTooltip,
    RecordContextProvider,
    TextField,
    useRecordContext,
} from 'react-admin';
import { Box, Chip, Stack, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { IdField } from '../../../../common/components/fields/IdField';
import humanFormat from 'human-format';
import { parameterScale } from '../tabs/huggingface';

export const HuggingfaceCard = () => {
    const record = useRecordContext();
    const huggingface = record?.status?.huggingface || {};
    const model = huggingface?.model || {};
    const cardData = model?.cardData || {};
    const baseModels = cardData?.base_model || [];
    const safetensors = model?.safetensors || {};
    const architectures =
        model?.architectures || model?.config?.architectures || [];
    const parameterEntries = Object.entries(safetensors.parameters || {});
    const totalParameters =
        safetensors.total ??
        parameterEntries.reduce(
            (total: number, [, count]) => total + Number(count || 0),
            0
        );
    const tensorType = parameterEntries.reduce(
        (largest, entry) =>
            Number(entry[1]) > Number(largest?.[1]) ? entry : largest,
        parameterEntries[0]
    )?.[0];

    return (
        <RecordContextProvider value={huggingface}>
            <Stack spacing={2}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems="center"
                >
                    {huggingface.model_id && (
                        <Labeled label="fields.huggingface.modelid.title">
                            <IdField source="model_id" />
                        </Labeled>
                    )}

                    {model.author && (
                        <Labeled label="fields.huggingface.author.title">
                            <TextField source="model.author" />
                        </Labeled>
                    )}
                </Stack>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems="center"
                >
                    {model.id && (
                        <Labeled label="fields.huggingface.repository.title">
                            <Box>
                                {model.id}{' '}
                                <IconButtonWithTooltip
                                    label="ra.action.show"
                                    color="primary"
                                    onClick={() =>
                                        window.open(
                                            `https://huggingface.co/${model.id}`,
                                            '_blank',
                                            'noopener,noreferrer'
                                        )
                                    }
                                >
                                    <OpenInNewIcon fontSize="small" />
                                </IconButtonWithTooltip>
                            </Box>
                        </Labeled>
                    )}
                    {cardData.license && (
                        <Labeled label="fields.huggingface.license.title">
                            <Box>
                                {cardData.license}{' '}
                                {cardData.license_link && (
                                    <IconButtonWithTooltip
                                        label="ra.action.show"
                                        color="primary"
                                        onClick={() =>
                                            window.open(
                                                cardData.license_link,
                                                '_blank',
                                                'noopener,noreferrer'
                                            )
                                        }
                                    >
                                        <OpenInNewIcon fontSize="small" />
                                    </IconButtonWithTooltip>
                                )}
                            </Box>
                        </Labeled>
                    )}
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    {model.pipeline_tag && (
                        <Labeled label="fields.huggingface.pipeline.title">
                            <>{model.pipeline_tag}</>
                        </Labeled>
                    )}
                    {model.library_name && (
                        <Labeled label="fields.huggingface.library.title">
                            <>{model.library_name}</>
                        </Labeled>
                    )}
                    {model.sha && (
                        <Labeled label="fields.huggingface.revision.title">
                            <>{model.sha}</>
                        </Labeled>
                    )}
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    {baseModels.length > 0 && (
                        <Labeled label="fields.huggingface.basemodel.title">
                            <Stack
                                direction="row"
                                useFlexGap
                                flexWrap="wrap"
                                gap={1}
                            >
                                {baseModels.map((baseModel: string) => (
                                    <Chip
                                        key={baseModel}
                                        label={baseModel}
                                        size="small"
                                    />
                                ))}
                            </Stack>
                        </Labeled>
                    )}

                    {safetensors && totalParameters > 0 && (
                        <Labeled label="fields.huggingface.safetensors.modelsize.title">
                            <>
                                {humanFormat(totalParameters, {
                                    scale: parameterScale,
                                    maxDecimals: 1,
                                    separator: '',
                                })}{' '}
                                params
                            </>
                        </Labeled>
                    )}
                    {safetensors && tensorType && (
                        <Labeled label="fields.huggingface.safetensors.tensortype.title">
                            <>{tensorType}</>
                        </Labeled>
                    )}
                    {architectures.length > 0 && (
                        <Labeled label="fields.huggingface.architectures.title">
                            <Stack
                                direction="row"
                                useFlexGap
                                flexWrap="wrap"
                                gap={1}
                            >
                                {architectures.map((architecture: string) => (
                                    <Chip
                                        key={architecture}
                                        label={architecture}
                                        size="small"
                                    />
                                ))}
                            </Stack>
                        </Labeled>
                    )}
                </Stack>
            </Stack>
        </RecordContextProvider>
    );
};
