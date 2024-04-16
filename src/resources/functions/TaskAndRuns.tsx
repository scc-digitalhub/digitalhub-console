import { TaskEditComponent, TaskShowComponent } from '../tasks';
import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    Labeled,
    List,
    SaveButton,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    Toolbar,
    TopToolbar,
    useGetResourceLabel,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { Box, Divider, Stack, Typography } from '@mui/material';
import {
    CreateInDialogButton,
    EditInDialogButton,
    ShowInDialogButton,
} from '@dslab/ra-dialog-crud';
import { InspectButton } from '@dslab/ra-inspect-button';
import { useEffect, useState } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { JsonSchemaInput } from '../../components/JsonSchema';
import { StateChips } from '../../components/StateChips';
import InboxIcon from '@mui/icons-material/Inbox';
import { WorkflowView } from '../../components/WorkflowView';
import {
    getTemplate,
    getUiOptions,
    titleId,
    StrictRJSFSchema,
    RJSFSchema,
    FormContextType,
    ObjectFieldTemplateProps,
    ObjectFieldTemplatePropertyType,
} from '@rjsf/utils';
import { CoreResourceFieldWidget } from '../../components/resourceInput/CoreResourceFieldWidget';
import { KeyValueFieldWidget } from '../../components/resourceInput/KeyValueFieldWidget';
import { VolumeResourceFieldWidget } from '../../components/resourceInput/VolumeResourceFieldWidget';
import React from 'react';
import { checkCpuRequestError } from '../../components/resourceInput/CoreResourceCpuWidget';
import { checkMemRequestError } from '../../components/resourceInput/CoreResourceMemWidget';
import { checkGpuRequestError } from '../../components/resourceInput/CoreResourceGpuWidget';

export const TaskAndRuns = (props: { key?: string }) => {
    const { key } = props;

    const record = useRecordContext();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('task', 1);

    return (
        <>
            <TopToolbar>
                <ShowInDialogButton fullWidth maxWidth={'lg'}>
                    <TaskShowComponent />
                </ShowInDialogButton>
                <EditInDialogButton fullWidth maxWidth={'lg'}>
                    <TaskEditComponent />
                </EditInDialogButton>
                <InspectButton />
            </TopToolbar>
            <SimpleShowLayout>
                <Stack direction={'row'} spacing={3}>
                    <Labeled>
                        <TextField source="kind" />
                    </Labeled>
                    <Labeled>
                        <TextField source="id" />
                    </Labeled>
                </Stack>
                <Labeled>
                    <TextField source="key" />
                </Labeled>
            </SimpleShowLayout>
            <TaskRunList />
        </>
    );
};

