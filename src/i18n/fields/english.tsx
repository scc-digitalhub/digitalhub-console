export const fields = {
    id: 'Id',
    kind: 'Kind',
    name: {
        title: 'Name',
        description: '',
    },
    key: {
        title: 'Key',
        description: '',
    },
    project: { title: 'Project', description: 'Identifier for the project' },
    args: {
        item: {
            title: 'Argument',
            description: '',
        },
    },
    container: {
        args: { title: 'Container Args', description: '' },
        instructions: {
            title: 'Build Instructions',
            description: 'Instructions executed as RUN during build stage',
            item: {
                title: 'Run',
                description: '',
            },
        },
        baseImage: {
            title: 'Base Image',
            description: 'Image used as base for building tasks',
        },
        command: {
            title: 'Command',
            description: 'Override command executed in image',
        },
        image: {
            title: 'Image',
            description: 'Container image used for tasks',
        },
        tag: {
            title: 'Tag',
            description: '',
        },
    },
    execArgs: {
        title: 'Execution Args',
        description: 'Arguments passed to command for execution',
    },
    schedule: {
        title: 'Schedule',
        description: 'Schedule definition as crontab',
    },
    backoffLimit: {
        title: 'Backoff Limit',
        description: 'Backoff limit for job completion',
    },
    requests: {
        title: 'Requests',
        description: '',
    },
    limits: {
        title: 'Limits',
        description: '',
    },
    base64: {
        title: 'Base 64',
        description: 'Source code encoded as base64',
    },
    mountPath: {
        title: 'Mount Path',
        description: '',
    },
    volumeType: {
        title: 'Volume Type',
        description: '',
    },
    value: {
        title: 'Value',
        description: '',
    },
    protocol: {
        title: 'Protocol',
        description: '',
    },
    source: {
        title: 'Source',
        description: '',
    },
    replicas: {
        title: 'Replicas',
        description: 'Number of replicas for the current task',
    },
    contextSources: {
        title: 'Context Sources',
        description: '',
        item: {
            title: 'Item',
            description: '',
        },
    },
    secrets: {
        title: 'Secrets',
        description: '',
        item: {
            title: 'Key',
            description: '',
        },
    },
    instructions: {
        title: 'Instructions',
        description: '',
        item: {
            title: 'Title',
            description: '',
        },
    },
    destination: {
        title: 'Destination',
        description: '',
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
            title: '',
            description: '',
        },
        title: 'Compute Resources',
        description: 'Define resources required for task execution in K8s',
    },
    spec: {
        title: 'Spec',
        description: '',
    },
    status: {
        state: 'Status',
        files: 'Files',
    },
    inputs: {
        title: 'Inputs',
        description: 'Input elements',
        item: {
            title: '',
            description: '',
        },
    },
    outputs: {
        title: 'Outputs',
        description: 'Output elements',
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
        description: 'Date of the last update',
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
        title: 'Created By',
        description: 'Username for the resource author',
    },
    updatedBy: {
        title: 'Updated By',
        description: 'Username of the last user modifying the resource',
    },
    created: {
        title: 'Created',
        description: 'Date of creation',
    },
    version: {
        title: 'Version',
        description: 'Name or identifier for the version',
    },
    path: {
        title: 'Path',
        description: 'URI pointing to the content',
    },
    srcPath: {
        title: 'Source Path',
        description: 'URI pointing to the source',
    },
    algorithm: {
        title: 'Algorithm',
        description: '',
    },
    framework: {
        title: 'Framework',
        description: '',
    },
    parameters: {
        title: 'Parameters',
        description: '',
        item: {
            title: 'Item',
            description: '',
        },
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
            title: 'Python Requirements',
            description: 'List of requirements (formatted as requirements.txt)',
        },
        version: {
            title: 'Python Version',
            description: 'Major version of language',
        },
    },
    errorReport: {
        title: 'Error Report',
        description: '',
    },
    sourceCode: {
        title: 'Source Code',
        description: 'Source code',
        source: {
            title: 'Source Ref',
            description: 'Reference to source (path or URI)',
        },
        lang: {
            title: 'Source Language',
            description: 'Language used for source code',
        },
        handler: {
            title: 'Handler Function',
            description: 'Name of the handler function',
        },
        init_function: {
            title: 'Init Function',
            description: 'Name of the initializing function (optional)',
        },
        base64: {
            title: 'Source Code',
            description: 'Source code',
        },
    },
    requirements: {
        item: {
            title: 'Package',
            description: '',
        },
    },
    priorityClass: {
        title: 'Priority Class',
        description: 'Priority for pods deployed for task execution',
    },
    runtimeClass: {
        title: 'Runtime Class',
        description: 'Runtime class name for pods',
    },
    profile: {
        title: 'Run Profile',
        description: 'Select a profile to leverage a pre-configured template',
    },
    function: {
        title: 'Function',
        description: 'Static reference to function',
    },
    workflow: {
        title: 'Workflow',
        description: 'Static reference to workflow',
    },
    numWorker: {
        title: 'Number of Workers',
        description: '',
    },
    parallel: {
        title: 'Parallel Execution',
        description: '',
    },
    commands: {
        title: 'Commands',
        description: '',
    },
    forceBuild: {
        title: 'Force Build',
        description: '',
    },
    targetImage: {
        title: 'Target Image',
        description: '',
    },
    info: {
        tab: 'Info',
        empty: 'No info available',
    },
    files: {
        tab: 'Files',
        empty: 'No files available',
    },
    datagrid: {
        key: 'Name',
        value: 'Value',
    },
    servicePorts: {
        title: 'Service Ports',
        description: 'Define ports mapping for the service',
        item: {
            title: 'Port',
            description: '',
        },
    },
    port: {
        title: 'Port',
        description: 'Port number for incoming traffic to service',
    },
    targetPort: {
        title: 'Target Port',
        description: 'Port number for traffic routed to pod',
    },
    serviceType: {
        title: 'Service Type',
        description:
            'Select the type used for service definition. Defaults to `NodePort`',
    },
    task: {
        title: 'Task',
        description: '',
    },
    modelserve: {
        path: {
            title: 'Model URI Path',
            description: '',
        },
        modelname: {
            title: 'Exposed Model Name',
            description: '',
        },
        image: {
            title: 'Inference Server Image',
            description: '',
        }
    },
    huggingface: {
        task: {
            title: 'HuggingFace Inference Task',
            description: '',   
        },
        backend: {
            title: 'HuggingFace Backend Type',
            description: '',   
        },
        tokenizerrevision: {
            title: 'HuggingFace Tokenizer Revision',
            description: '',   
        },
        maxlength: {
            title: 'Tokenizer Max Sequence Length',
            description: '',    
        },
        disablelowercase: {
            title: 'Disable Tokenizer Lowercase',
            description: '',    
        },
        disablespecialtokens: {
            title: 'Disable Special Tokens Encoding',
            description: '',    
        },
        dtype: {
            title: 'Weights Data Type',
            description: '',    
        },
        trustremotecode: {
            title: 'Allow Custom Code for Models and Tokenizers',
            description: '',    
        },
        tensorinputnames: {
            title: 'Tensor Input Names',
            description: '',
        },
        returntokentypeids: {
            title: 'Return Token Type IDs',
            description: '',
        },
        returnprobabilities: {
            title: 'Return All Probabilities',
            description: '',
        },
        disablelogrequests: {
            title: 'Disable Logging Requests',
            description: '',
        },
        maxloglen: {
            title: 'Max Num of Prompt to Log',
            description: '',
        },
        modelid: {
            title: 'HuggingFace Model ID',
            description: '',
        },
        modelrevision: {
            title: 'HuggingFace Model Revision',
            description: '',
        }
    },
    mlflow: {
        flavor: {
            title: 'Model Flavor',
            description: '',
        },
        inputdatasets: {
            title: 'Input Datasets',
            description: '',
            item: {
                title: 'Input Dataset',
                description: '',
            },
        },
        inputdatasetdigest: {
            title: 'Input Dataset Digest',
            description: '',
        },
        inputdatasetname: {
            title: 'Input Dataset Name',
            description: '',
        },
        inputdatasetprofile: {
            title: 'Input Dataset Profile',
            description: '',
        },
        inputdatasetschema: {
            title: 'Input Dataset Schema',
            description: '',   
        },
        inputdatasetsource: {
            title: 'Input Dataset Source',
            description: '',
        },
        inputdatasetsourcetype: {
            title: 'Input Dataset Source Type',
            description: '',
        },
        digest: {
            title: 'Dataset Digest',
            description: '',
        },
        modelconfig: {
            title: 'Model Configuration',
            description: '',
        },
        signature: {    
            title: 'Model Signature',
            description: '',
        },
        signatureinputs: {
            title: 'Model Signature Inputs',
            description: '',
        },
        signatureoutputs: {
            title: 'Model Signature Outputs',
            description: '',
        },  
        signatureparams: {
            title: 'Model Signature Parameters',
            description: '',
        },  
    },
    inputDatasets: {
        item: {
            title: 'Input Dataset',
            description: '',
        },
    },
    preview: 'File Preview'
};
