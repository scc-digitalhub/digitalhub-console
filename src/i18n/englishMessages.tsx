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
    status: {
        state: 'Status',
    },
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
            list: 'List and search functions',
            fields: { ...fields },
            tab: {
                summary: 'Recap',
                test: 'test',
            },
        },
        runs: {
            name: 'Run |||| Runs',
            fields: {
                ...fields,
            },
        },
        artifacts: {
            name: 'Artifact |||| Artifacts',
            fields: { ...fields },
        },
        dataitems: {
            name: 'Data item |||| Data items',
            fields: { ...fields },
            tab: {
                summary: 'Summary',
                schema: 'Schema',
                preview: 'Preview',
            },
            summary: {
                title: 'Data item details',
                spec: {
                    title: 'Spec',
                    key: 'Key',
                    path: 'Path',
                },
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
            },
        },
        common: {
            emptySpec: 'Select the Kind for spec modification',
            version: {
                title: 'Versions',
                version: 'Version',
                created: 'Creation date',
            },
        },
        list: {
            expandable: {
                version: 'Version',
                created: 'Creation Date',
            },
        },
    },
    pages: {
        dashboard: {
            title: 'Dashboard',
            description: 'Project overview',
            text: 'Define, build and execute functions to manage artifacts and dataitems.',
            functions: {
                title: 'Functions and code',
                description: 'Define and manage functions',
            },
            dataitems: {
                title: 'Data items',
                description: 'Review and manage data items',
            },
            artifacts: {
                title: 'Artifacts',
                description: 'Review and manage artifacts',
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
        newVersion: ' New version',
    },
    validation: {
        minValue: 'Value must be greater that or equal to %{min}',
        noSpace: 'Value must contain no space',
        wrongChar:
            'The name must consist exclusively of numbers, lowercase letters, and hyphens, without the possibility of placing the latter at the beginning or end of the word',
    },
};

export default messages;
