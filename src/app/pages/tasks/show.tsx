// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Labeled,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useRecordContext,
} from 'react-admin';
import { Box, Stack } from '@mui/material';
import { TaskTriggerList } from './triggers';
import { TaskRunList } from './runs';
import { ShowInDialogButton, EditInDialogButton } from '@dslab/ra-dialog-crud';
import { InspectButton } from '@dslab/ra-inspect-button';
import { TaskEditComponent } from './edit';
import { AceEditorField } from '@dslab/ra-ace-editor';
import { toYaml } from '@dslab/ra-export-record-button';

export const TaskShowComponent = () => {
    return (
        <Stack direction={'column'} gap={1}>
            <>
                <TaskToolbar />
                <SimpleShowLayout>
                    <Stack direction={'row'} spacing={3}>
                        <Labeled>
                            <TextField source="kind" label="fields.kind" />
                        </Labeled>
                        <Labeled>
                            <TextField source="id" />
                        </Labeled>
                    </Stack>
                    <Labeled>
                        <TextField source="key" />
                    </Labeled>
                </SimpleShowLayout>
            </>
            <TaskTriggerList />
            <TaskRunList />
        </Stack>
    );
};

const TaskToolbar = () => {
    return (
        <TopToolbar>
            <ShowInDialogButton
                label="fields.spec.title"
                fullWidth
                maxWidth={'lg'}
            >
                <TaskSpecShow />
            </ShowInDialogButton>
            <EditInDialogButton
                fullWidth
                closeOnClickOutside={false}
                maxWidth={'lg'}
                // transform={prepareTask}
                mutationMode="pessimistic"
            >
                <TaskEditComponent />
            </EditInDialogButton>
            <InspectButton fullWidth />
        </TopToolbar>
    );
};

export const TaskSpecShow = () => {
    const record = useRecordContext();

    if (!record) {
        return <></>;
    }

    return (
        <Box p={1}>
            <AceEditorField
                source="spec"
                parse={toYaml}
                mode="yaml"
                minLines={20}
            />
        </Box>
    );
};
