// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ListBase,
    ListView,
    required,
    SelectInput,
    TextInput,
} from 'react-admin';
import { useStepper } from '@dslab/ra-stepper';
import { toYaml } from '@dslab/ra-export-record-button';
import { AceEditorInput } from '@dslab/ra-ace-editor';
import yaml from 'yaml';
import { getTaskUiSpec } from '../../../pages/tasks/types';
import { getRunUiSpec } from '../types';
import {
    KindChangeGuard,
    KindSelector,
} from '../../../common/components/KindSelector';
import {
    filterProps,
    isValidAgainstSchema,
    stripProperties,
} from '../../../common/jsonSchema/utils';
import Ajv2020 from 'ajv/dist/2020';
import { customizeValidator } from '@rjsf/validator-ajv8';
import { useState, useEffect } from 'react';
import { useSchemaProvider } from '../../../common/provider/schemaProvider';
import { SpecInput } from '../../../common/jsonSchema/components/SpecInput';
import { Box } from '@mui/material';
import { useKinds } from '../../../common/hooks/useKinds';
import { FILTER_INPUT_PROPS } from '../../../common/theme';
import { FunctionDataGrid } from '../../functions/list/FunctionDataGrid';
import { useFormContext, useWatch } from 'react-hook-form';

const ajv = customizeValidator({ AjvClass: Ajv2020 });

export const FunctionStep = ({
    onSelect,
}: {
    onSelect?: (record: any | undefined) => void;
}) => {
    const kinds = useKinds({ resource: 'functions' });
    const { setValue } = useFormContext();
    const { currentStep, goToStep, steps } = useStepper();

    const handleSelect = (record: any) => {
        if (record) {
            onSelect?.(record.kind);
            setValue(
                'spec.function',
                `${record.kind}://${record.project}/${record.name}:${record.id}`
            );
            const nextStep = currentStep + 1;
            if (nextStep < steps.length) {
                goToStep(nextStep);
            }
        }
    };
    return (
        <ListBase resource="functions" disableSyncWithLocation>
            <ListView
                filters={
                    kinds
                        ? [
                              <TextInput
                                  label="ra.action.search"
                                  source="q"
                                  alwaysOn
                                  resettable
                                  key="q"
                              />,
                              <SelectInput
                                  key="kind"
                                  label="fields.kind"
                                  source="kind"
                                  choices={kinds.map(s => ({
                                      id: s,
                                      name: s,
                                  }))}
                                  {...FILTER_INPUT_PROPS}
                              />,
                          ]
                        : undefined
                }
                actions={false}
                component={Box}
                sx={{ pb: 2 }}
            >
                <FunctionDataGrid onSelect={handleSelect} />
            </ListView>
        </ListBase>
    );
};

export const TaskStep = ({
    kind,
    kinds,
    onKindChange,
    readOnly,
}: {
    kind?: string;
    kinds: { id: string; name: string }[];
    onKindChange?: (kind: string | undefined) => void;
    readOnly: boolean;
}) => {
    const [isSpecDirty, setIsSpecDirty] = useState(false);
    const [schema, setSchema] = useState<any>();
    const schemaProvider = useSchemaProvider();
    const { getValues, setValue } = useFormContext();
    const functionValue = useWatch({ name: 'spec.function' });
    const workflowValue = useWatch({ name: 'spec.workflow' });

    useEffect(() => {
        if (!kind || !schemaProvider) {
            setSchema(undefined);
            return;
        }

        schemaProvider
            .get('tasks', kind)
            .then(schemaResult => {
                const nextSchema = stripProperties(schemaResult?.schema, [
                    'function',
                    'workflow',
                    'task',
                    'local_execution',
                ]);
                setSchema({ ...schemaResult, schema: nextSchema ?? undefined });
            })
            .catch(() => setSchema(undefined));
    }, [kind, schemaProvider]);

    return (
        <>
            <KindChangeGuard
                source="spec.task"
                field="spec"
                isDirty={Boolean(isSpecDirty)}
                onConfirm={nextKind => {
                    const nextSpec = {
                        ...(getValues('spec') || {}),
                        ...(functionValue !== undefined
                            ? { function: functionValue }
                            : {}),
                        ...(workflowValue !== undefined
                            ? { workflow: workflowValue }
                            : {}),
                    };
                    if (nextKind === undefined) {
                        delete nextSpec.task;
                    } else {
                        nextSpec.task = nextKind;
                    }
                    setValue('spec', nextSpec, { shouldDirty: true });
                    onKindChange?.(nextKind);
                }}
            />
            <KindSelector
                source="spec.task"
                kinds={kinds}
                defaultValue={kind}
                readOnly={readOnly}
            />
            {schema && (
                <SpecStep
                    source="spec"
                    schema={schema?.schema}
                    uiSchema={getTaskUiSpec(schema?.schema)}
                    kind={kind}
                    onDirty={setIsSpecDirty}
                />
            )}
        </>
    );
};

export const RunStep = ({ kind, task }: { kind?: string; task?: string }) => {
    const [schema, setSchema] = useState<any>();
    const schemaProvider = useSchemaProvider();
    const { getValues, setValue } = useFormContext();

    useEffect(() => {
        if (!kind || !task || !schemaProvider) {
            setSchema(undefined);
            return;
        }

        //set kind in kind field of the form if not aligned
        const currentKind = getValues('kind');
        if (currentKind !== kind) {
            setValue('kind', kind, { shouldDirty: false });
        }

        Promise.all([
            schemaProvider.get('runs', kind),
            schemaProvider.get('tasks', task),
        ])
            .then(lists => {
                const [runSchemaResult, taskSchemaResult] = lists;
                const nextSchema = stripProperties(
                    filterProps(
                        runSchemaResult?.schema,
                        taskSchemaResult?.schema
                    ),
                    ['function', 'workflow', 'task', 'local_execution']
                );

                setSchema({
                    ...runSchemaResult,
                    schema: nextSchema ?? undefined,
                });
            })
            .catch(() => setSchema(undefined));
    }, [kind, task, schemaProvider]);

    if (!schema) {
        return null;
    }
    return (
        <SpecStep
            source="spec"
            schema={schema?.schema}
            uiSchema={getRunUiSpec(schema)}
            kind={kind}
        />
    );
};

export const SummaryStep = ({ kind }: { kind?: string }) => {
    const [schema, setSchema] = useState<any>();
    const schemaProvider = useSchemaProvider();

    useEffect(() => {
        if (!kind || !schemaProvider) {
            return;
        }

        schemaProvider
            .get('triggers', kind)
            .then(schemaResult => {
                setSchema(schemaResult?.schema);
            })
            .catch(() => setSchema(undefined));
    }, [kind, schemaProvider]);

    const validators = [required()] as any[];
    if (schema) {
        validators.push(isValidAgainstSchema(ajv, schema));
    }

    return (
        <AceEditorInput
            mode="yaml"
            theme="github"
            source="spec"
            parse={toYaml}
            format={yaml.parse}
            validate={validators}
        />
    );
};

const SpecStep = ({
    source,
    schema,
    uiSchema,
    kind,
    onDirty,
}: {
    source: string;
    schema?: any;
    uiSchema?: any;
    kind?: string;
    onDirty?: (dirty: boolean) => void;
}) => {
    if (!schema || !kind) {
        return null;
    }

    return (
        <SpecInput
            source={source}
            schema={schema}
            label={''}
            uiSchema={uiSchema}
            kind={kind}
            onDirty={onDirty}
        />
    );
};
