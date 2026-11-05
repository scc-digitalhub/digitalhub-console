// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ListBase,
    ListView,
    required,
    SelectInput,
    TextInput,
    useRecordContext,
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
import deepEqual from 'deep-is';
import { omit } from 'lodash';

const ajv = customizeValidator({ AjvClass: Ajv2020 });

const NON_TASK_SPEC_KEYS = ['function', 'workflow', 'task', 'local_execution'];

export const FunctionStep = () => {
    const kinds = useKinds({ resource: 'functions' });
    const { setValue } = useFormContext();
    const { currentStep, goToStep, steps } = useStepper();

    const handleSelect = (record: any) => {
        if (record) {
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
    readOnly,
}: {
    kind?: string;
    kinds: { id: string; name: string }[];
    readOnly: boolean;
}) => {
    const [schema, setSchema] = useState<any>();
    const schemaProvider = useSchemaProvider();
    const record = useRecordContext();
    const { getValues, setValue } = useFormContext();
    const specValue = useWatch({ name: 'spec' });
    const functionValue = specValue?.function;
    const workflowValue = specValue?.workflow;

    //dirty only when task-owned params differ from the record, ignoring function/task bindings
    const isSpecDirty = !deepEqual(
        omit(specValue || {}, NON_TASK_SPEC_KEYS),
        omit(record?.spec || {}, NON_TASK_SPEC_KEYS)
    );

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
            {readOnly ? (
                <TextInput source="spec.task" readOnly />
            ) : (
                <>
                    <KindChangeGuard
                        source="spec.task"
                        field="spec"
                        isDirty={isSpecDirty}
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
                        }}
                    />
                    <KindSelector source="spec.task" kinds={kinds} />
                </>
            )}

            {schema && (
                <SpecStep
                    source="spec"
                    schema={schema?.schema}
                    uiSchema={getTaskUiSpec(schema?.schema)}
                    kind={kind}
                />
            )}
        </>
    );
};

export const RunStep = ({ kind, task }: { kind?: string; task?: string }) => {
    const [schema, setSchema] = useState<any>();
    const schemaProvider = useSchemaProvider();

    useEffect(() => {
        if (!kind || !task || !schemaProvider) {
            setSchema(undefined);
            return;
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
