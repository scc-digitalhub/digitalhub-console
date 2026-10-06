// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    IconButtonWithTooltip,
    Labeled,
    LoadingIndicator,
    TextField,
    useCreatePath,
    useRecordContext,
    UseRecordContextParams,
} from 'react-admin';
import { Stack } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { IdField } from '../../../../common/components/fields/IdField';
import { functionParser } from '../../../../common/utils/parsers';
import { MetadataField } from '../../../../features/metadata/components/MetadataField';

export const RunMetadata = (props?: UseRecordContextParams) => {
    const record = useRecordContext(props);

    const createPath = useCreatePath();
    const navigate = useNavigate();

    const functionKey = record?.spec?.function
        ? functionParser(record?.spec?.function)
        : null;
    const workflowKey = record?.spec?.workflow
        ? functionParser(record?.spec?.workflow)
        : null;
    const functionId = functionKey ? functionKey.id : null;
    const workflowId = workflowKey ? workflowKey.id : null;

    if (!record) return <LoadingIndicator />;

    return (
        <Stack direction={'column'} spacing={3}>
            <Stack direction={'row'} spacing={3}>
                <Labeled>
                    <TextField source="kind" label="fields.kind" />
                </Labeled>
                <Labeled>
                    <IdField source="id" />
                </Labeled>
            </Stack>
            <Labeled>
                <IdField source="key" />
            </Labeled>

            {functionId && (
                <Stack direction={'row'}>
                    <Labeled>
                        <TextField
                            source="spec.function"
                            label="fields.function.title"
                        />
                    </Labeled>
                    <IconButtonWithTooltip
                        label="ra.action.show"
                        color="primary"
                        sx={{ mt: 1 }}
                        onClick={() => {
                            const path = createPath({
                                resource: 'functions',
                                id: functionId,
                                type: 'show',
                            });

                            navigate(path);
                        }}
                    >
                        <OpenInNewIcon fontSize="small" />
                    </IconButtonWithTooltip>
                </Stack>
            )}
            {workflowId && (
                <Stack direction={'row'}>
                    <Labeled>
                        <TextField
                            source="spec.workflow"
                            label="fields.workflow.title"
                        />
                    </Labeled>
                    <IconButtonWithTooltip
                        label="ra.action.show"
                        color="primary"
                        sx={{ mt: 1 }}
                        onClick={() => {
                            const path = createPath({
                                resource: 'workflows',
                                id: workflowId,
                                type: 'show',
                            });

                            navigate(path);
                        }}
                    >
                        <OpenInNewIcon fontSize="small" />
                    </IconButtonWithTooltip>
                </Stack>
            )}

            {record?.metadata && <MetadataField />}
        </Stack>
    );
};
