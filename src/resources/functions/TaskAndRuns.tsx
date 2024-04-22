import { TaskEdit, TaskEditComponent, TaskShowComponent } from '../tasks';
import {
    ChipField,
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    Empty,
    EmptyClasses,
    FunctionField,
    Labeled,
    List,
    ListNoResults,
    RecordContextProvider,
    ResourceContextProvider,
    SaveButton,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    Toolbar,
    TopToolbar,
    useGetResourceLabel,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Box, Divider, Stack, Typography } from '@mui/material';
import {
    CreateInDialogButton,
    EditInDialogButton,
    ShowInDialogButton,
} from '@dslab/ra-dialog-crud';
import { InspectButton } from '@dslab/ra-inspect-button';
import { Inbox } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { RowButtonGroup } from '../../components/RowButtonGroup';
import { JsonSchemaInput } from '../../components/JsonSchema';
import { StateChips } from '../../components/StateChips';
import { PageTitle } from '../../components/PageTitle';
import DashboardIcon from '@mui/icons-material/Dashboard';
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
import { CoreResourceField } from '../../components/resourceInput/CoreResourceField';

export const TaskAndRuns = (props: { key?: string }) => {
    const { key } = props;

    const record = useRecordContext();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('task', 1);

    return (
        <>
            {/* <Typography variant="h5">
                {record &&
                    translate('pageTitle.show.title', {
                        resource: label,
                        name: record.kind,
                    })}
            </Typography> */}
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
                        'ui:ObjectFieldTemplate':CoreResourceField,
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
                        'ui:ObjectFieldTemplate':CoreResourceField,
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
                        'ui:ObjectFieldTemplate':CoreResourceField,
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

                    // items:
                    // {
                    //     'ui:order': ['resource_type', 'requests','limits'],
                    //     limits:{
                    //         'ui:widget': 'limitsInput',
                    //     },
                    //     requests:{
                    //         'ui:widget': 'requestInput'
                    //     },
                    //     resource_type: {
                    //         'ui:widget': 'typeInput'
                    //     }
                    // }
                },
                envs: {
                    items: {
                        'ui:widget': 'mapListInput',
                    },
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
                <Datagrid 
                    expand={ getExpandArea() }
                    expandSingle={ canExpand() }
                    bulkActionButtons={false}>
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