const TaskRunList = () => {
    const record = useRecordContext();
    const schemaProvider = useSchemaProvider();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('runs', 2);
    const [schema, setSchema] = useState<any>();
    const fn = record?.spec?.function || '';
    const url = new URL(fn);
    const runtime = url.protocol
        ? url.protocol.substring(0, url.protocol.length - 1)
        : '';
    url.protocol = record.kind + ':';
    const key = url.toString();
    useEffect(() => {
        if (!schemaProvider || !record || !fn) {
            return;
        }

        schemaProvider
            .list('runs', runtime)
            .then(schemas => {
                if (schemas) {
                    setSchema(schemas.pop());
                }
            })
            .catch(error => {
                console.log('error:', error);
            });
    }, [record, schemaProvider]);

    const partial = {
        project: record?.project,
        kind: schema ? schema.kind : 'run',
        spec: {
            task: key,
        },
    };

    const prepare = (r: any) => {
        return {
            ...r,
            spec: {
                task: key,
                ...r.spec,
            },
        };
    };

    const runSpecUiSchema = {
        task: {
            'ui:readonly': true,
        },
        function_spec: {
            source: {
                'ui:widget': 'hidden',
            },
        },
        transform_spec: {
            k8s: {
                affinity: {
                    'ui:widget': 'hidden',
                },
                resources: {
                    cpu: {
                        'ui:ObjectFieldTemplate':CoreResourceFieldWidget,
                        'ui:title': 'Cpu',
                        'ui:order': [ 'requests','limits'],

                        limits: {
                            'ui:widget': 'coreResourceCpuWidget',
                            'ui:options': {
                                'ui:title': 'Limits',
                            },
                        },
                        requests: {
                            'ui:widget': 'coreResourceCpuWidget',
                            'ui:options': {
                                'ui:title': 'Request',
                            },
                        },
                    },
                    gpu: {
                        'ui:ObjectFieldTemplate':CoreResourceFieldWidget,
                        'ui:title': 'Gpu',
                        'ui:order': [ 'requests','limits'],

                        limits: {
                            'ui:widget': 'hidden',
                        },
                        requests: {
                            'ui:widget': 'coreResourceGpuWidget',
                            'ui:options': {
                                'ui:title': 'Request',
                            },
                        },
                    },
                    mem: {
                        'ui:ObjectFieldTemplate':CoreResourceFieldWidget,
                        'ui:title': 'Memory',
                        'ui:order': [ 'requests','limits'],
                        limits: {
                            'ui:widget': 'coreResourceMemWidget',
                            'ui:options': {
                                'ui:title': 'Limits',
                            },
                        },
                        requests: {
                            'ui:widget': 'coreResourceMemWidget',
                            'ui:options': {
                                'ui:title': 'Request',
                            },
                        },
                    },
                },

                envs: {
                    items: {
                        'ui:ObjectFieldTemplate':KeyValueFieldWidget,
                    },
                },
                node_selector: {
                    items: {
                        'ui:ObjectFieldTemplate':KeyValueFieldWidget,
                    },
                },
                labels: {
                    items: {
                        'ui:ObjectFieldTemplate':KeyValueFieldWidget,
                    },
                },
                volumes:{
                    items: {
                        'ui:ObjectFieldTemplate':VolumeResourceFieldWidget,
                        'ui:order': [ 'mount_path','name','volume_type','spec'],

                    }
                },
            },
        },
    };
    function ObjectFieldTemplate<
        T = any,
        S extends StrictRJSFSchema = RJSFSchema,
        F extends FormContextType = any
    >(props: ObjectFieldTemplateProps<T, S, F>) {
        const {
            registry,
            properties,
            title,
            description,
            uiSchema,
            required,
            schema,
            idSchema,
        } = props;
        const options = getUiOptions<T, S, F>(uiSchema);
        const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>(
            'TitleFieldTemplate',
            registry,
            options
        );
        return (
            <div>
                {title && (
                    <TitleFieldTemplate
                        id={titleId<T>(idSchema)}
                        title={title}
                        required={required}
                        schema={schema}
                        uiSchema={uiSchema}
                        registry={registry}
                    />
                )}{' '}
                {description}
                <div className="row">
                    {properties.map((prop: ObjectFieldTemplatePropertyType) => (
                        <div
                            className="col-lg-1 col-md-2 col-sm-4 col-xs-6"
                            key={prop.content.key}
                        >
                            {prop.content}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    

    const getExpandArea = () => {
        return record.kind === 'kfp+pipeline' 
        ? <WorkflowView/> 
        : <></>;
    }
    const canExpand = () => {
        return record.kind === 'kfp+pipeline';
    }


    function customValidate(formData, errors) {
        if (checkCpuRequestError(formData)) {
            errors.transform_spec.k8s.resources.cpu.addError(translate('resources.runs.errors.requestMinorLimits'));
        }
        if (checkMemRequestError(formData)) {
            errors.transform_spec.k8s.resources.mem.addError("Request must be minor than Limits");
        }
        if (checkGpuRequestError(formData)) {
            errors.transform_spec.k8s.resources.gpu.addError("Request must be minor than Limits");
        }
        return errors;
      }
      
    const CreateActionButton = () => (
        <CreateInDialogButton
            resource="runs"
            record={partial}
            fullWidth
            maxWidth={'lg'}
            transform={prepare}
        >
            <SimpleForm toolbar={<CreateRunDialogToolbar />}>
                <TextInput source="kind" readOnly />
                {schema?.schema && (
                    <JsonSchemaInput
                        source="spec"
                        schema={schema.schema}
                        uiSchema={runSpecUiSchema}
                        customValidate={customValidate}
                    />
                )}
            </SimpleForm>
        </CreateInDialogButton>
    );
    const ListActions = () => <CreateActionButton />;
    const Empty = () => (
        <Box textAlign="center" m={'auto'} sx={{ color: 'grey.500' }}>
            <InboxIcon fontSize="large" sx={{ width: '9em', height: '9em' }} />
            <Typography variant="h4" paragraph>
                {translate('resources.runs.empty')}
            </Typography>
            <Typography variant="body1">
                {translate('resources.runs.create')}
            </Typography>
            <CreateActionButton />
        </Box>
    );
    return (
        <>
            <Typography variant="h4" color={'secondary.main'}>
                {label}
            </Typography>

            <List
                resource="runs"
                sort={{ field: 'created', order: 'DESC' }}
                filter={{ task: key }}
                disableSyncWithLocation
                empty={<Empty />}
                actions={<ListActions />}
            >
                <Datagrid bulkActionButtons={false}>
                    <DateField source="metadata.created" />
                    <TextField source="id" />
                    <StateChips source="status.state" />
                    <RowButtonGroup label="⋮">
                        <ShowInDialogButton>
                            <SimpleShowLayout>
                                <Stack direction={'row'} spacing={3}>
                                    <Labeled>
                                        <TextField source="name" />
                                    </Labeled>

                                    <Labeled>
                                        <TextField source="kind" />
                                    </Labeled>
                                </Stack>
                                <Labeled>
                                    <TextField source="key" />
                                </Labeled>
                                <Divider />
                                <Stack direction={'row'} spacing={3}>
                                    <Labeled>
                                        <DateField
                                            source="metadata.created"
                                            showDate
                                            showTime
                                        />
                                    </Labeled>

                                    <Labeled>
                                        <DateField
                                            source="metadata.updated"
                                            showDate
                                            showTime
                                        />
                                    </Labeled>
                                </Stack>
                                <Labeled>
                                    <TextField source="spec.task" />
                                </Labeled>
                                <Labeled>
                                    <StateChips source="status.state" />
                                </Labeled>
                            </SimpleShowLayout>
                        </ShowInDialogButton>
                        <InspectButton />
                        <DeleteWithConfirmButton redirect={false} />
                    </RowButtonGroup>
                </Datagrid>
            </List>
        </>
    );
};

const CreateRunDialogToolbar = () => (
    <Toolbar>
        <SaveButton alwaysEnable />
    </Toolbar>
);
