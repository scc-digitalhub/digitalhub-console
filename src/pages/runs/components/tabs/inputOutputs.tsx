// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    FunctionField,
    Labeled,
    ListContextProvider,
    ResourceContextProvider,
    ShowButton,
    TextField,
    useList,
} from 'react-admin';
import { useRootSelector } from '@dslab/ra-root-selector';
import { keyParser } from '../../../../common/utils/helper';
import { Stack } from '@mui/system';
import { Box } from '@mui/material';

export const Inputs = (props: { record: any }) => {
    const { record } = props;
    const inputs = record?.spec?.inputs
        ? Object.keys(record.spec.inputs).map(k => ({
              key: record.spec.inputs[k],
              name: k,
              id: k,
          }))
        : [];

    const parameters = record?.spec?.parameters
        ? Object.keys(record.spec.parameters).map(k => ({
              name: k,
              value: record.spec.parameters[k],
          }))
        : [];

    return (
        <Stack>
            <Labeled label={'fields.inputs.title'}>
                <ResourceContextProvider value="inputs">
                    <InputOutputsList data={inputs} />
                </ResourceContextProvider>
            </Labeled>
            <Labeled label={'fields.parameters.title'}>
                <ResourceContextProvider value="parameters">
                    <ParametersList data={parameters} />
                </ResourceContextProvider>
            </Labeled>
        </Stack>
    );
};

export const Outputs = (props: { record: any }) => {
    const { record } = props;
    const outputs = record?.status?.outputs
        ? Object.keys(record.status.outputs).map(k => ({
              key: record.status.outputs[k],
              name: k,
              id: k,
          }))
        : [];

    const results = record?.status?.results
        ? Object.keys(record.status.results).map(k => ({
              id: k,
              key: k,
              value: JSON.stringify(record.status.results[k] || null),
          }))
        : [];

    return (
        <Stack>
            <Labeled label={'fields.outputs.title'}>
                <ResourceContextProvider value="outputs">
                    <InputOutputsList data={outputs} />
                </ResourceContextProvider>
            </Labeled>
            <Labeled label={'fields.results'}>
                <ResourceContextProvider value="results">
                    <ResultsList data={results} />
                </ResourceContextProvider>
            </Labeled>
        </Stack>
    );
};

export const ParametersList = (props: { data: any }) => {
    const { data } = props;
    const listContext = useList({ data: data || [] });

    return (
        <Box width="60%">
            <ListContextProvider value={listContext}>
                <Datagrid bulkActionButtons={false} rowClick={false}>
                    <TextField source="name" label="fields.name.title" />
                    <TextField source="value" label="fields.value.title" />
                    <></>
                </Datagrid>
            </ListContextProvider>
        </Box>
    );
};

export const ResultsList = (props: { data: any }) => {
    const { data } = props;
    const listContext = useList({ data: data || [] });

    return (
        <ListContextProvider value={listContext}>
            <Datagrid bulkActionButtons={false} rowClick={false}>
                <TextField source="key" label="fields.key.title" />
                <TextField
                    source="value"
                    label="fields.value.title"
                    sortable={false}
                />
            </Datagrid>
        </ListContextProvider>
    );
};

export const InputOutputsList = (props: { data: any[] }) => {
    const { data } = props;
    const { root: projectId } = useRootSelector();
    const listContext = useList({ data: data || [] });

    return (
        <ListContextProvider value={listContext}>
            <Datagrid bulkActionButtons={false} rowClick={false}>
                <TextField source="name" label="fields.name.title" />
                <FunctionField
                    sortable={false}
                    label="fields.kind"
                    render={r => {
                        try {
                            if (
                                r.key.startsWith('store://' + projectId + '/')
                            ) {
                                //local ref, build path
                                const obj = keyParser(r.key);
                                return (
                                    <TextField record={obj} source={'kind'} />
                                );
                            }
                        } catch (e) {}
                        return null;
                    }}
                />
                <TextField
                    source="key"
                    label="fields.key.title"
                    sortable={false}
                />

                <FunctionField
                    sortable={false}
                    render={r => {
                        try {
                            if (
                                r.key.startsWith('store://' + projectId + '/')
                            ) {
                                //local ref, build path
                                const obj = keyParser(r.key);
                                if (obj.id) {
                                    return (
                                        <ShowButton
                                            resource={obj.resource}
                                            record={{ id: obj.id }}
                                        />
                                    );
                                }
                            }
                        } catch (e) {}
                        return null;
                    }}
                />
            </Datagrid>
        </ListContextProvider>
    );
};
