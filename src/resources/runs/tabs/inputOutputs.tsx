// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Datagrid,
    FunctionField,
    Labeled,
    ListContextProvider,
    ShowButton,
    TextField,
    useList,
} from 'react-admin';
import { useRootSelector } from '@dslab/ra-root-selector';
import { keyParser } from '../../../common/helper';

export const ResultsList = (props: { record: any }) => {
    const { record } = props;
    const data = record?.status?.results
        ? Object.keys(record.status.results).map(k => ({
              id: k,
              key: k,
              value: JSON.stringify(record.status.results[k] || null),
          }))
        : [];
    const listContext = useList({ data });
    return (
        <Labeled label="fields.results">
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
        </Labeled>
    );
};

export const InputsList = (props: { record: any }) => {
    const { record } = props;
    const data = record?.spec?.inputs
        ? Object.keys(record.spec.inputs).map(k => ({
              key: record.spec.inputs[k],
              name: k,
              id: k,
          }))
        : [];

    return (
        <Labeled label={'fields.inputs.title'}>
            <InputOutputsList data={data} />
        </Labeled>
    );
};

export const OutputsList = (props: { record: any }) => {
    const { record } = props;
    const data = record?.status?.outputs
        ? Object.keys(record.status.outputs).map(k => ({
              key: record.status.outputs[k],
              name: k,
              id: k,
          }))
        : [];

    return (
        <Labeled label={'fields.outputs.title'}>
            <InputOutputsList data={data} />
        </Labeled>
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
