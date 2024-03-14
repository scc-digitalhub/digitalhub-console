import englishMessages from 'ra-language-english';

const fields = {
    id: 'Id',
    name: 'Name',
    kind: 'Kind',
    key: 'Key',
    project: 'Project',
    metadata: {
        created: 'Date of creation',
        updated: 'Date of update',
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
    menu: {
        projects: 'Projects',
    },
    fields: fields,
    resources: {
        functions: {
            name: 'Function |||| Functions',
            list: "Functions' list with search filters",
            fields: { ...fields },
            tab: {
                summary: 'Recap',
                test: 'test',
            },
        },
        secrets: {
            title: 'Secrets',
            showData: 'Show data',
            name: 'Secret |||| Secrets',
            value: 'Value',
        },
        runs: {
            name: 'Run |||| Runs',
            fields: {
                ...fields,
            },
        },
        artifacts: {
            name: 'Artifact |||| Artifacts',
            list: "Artifacts' list with search filters",
            fields: { ...fields },
        },
        dataitems: {
            name: 'Data item |||| Data items',
            list: "Data items' list with search filters",
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
                invalidValue: 'Invalid value',
                invalidDate: 'Invalid date',
                invalidDatetime: 'Invalid datetime',
                unsupportedField: 'Unsupported field',
                true: 'True',
                false: 'False',
                numberOfRows: 'Number of rows',
            },
        },
        tasks: {
            name: 'Task |||| Tasks',
            fields: { ...fields },
            kinds: {
                'dbt+transform': 'Transform',
                'nefertem+infer': 'Infer',
                'nefertem+metric': 'Metric',
                'nefertem+profile': 'Profile',
                'nefertem+validate': 'Validate',
                'container+deploy': 'Deploy',
                'container+job': 'Job',
                'container+serve': 'Serve',
            },
        },
        common: {
            emptySpec: 'Select the kind to view the specification',
            version: {
                title: 'Versions',
                version: 'Version',
                created: 'Date of creation',
            },
        },
        list: {
            expandable: {
                version: 'Version',
                created: 'Date of creation',
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
            },
            dataitems: {
                title: 'Data items',
            },
            artifacts: {
                title: 'Artifacts',
            },
        },
        functions: {
            show: {
                title: 'Function #%{name}',
                subtitle: '%{kind} function',
            },
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
    },
    validation: {
        minValue: 'Value must be greater that or equal to %{min}',
        noSpace: 'Value must contain no space',
        wrongChar:
            'The name must consist exclusively of numbers, lowercase letters, and hyphens, without the possibility of placing the latter at the beginning or end of the word',
    },
};

export default messages;
