import { SelectInput, TextInput, useTranslate } from 'react-admin';
import { StateChips } from '../components/StateChips';
import { ReactElement } from 'react';

export type GetFiltersFunction = (
    kinds?: any[],
    states?: any[],
    functions?: any[],
    workflows?: any[]
) => ReactElement[];

export const useGetFilters = (): GetFiltersFunction => {
    const translate = useTranslate();

    const getFilters: GetFiltersFunction = (
        kinds,
        states,
        functions,
        workflows
    ) => {
        let filters = [
            <TextInput
                label="fields.name.title"
                source="q"
                alwaysOn
                resettable
                key={1}
            />,
        ];

        if (kinds) {
            filters.push(
                <SelectInput
                    alwaysOn
                    key={2}
                    label="fields.kind"
                    source="kind"
                    choices={kinds}
                    sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
                />
            );
        }

        if (states) {
            filters.push(
                <SelectInput
                    alwaysOn
                    key={3}
                    label="fields.status.state"
                    source="state"
                    choices={states}
                    optionText={(choice: any) => {
                        return (
                            <StateChips
                                record={choice}
                                source="id"
                                label="name"
                            />
                        );
                    }}
                    sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
                />
            );
        }

        if (functions) {
            filters.push(
                <SelectInput
                    alwaysOn
                    key={4}
                    label={translate('resources.functions.name', {
                        smart_count: 1,
                    })}
                    source="function"
                    choices={functions}
                    sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
                />
            );
        }

        if (workflows) {
            filters.push(
                <SelectInput
                    alwaysOn
                    key={5}
                    label={translate('resources.workflows.name', {
                        smart_count: 1,
                    })}
                    source="workflow"
                    choices={workflows}
                    sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
                />
            );
        }

        return filters;
    };

    return getFilters;
};
