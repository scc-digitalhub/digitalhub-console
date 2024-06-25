import englishMessages from 'ra-language-english';

const specs = {
    metadata: {
        base: {
            title: 'Metadata',
            description: '',
        },
        embedded: {
            title: 'Embedded',
            description: '',
        },
        versioning: {
            title: 'Versioning',
            description: '',
        },
        openmetadata: {
            title: 'Openmetadata',
            description: '',
        },
        audit: {
            title: 'Audit',
            description: '',
        },
    },
    artifact: {
        title: 'Metadata Artifact',
        description: '',
    },
    dataitem: {
        title: 'Metadata Dataitem',
        description: '',
    },
    model: {
        title: 'Metadata Model',
        description: '',
    },
    container: {
        title: 'Container',
        description: '',
    },
    nefertem: {
        title: 'Nefertem',
        description: '',
    },
    python: {
        title: 'Python',
        description: '',
    },
    dbt: {
        title: 'Dbt',
        description: '',
    },
    mlrun: {
        title: 'mlrun',
        description: '',
    },
    table: {
        title: 'Table',
        description: '',
    },
};
const fields = {
    id: 'Id',
    // name: 'Name',
    kind: 'Kind',
    // key: 'Key',
    project: 'Project',
    container: {
        args: { title: 'Container args', description: '' },
        instructions: {
            description: 'Instructions definition',
        },
        baseImage: { title: 'Container args', description: '' },
        command: { title: 'Container args', description: '' },
        image: { title: 'Container args', description: '' },
    },
    execArgs: {
        title: 'Execution arguments',
        description: 'Execution arguments definition',
    },
    schedule: {
        title: 'Schedule',
        description: 'Schedule definition',
    },
    backoffLimit: {
        title: 'Backoff Limit',
        description: 'Backoff Limit definition',
    },
    requests: {
        title: 'Request',
        description: 'Request definition',
    },
    limits: {
        title: 'Limits',
        description: 'Limits definition',
    },
    base64: {
        title: 'Base 64',
        description: 'Base 64 definition',
    },
    mountPath: {
        title: 'Mounth Path',
        description: 'Mounth Path definition ',
    },
    volumeType: {
        title: 'Volume Type',
        description: 'Volume Type definition',
    },
    name: {
        title: 'Name',
        description: '',
    },
    key: {
        title: 'Key',
        description: '',
    },
    value: {
        title: 'Value',
        description: '',
    },
    protocol: {
        title: 'Protocol',
        description: 'Protocol definition',
    },
    source: {
        title: 'Source',
        description: 'Source definition',
    },
    replicas: {
        title: 'Replicas',
        description: 'Replicas definition',
    },
    contextSources: {
        title: 'Context sources',
        description: 'Context sources definition',
        item: {
            title: 'Item',
            description: '',
        },
    },
    secrets: {
        title: 'Secrets',
        description: 'Secrets definition',
        item: {
            title: 'Item',
            description: '',
        },
    },
    instructions: {
        title: 'Instructions',
        description: 'Instructions definition',
        item: {
            title: 'Title',
            description: '',
        },
    },
    destination: {
        title: 'Destination',
        description: 'Destination definition',
    },
    metadata: {
        created: 'Created',
        updated: 'Updated',
        name: 'Name',
        description: 'Description',
        project: 'Project',
        version: 'Version',
        labels: 'Labels',
    },
    k8s: {
        envs: {
            description: 'Environment definition',
        },
        description: 'K8S Resources definition',
    },
    framework: {
        description: 'framework definition',
    },
    spec: {
        title: 'Spec',
        description: 'Spec description',
        path: 'Path',
        src_path: 'Source path',
        compiled_code: 'Compiled code',
        raw_code: 'Raw code',
        schema: 'Schema',
        constraints: 'Constraints',
        error_report: 'Error report',
        metrics: 'Metrics',
        args: 'Args',
        base_image: 'Base image',
        command: 'Command',
        image: 'Image',
        base64: 'Base64',
        code: 'Code',
        source: 'Source',
        function: 'Function',
        k8s: 'K8S Resources',
        service_ports: 'Service ports',
        service_type: 'Service type',
    },
    status: {
        state: 'Status',
        files: 'Files',
    },
    inputs: {
        title: 'Inputs',
        description: 'Input objects',
        item: {
            title: '',
            description: '',
        },
    },
    outputs: {
        title: 'Outputs',
        description: 'Output objects',
        item: {
            title: '',
            description: '',
        },
    },
    code: 'Code',
    logs: 'Logs',
    base: 'Base',
    summary: 'Summary',
    description: {
        title: 'Description',
        description: '',
    },
    labels: {
        title: 'Labels',
        description: '',
    },
    updated: {
        title: 'Updated',
        description: '',
    },
    embedded: {
        title: 'Embedded',
        description: '',
    },
    openMetadata: {
        title: 'Open Metadata',
        description: '',
    },
    publish: {
        title: 'Publish',
        description: '',
    },
    createdBy: {
        title: 'Created by',
        description: '',
    },
    updatedBy: {
        title: 'Updated by',
        description: '',
    },
    created: {
        title: 'Created',
        description: '',
    },

    version: {
        title: 'Version',
        description: '',
    },
    path: {
        title: 'Path',
        description: '',
    },
    srcPath: {
        title: 'Src path',
        description: '',
    },
    algorithm: {
        title: 'Algorithm',
        description: '',
    },
    parameters: {
        title: 'Parameters',
        description: '',
    },
    baseModel: {
        title: 'Base Model',
        description: '',
    },
    metrics: {
        title: 'Metrics',
        description: '',
    },
    constraints: {
        title: 'Contraints',
        description: 'Contraints object',
        item: {
            title: 'Item',
            description: '',
        },
    },
    fields: {
        title: 'Fields',
        description: '',
        item: {
            title: '',
            description: '',
        },
    },
    example: { title: 'Example', description: '' },
    format: { title: 'Format', description: '' },
    title: { title: 'Title', description: '' },
    type: { title: 'Type', description: '' },
    schema: {
        title: 'Schema',
        description: '',
    },
    python: {
        requirements: {
            title: 'Python requirements',
            description: '',
        },
    },
    errorReport: {
        title: 'Error report',
        description: '',
    },
    sourceCode: {
        source: {
            title: 'Source Code',
            description: '',
        },
        lang: {
            title: 'Language',
            description: '',
        },
        handler: {
            title: 'Handler',
            description: '',
            base64: {
                title: 'Base 64',
                description: '',
            },
        },
    },
    info: {
        tab: 'Info',
        empty: 'No info available',
    },
    datagrid:{
        key: 'Name',
        value: 'Value'
    }
};

