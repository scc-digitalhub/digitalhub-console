// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    SelectInput,
    TextInput,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { StateChips, StateColors } from '../components/StateChips';
import { ReactElement, useEffect, useState } from 'react';
import { useSchemaProvider } from '../provider/schemaProvider';
import { FUNCTION_OR_WORKFLOW } from '../common/helper';

const fileRelatedStates = ['CREATED', 'UPLOADING', 'ERROR', 'READY'];

const stateFilterValues = {
    artifacts: fileRelatedStates,
    dataitems: fileRelatedStates,
    models: fileRelatedStates,
    runs: Object.keys(StateColors),
    triggers: Object.keys(StateColors),
};

const getChoices = (resource: string) => {
    const states: any[] = [];

    for (const c of stateFilterValues[resource]) {
        states.push({
            id: c,
            name: 'states.' + c.toLowerCase(),
        });
    }

    return states;
};

export type GetFiltersFunction = (
    functions?: any[]
) => ReactElement[] | undefined;

export const useGetFilters = (): GetFiltersFunction => {
    const translate = useTranslate();
    const resource = useResourceContext();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();

    useEffect(() => {
        if (schemaProvider && resource) {
            schemaProvider.kinds(resource).then(res => {
                if (res) {
                    const values = res.map(s => ({
                        id: s,
                        name: s,
                    }));

                    setKinds(values);
                }
            });
        }
    }, [resource, schemaProvider, setKinds]);

    const selectProps = {
        alwaysOn: true,
        sx: { '& .RaSelectInput-input': { margin: '0px' } },
    };

    const getFilters: GetFiltersFunction = functions => {
        if (!kinds || !resource) {
            return undefined;
        }

        let filters = [
            <TextInput
                label="fields.name.title"
                source="q"
                alwaysOn
                resettable
                key={1}
            />,
            <SelectInput
                key={2}
                label="fields.kind"
                source="kind"
                choices={kinds}
                {...selectProps}
            />,
        ];

        if (Object.keys(stateFilterValues).includes(resource)) {
            filters.push(
                <SelectInput
                    key={3}
                    label="fields.status.state"
                    source="state"
                    choices={getChoices(resource)}
                    optionText={(choice: any) => {
                        return (
                            <StateChips
                                record={choice}
                                source="id"
                                label="name"
                            />
                        );
                    }}
                    {...selectProps}
                />
            );
        }

        if (functions) {
            filters.push(
                <SelectInput
                    key={4}
                    label={`${translate('resources.functions.name', {
                        smart_count: 1,
                    })}/${translate('resources.workflows.name', {
                        smart_count: 1,
                    })}`}
                    source={FUNCTION_OR_WORKFLOW}
                    choices={functions}
                    {...selectProps}
                />
            );
        }

        return filters;
    };

    return getFilters;
};
