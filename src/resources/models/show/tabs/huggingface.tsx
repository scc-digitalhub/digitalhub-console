// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0
import {
    Labeled,
    IconButtonWithTooltip,
    RecordContextProvider,
    TextField,
    useTranslate,
    useRecordContext,
} from 'react-admin';
import {
    Box,
    Chip,
    Stack,
    Typography,
    AccordionSummary,
    AccordionDetails,
    Accordion,
} from '@mui/material';
import { JSONTree } from 'react-json-tree';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { IdField } from '../../../../common/components/fields/IdField';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import humanFormat from 'human-format';
import { InspectButton } from '@dslab/ra-inspect-button';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import { LabelsField } from '../../../../common/components/fields/LabelsField';
import { JsonTab } from '../../../../common/components/tabs/json';

export const parameterScale = humanFormat.Scale.create(
    ['', 'K', 'M', 'B', 'T'],
    1000
);

export const HuggingfaceConfigJson = props => {
    const record = useRecordContext(props);
    const huggingface = record?.status?.huggingface || {};
    const config = huggingface?.config || {};

    return (
        <Stack spacing={2}>
            <RecordContextProvider value={huggingface || {}}>
                <Labeled label="fields.huggingface.modelid.title">
                    <TextField source="model_id" />
                </Labeled>
                <Labeled label="fields.config.title">
                    <JsonTab record={config} />
                </Labeled>
            </RecordContextProvider>
        </Stack>
    );
};

export const HuggingfaceModel = props => {
    const translate = useTranslate();
    const record = useRecordContext(props);

    const huggingface = record?.status?.huggingface || {};
    const model = huggingface?.model || {};
    const cardData = model?.cardData || {};
    const tags = model?.tags || cardData?.tags || [];
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

    const tokenizerConfig = model?.config?.tokenizer_config || {};

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
                </Stack>{' '}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems="center"
                >
                    {model.id && (
                        <Labeled label="fields.huggingface.repository.title">
                            <Typography>
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
                            </Typography>
                        </Labeled>
                    )}
                    {cardData.license && (
                        <Labeled label="fields.huggingface.license.title">
                            <Typography>
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
                            </Typography>
                        </Labeled>
                    )}{' '}
                </Stack>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    {model.pipeline_tag && (
                        <Labeled label="fields.huggingface.pipeline.title">
                            <Typography>{model.pipeline_tag}</Typography>
                        </Labeled>
                    )}
                    {model.library_name && (
                        <Labeled label="fields.huggingface.library.title">
                            <Typography>{model.library_name}</Typography>
                        </Labeled>
                    )}
                    {model.sha && (
                        <Labeled label="fields.huggingface.revision.title">
                            <Typography>{model.sha}</Typography>
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
                            <Typography>
                                {humanFormat(totalParameters, {
                                    scale: parameterScale,
                                    maxDecimals: 1,
                                    separator: '',
                                })}{' '}
                                params
                            </Typography>
                        </Labeled>
                    )}
                    {safetensors && tensorType && (
                        <Labeled label="fields.huggingface.safetensors.tensortype.title">
                            <Typography>{tensorType}</Typography>
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
                {tags.length > 0 && (
                    <Labeled label="fields.huggingface.tags.title">
                        <LabelsField source="model.tags" sortable={false} />
                    </Labeled>
                )}
                {tokenizerConfig?.chat_template && (
                    <Labeled label="fields.huggingface.chat_template.title">
                        <InspectButton
                            icon={<SpeakerNotesIcon />}
                            color="info"
                            variant="outlined"
                            record={tokenizerConfig.chat_template}
                            language="json"
                            label="fields.huggingface.chat_template.title"
                            sx={{ alignSelf: 'flex-start' }}
                        />
                    </Labeled>
                )}
                <Accordion disableGutters elevation={0} square>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">
                            {translate('fields.huggingface.metadata.title')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box
                            sx={{
                                maxWidth: '100%',
                                minWidth: 0,
                                overflowX: 'auto',
                            }}
                        >
                            <JSONTree data={model} hideRoot />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Stack>
        </RecordContextProvider>
    );
};
