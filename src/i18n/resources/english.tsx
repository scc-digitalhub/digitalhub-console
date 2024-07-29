import { fields } from '../fields/english';

export const resources = {
    projects: {
        name: 'Project |||| Projects',
        fields,
    },
    functions: {
        name: 'Function |||| Functions',
        list: 'List and search functions',
        fields,
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
        fields,
        empty: 'No runs yet',
        create: 'Create a new run',
        labelName: 'Name',
    },
    artifacts: {
        name: 'Artifact |||| Artifacts',
        list: 'List and search artifacts',
        fields: {
            ...fields,
            name: 'Name',
        },
    },
    dataitems: {
        name: 'Data item |||| Data items',
        list: 'List and search data items',
        fields,
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
        fields,
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
        fields,
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
        reset: {
            title: 'Change kind',
            content:
                'Are you sure you want to change kind? Changes made will be discarded',
        },
        version: {
            title: 'Versions',
            version: 'Version',
            created: 'Creation date',
        },
    },
};