const messages = {
    ...englishMessages,
    login: {
        basicMessage: 'Authenticate to continue',
        title: 'Resource Manager',
        message: 'Login',
    },
    bar: {
        backProjects: 'To projects',
    },
    menu: {
        projects: 'Projects',
        configuration: 'Configuration',
    },
    exception: {
        code_invalid:
            'Code invalid: imppossible to show the source code. Conversion error',
    },
    fields: fields,
    specs: specs,
    resources: {
        projects: {
            name: 'Project |||| Projects',
            fields: { ...fields },
        },
        functions: {
            name: 'Function |||| Functions',
            list: 'List and search functions',
            fields: { ...fields },
            tab: {
                summary: 'Recap',
                test: 'test',
            },
        },
        secrets: {
            title: 'Secrets',
            list: 'List secrets',
            showData: 'Show the secret',
            name: 'Secret |||| Secrets',
            value: 'Value',
            labelName: 'Name',
            path: 'Path',
            provider: 'Provider',
        },
        runs: {
            name: 'Run |||| Runs',
            list: 'List and search runs',
            fields: {
                ...fields,
            },
            empty: 'No runs yet',
            create: 'Create a new run',
            labelName: 'Name',
        },
        artifacts: {
            name: 'Artifact |||| Artifacts',
            list: 'List and search artifacts',
            fields: { ...fields },
        },
        dataitems: {
            name: 'Data item |||| Data items',
            list: 'List and search data items',
            fields: { ...fields },
            tab: {
                schema: 'Schema',
                preview: 'Preview',
            },
            schema: {
                title: 'Schema',
                name: 'Name',
                type: 'Type',
            },
            preview: {
                title: 'Preview',
                true: 'True',
                false: 'False',
                numberOfRows: 'Number of rows',
                notAvailable: 'Preview not available',
            },
        },
        models: {
            name: 'Model |||| Models',
            list: 'List of models with search filters',
            fields: { ...fields },
            tab: {
                metrics: 'Metrics',
                preview: 'Preview',
            },
            metrics: {
                title: 'Metrics',
                key: 'Name',
                value: 'Value',
            },
        },
        tasks: {
            name: 'Task |||| Tasks',
            fields: { ...fields },
            kinds: {
                transform: 'Transform',
                infer: 'Infer',
                metric: 'Metric',
                profile: 'Profile',
                validate: 'Validate',
                deploy: 'Deploy',
                job: 'Job',
                serve: 'Serve',
                pipeline: 'Pipeline',
                build: 'Build',
            },
            errors: {
                requestMinorLimits: 'Request must be minor than Limits',
            },
        },
        workflows: {
            name: 'Workflow |||| Workflows',
            list: 'List and search workflows',
            fields: {
                ...fields,
                run_id: 'Run ID',
                action: 'Action',
                function: 'Function',
                start_time: 'Start',
                end_time: 'End',
            },
            tab: {
                summary: 'Recap',
                test: 'test',
                runs: 'Runs',
            },
            inputs: 'Inputs',
            outputs: 'Outputs',
        },
        logs: {
            name: 'Log |||| Logs',
            list: 'List logs',
            fields: {
                ...fields,
                run_id: 'Run ID',
            },
        },
        common: {
            emptySpec: 'Select the kind to view the specification',
            labels: 'Labels',
            version: {
                title: 'Versions',
                version: 'Version',
                created: 'Creation date',
            },
        },
        list: {
            expandable: {
                version: 'Version',
                created: 'Creation date',
            },
        },
    },
    states: {
        completed: 'Completed',
        running: 'Running',
        error: 'Error',
        built: 'Built',
        ready: 'Ready',
        deleting: 'Deleting',
        deleted: 'Deleted',
    },
    pages: {
        dashboard: {
            text: 'Define, build and execute functions to manage artifacts and dataitems.',
            created: 'Created',
            updated: 'Updated',
            recent: 'Recent',
            states: {
                completed: 'Completed',
                running: 'Running',
                error: 'Error',
            },
            functions: {
                title: 'Functions and code',
                empty: 'No functions yet',
            },
            dataitems: {
                title: 'Data items',
                empty: 'No data items yet',
            },
            models: {
                title: 'Models',
                empty: 'No models yet',
            },
            artifacts: {
                title: 'Artifacts',
                empty: 'No artifacts yet',
            },
            runs: {
                title: 'Jobs and runs',
                empty: 'No runs yet',
            },
        },
        functions: {
            show: {
                title: 'Function #%{name}',
                subtitle: '%{kind} function',
            },
        },
        config: {
            title: 'Configuration',
            text: 'Review and update project configuration and settings',
        },
    },
    pageTitle: {
        show: {
            title: '%{resource} #%{name}',
            subtitle: '%{kind} %{resource}',
        },
        create: {
            title: 'Create a new %{resource}',
            subtitle: 'Fill the form to create and save a new %{resource}',
        },
        edit: {
            title: 'Edit %{resource} #%{name}',
            subtitle:
                'Modify the %{resource} for %{kind} by updating metadata and specification',
        },
        list: {
            title: '%{resource}',
        },
    },
    search: {
        name: 'Name',
        kind: 'Kind',
    },
    buttons: {
        cancel: 'Cancel',
        newVersion: 'New version',
        create: 'Create',
    },
    dashboard: {
        create: 'To create a new project, press the button below',
    },
    validation: {
        minValue: 'Value must be greater that or equal to %{min}',
        noSpace: 'Value must contain no space',
        wrongChar:
            'The name must consist exclusively of numbers, lowercase letters, and hyphens, without the possibility of placing the latter at the beginning or end of the word',
        invalidKind: 'Invalid kind',
        invalidValue: 'Invalid value',
        invalidDate: 'Invalid date',
        invalidDatetime: 'Invalid datetime',
        unsupportedField: 'Unsupported field',
    },
    messages: {
        type_and_press_enter: 'Type and press ENTER to add',
        double_click_to_edit: 'Double click to edit',
    },
    k8s: {
        envs: {
            title: 'Environments',
            description: 'Environments definition',
        },
        node_selector: {
            title: 'Node selector',
            description: 'Node selector definition',
        },
        secrets: {
            title: 'Secrets',
            description: 'Secrets definition',
        },
        volumes: {
            title: 'Volumes',
            description: 'Volumes definition',
        },

        resources: {
            title: 'Resources',
            description: 'K8s resources',
            cpu: {
                title: 'Cpu',
            },
            memory: {
                title: 'Memory',
            },
            gpu: {
                title: 'Gpu',
            },
        },
    },
};

export default messages;
