import { version } from 'os';
import { title } from 'process';
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
    'container+build': {
        title: 'Container build task',
        description: 'Container build task definition', 
    },
    'container+deploy': {
        title: 'Container deploy task',
        description: 'Container deploy task definition',
    },
    'container+job': {
        title: 'Container job',
        description: 'Container job definition',
    },
    'container+serve': {
        title: 'Container serve',
        description: 'Container serve definition',
    },
    'container+run': {
        title: 'Container run',
        description: 'Container run definition', 
    },
    nefertem: {
        title: 'Nefertem',
        description: '',
    },
    'nefertem+infer': {
        title: 'Nefertem infer task',
        description: 'Nefertem infer task definition',
    },
    'nefertem+metric': {
        title: 'Nefertem metric task',
        description: 'Nefertem metric task definition',
    },
    'nefertem+profile': {
        title: 'Nefertem profile task',
        description: 'Nefertem profile task definition',    
    },
    'nefertem+validate': {
        title: 'Nefertem validate task',
        description: 'Nefertem validate task definition',
    },
    'nefertem+run': {
        title: 'Nefertem run',
        description: 'Nefertem run definition',
    },  
    python: {
        title: 'Python',
        description: '',
    },
    dbt: {
        title: 'DBT',
        description: '',
    },
    'dbt+transform': {
        title: 'DBT transform task',
        description: ' DBT transform task definition',    
    },
    'dbt+run': {
        title: 'DBT run',
        description: ' DBT run definition',    
    },
    mlrun: {
        title: 'MLRun',
        description: '',
    },
    'mlrun+build': {
        title: 'MLRun build task',
        description: 'MLRun build task definition',
    },
    'mlrun+job': {
        title: 'MLRun job',
        description: 'MLRun job definition',
    },
    'mlrun+run': {
        title: 'MLRun run',
        description: 'MLRun run definition',    
    },
    table: {
        title: 'Table',
        description: '',
    },
    kfp: {
        title: 'Kubeflow Pipeline',
        description: '',
    },
    'kfp+pipeline': {    
        title: 'Kubeflow Pipeline task',
        description: 'Kubeflow Pipeline task definition',   
    },
    'kfp+run': {
        title: 'Kubeflow Pipeline run',
        description: 'Kubeflow Pipeline run definition',   
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
        baseImage: { title: 'Container base Image', description: '' },
        command: { title: 'Container command', description: '' },
        image: { title: 'Container image', description: '' },
        tag: {
            title: 'Tag',
            description: '',
        },
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
        title: 'Mount Path',
        description: 'Mount Path definition ',
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
        description: 'Framework definition',
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
        priorityClass: 'K8S Priority Class',
        runtimeClass: 'K8S Runtime Class',
        python_version: 'Python version',
        handler: 'Handler',
        schedule: 'Schedule',
        workflow: 'Workflow definition',
        framework: 'Framework',
        parallel: 'Parallel execution',
        num_worker: 'Number of workers',
        commands: 'Commands',
        force_build: 'Force build',
        target_image: 'Target image',
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
        item: {
            title: 'Item',
            description: '',
        },
    },
    constraints: {
        title: 'Constraints',
        description: 'Constraints object',
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
        version: {
            title: 'Python version',
            description: '',
        }
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
    requirements: {
        item: {
            title: 'Item',
            description: '',
        },
    },
    priorityClass: {
        title: 'Priority Class',
        description: '',
    },
    runtimeClass: {
        title: 'Runtime Class',
        description: '',
    },
    function: {
        title: 'Function',
        description: '',
    },
    workflow: {
        title: 'Workflow',
        description: '',
    },
    numWorker: {
        title: 'Number of workers',
        description: '',
    },
    parallel: {
        title: 'Parallel execution',
        description: '',
    },
    commands: {
        title: 'Commands',
        description: '',
    },
    forceBuild: {
        title: 'Force build',
        description: '',
    },
    targetImage: {
        title: 'Target image',
        description: '',
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
            invalidCsv:
                'The document cannot be imported in "CSV" format',
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
    upload_error: 'Error during upload of %{fileName} %{error}',
};

export default messages;
