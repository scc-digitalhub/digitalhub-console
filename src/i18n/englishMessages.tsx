import englishMessages from 'ra-language-english';

const fields = {
    id: 'Id',
    name: 'Name',
    kind: 'Kind',
    key: 'Key',
    project: 'Project',
    metadata: {
        created: 'Created',
        updated: 'Updated',
        name: 'Name',
        description: 'Description',
        project: 'Project',
        version: 'Version',
        labels: 'Labels',
    },
    spec: {
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
    },
    status: {
        state: 'Status',
    },
    code: 'Code',
    base: 'Base',
    summary: 'Summary',
};

const messages = {
    ...englishMessages,
    login: {
        basicMessage: 'Authenticate to continue',
        title: 'Resource Manager',
        message: 'Access with AAC',
    },
    bar:{
        backProjects:'To projects',
    },
    menu: {
        projects: 'Projects',
        configuration: 'Configuration',
    },
    fields: fields,
    resources: {
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
            labelName:"Name",
            path:"Path",
            provider: 'Provider'
        },
        runs: {
            name: 'Run |||| Runs',
            fields: {
                ...fields,
            },
            empty: 'No runs yet',
            create: 'Create a new run',
            labelName:"Name"
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
        tasks: {
            name: 'Task |||| Tasks',
            fields: { ...fields },
            kinds: {
                'transform': 'Transform',
                'infer': 'Infer',
                'metric': 'Metric',
                'profile': 'Profile',
                'validate': 'Validate',
                'deploy': 'Deploy',
                'job': 'Job',
                'serve': 'Serve',
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
};

export default messages;
