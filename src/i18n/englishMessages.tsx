import englishMessages from 'ra-language-english';
import { fields } from './fields/english';
import { resources } from './resources/english';
import { specs } from './specs/english';

const messages = {
    ...englishMessages,
    fields,
    specs,
    resources,
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
            'Code invalid: impossible to show the source code. Conversion error',
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
            text: 'Define, build and execute functions to manage artifacts and data items.',
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
    csv: {
        buttonMain: {
            label: 'Import',
            tooltip: "Must be a file '.csv' or '.tsv'",
            emptyResource:
                "The 'resource' property was empty, have you defined {...props} for the import button?",
        },
        parsing: {
            collidingIds: 'Recocrds with conflicting IDs found',
            failedValidateRow:
                'The CSV file has not pass the validation requirements',
            invalidCsv: 'The document cannot be imported in "CSV" format',
        },
        dialogCommon: {
            subtitle:
                'import fo %{count} elements from file %{fileName} to "%{resource}"',
            conflictCount:
                'The resource "%{resource}" contains <strong>%{conflictingCount}</strong> records with conflicting IDs',
            buttons: {
                cancel: 'Cancel',
            },
        },
        dialogImport: {
            alertClose: '%{fname} imported',
            title: 'Importing in "%{resource}"',
            buttons: {
                replaceAllConflicts: 'Replace the lines',
                skipAllConflicts: 'Skip the lines',
                letmeDecide: 'Leave to decide for each records',
            },
        },
        dialogDecide: {
            title: 'Import into "%{resource}" of the element with ID %{id}',
            buttons: {
                replaceRow: 'Replace the row with ID %{id}',
                addAsNewRow: 'Add the line as new (no replace)',
                skipDontReplace: 'Skip this line (no replace)',
            },
        },
        loading: 'Loading...',
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
    upload: {
        upload_error: 'Error during upload of %{fileName} %{error}',
        file_too_big: 'File exceeds the maximum allowed size of 100 GiB',
    },
};

export default messages;
