import italianMessages from '@dslab/ra-language-italian';

const specs = {
    metadata: {
        base: {
            title:"Metadata",
            description:""
        },
        embedded: {
            title:"Embedded",
            description:""
        },
        versioning: {
            title:"Versioning",
            description:""
        },
        openmetadata: {
            title:"Openmetadata",
            description:""
        },
        audit: {
            title:"Audit",
            description:""
        }
    },
    artifact: {
        title:"Metadata Artifact",
        description:""
    },
    dataitem: {
        title:"Metadata Dataitem",
        description:""
    },
    model:{
        title:"Metadata Model",
        description:""
    },
    container:{
        title:"Container",
        description:""
    },
    'container+build': {
        title: 'Operazione di build del container',
        description: "Definizione dell'operazione di build del container", 
    },
    'container+deploy': {
        title: 'Operazione di deploy del container',
        description: 'Definizione dell\'operazione di deploy del container',
    },
    'container+job': {
        title: 'Container job',
        description: 'Definizione del container job',
    },
    'container+serve': {
        title: 'Container serve',
        description: 'Definizione del container serve',
    },
    'container+run': {
        title: 'Esecuzione dell\'operazione su container',
        description: 'Definizione dell\'esecuzione dell\'operazione su container', 
    },
    nefertem: {
        title: 'Nefertem',
        description: '',
    },
    'nefertem+infer': {
        title: 'Operazione di infer Nefertem',
        description: 'Definizione dell\'operazione di infer Nefertem',
    },
    'nefertem+metric': {
        title: 'Operazione di metriche Nefertem',
        description: 'Definizione dell\'operazione di metriche Nefertem',
    },
    'nefertem+profile': {
        title: 'Operazione di profilazione Nefertem',
        description: 'Definizione dell\'operazione di profilazione Nefertem',    
    },
    'nefertem+validate': {
        title: 'Operazione di validazione Nefertem',
        description: 'Definizione dell\'operazione di validazione Nefertem',
    },
    'nefertem+run': {
        title: 'Esecuzione di operazione Nefertem',
        description: 'Definizione dell\'esecuzione di operazione Nefertem',
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
        title: 'Operazione di transformazione DBT',
        description: 'Definizione dell\'operazione di transformazione DBT',    
    },
    'dbt+run': {
        title: 'Esecuzione DBT',
        description: 'Definizione dell\'esecuzione DBT',    
    },
    mlrun: {
        title: 'MLRun',
        description: '',
    },
    'mlrun+build': {
        title: 'Operazione di build dell\'immagine MLRun',
        description: 'Definizione dell\'operazione di build dell\'immagine MLRun',
    },
    'mlrun+job': {
        title: 'Job di MLRun',
        description: 'Definizione del job di MLRun',
    },
    'mlrun+run': {
        title: 'Esecuzione MLRun',
        description: 'Definizione dell\'esecuzione MLRun',    
    },
    table: {
        title:"Table",
        description:""
    },
    kfp: {
        title: 'Kubeflow Pipeline',
        description: '',
    },
    'kfp+pipeline': {    
        title: 'Operazione di Kubeflow Pipeline',
        description: 'Definizione dell\'operazione di Kubeflow Pipeline',   
    },
    'kfp+run': {
        title: 'Esecuzione di Kubeflow Pipeline',
        description: 'Definizione dell\'esecuzione di Kubeflow Pipeline',   
    },
};
const fields = {
    id: 'Id',
    // name: 'Name',
    kind: 'Tipo',
    // key: 'Key',
    project: 'Progetto',
    container: {
        args: { title: 'Argomenti di esecuzione del Container', description: '' },
        instructions: {
            description: 'Istruzioni di esecuzione',
        },
        baseImage: { title: 'Immagine di base', description: '' },
        command: { title: 'Commandi di esecuzione del Container', description: '' },
        image: { title: 'Immagine del Container', description: '' },
        tag: {
            title: 'Tag',
            description: '',
        },
    },
    execArgs: {
        title: 'Argomenti di esecuzione',
        description: 'Argomenti di esecuzione',
    },
    schedule: {
        title: 'Schedule',
        description: 'Definizione di schedule',
    },
    backoffLimit: {
        title: 'Backoff Limit',
        description: 'Definizione di Backoff Limit',
    },
    requests: {
        title: 'Request',
        description: 'Definizione di Request',
    },
    limits: {
        title: 'Limiti',
        description: 'Definizioni dei Limiti',
    },
    base64: {
        title: 'Base 64',
        description: 'Definizione Base 64',
    },
    mountPath: {
        title: 'Mount Path',
        description: 'Definizione Mount Path ',
    },
    volumeType: {
        title: 'Tipo Volume',
        description: 'Definizione di Tipo Volume',
    },
    name: {
        title: 'Nome',
        description: '',
    },
    key: {
        title: 'Chiave',
        description: '',
    },
    value: {
        title: 'Valore',
        description: '',
    },
    protocol: {
        title: 'Protocollo',
        description: 'Definizione di Protocollo',
    },
    source: {
        title: 'Sorgente',
        description: 'Definizione di Sorgente',
    },
    replicas: {
        title: 'Repliche',
        description: 'Definizione di Repliche',
    },
    contextSources: {
        title: 'Sorgenti di contesto',
        description: 'Definizione di Sorgenti di contesto',
        item: {
            title: 'Elemento',
            description: '',
        },
    },
    secrets: {
        title: 'Segreti',
        description: 'Definizione di Segreti',
        item: {
            title: 'Elemento',
            description: '',
        },
    },
    instructions: {
        title: 'Istruzioni',
        description: 'Definizione di Istruzioni',
        item: {
            title: 'Titolo',
            description: '',
        },
    },
    destination: {
        title: 'Destinazione',
        description: 'Definizione di Destinazione',
    },
    metadata: {
        created: 'Creazione',
        updated: 'Aggiornamento',
        name: 'Nome',
        description: 'Descrizione',
        project: 'Progetto',
        version: 'Versione',
        labels: 'Etichette',
    },
    k8s: {
        envs: {
            description: 'Definizione di ambiente',
        },
        description: 'Definizione risorse K8S',
    },
    framework: {
        description: 'Definizione di Framework',
    },
    spec: {
        title: 'Spec',
        description: 'Descrizione della Spec',
        path: 'Percorso',
        src_path: 'Percorso sorgente',
        compiled_code: 'Codice compilato',
        raw_code: 'Codice sorgente',
        schema: 'Schema',
        constraints: 'Vincoli',
        error_report: 'Report di errore',
        metrics: 'Metriche',
        args: 'Argomenti',
        base_image: 'Immagine di base',
        command: 'Comando',
        image: 'Immagine',
        base64: 'Base64',
        code: 'Codice',
        source: 'Sorgente',
        function: 'Funzione',
        k8s: 'Risorse K8S',
        service_ports: 'Porte',
        service_type: 'Tipo servizio',
        priorityClass: 'K8S Priority Class',
        runtimeClass: 'K8S Runtime Class',
        python_version: 'Versione Python',
        handler: 'Handler',
        schedule: 'Schedule',
        workflow: 'Definizione di Workflow',
        framework: 'Framework',
        parallel: 'Eseguire in parallelo',
        num_worker: 'Numero di worker',
        commands: 'Commandi',
        force_build: 'Forzare build',
        target_image: 'Immagine Target',    },
    status: {
        state: 'Stato',
        files: 'File',
    },
    inputs: {
        title: 'Input',
        description: 'Input',
        item: {
            title: '',
            description: '',
        },
    },
    outputs: {
        title: 'Output',
        description: 'Output',
        item: {
            title: '',
            description: '',
        },
    },
    code: 'Codice sorgente',
    logs: 'Logs',
    base: 'Base',
    summary: 'Riepilogo',
    description: {
        title:"Description",
        description:""
    },
    labels: {
        title:"Labels",
        description:""
    },
    updated: {
        title:"Updated",
        description:""
    },
    embedded: {
        title:"Embedded",
        description:""
    },
    openMetadata:{
        title:"Open Metadata",
        description:"" 
    },
    publish:{
        title:"Pubblicare",
        description:"" 
    },
    createdBy:{
        title:"Creato dat",
        description:"" 
    },
    updatedBy:{
        title:"Aggiornato da",
        description:"" 
    },
    created:{
        title:"Creazione",
        description:"" 
    },
    
    version:{
        title:"Versione",
        description:"" 
    },
    path:{
        title:"Percorso",
        description:"" 
    },
    srcPath:{
        title:"Percorso sorgente",
        description:"" 
    },
    algorithm: {
        title: 'Algoritmo',
        description: '',
    },
    parameters: {
        title: 'Parametri',
        description: '',
    },
    baseModel: {
        title: 'Modello di base',
        description: '',
    },
    metrics: {
        title: 'Metriche',
        description: '',
        item: {
            title: 'Elemento',
            description: '',
        },
    },
    constraints: {
        title: 'Constraint',
        description: 'Oggetto di Constraint',
        item: {
            title: 'Elemento',
            description: '',
        },
    },
    fields: {
        title: 'Campi',
        description: '',
        item: {
            title: '',
            description: '',
        },
        
    },
    example: { title: 'Esempio', description: '' },
    format: { title: 'Formato', description: '' },
    title: { title: 'Titolo', description: '' },
    type: { title: 'Tipo', description: '' },
    schema: {
        title: 'Schema',
        description: '',
    },
    python: {
        requirements: {
            title: 'Requisiti Python',
            description: '',
        },
        version: {
            title: 'Version Python',
            description: '',
        }
    },
    errorReport: {
        title: 'Rapporto di errori',
        description: '',
    },
    sourceCode: {
        source: {
            title: 'Codice sorgente',
            description: '',
        },
        lang: {
            title: 'Linguaggio',
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
            title: 'Componente',
            description:''
        }
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
        title: 'Funzione',
        description: '',
    },
    workflow: {
        title: 'Workflow',
        description: '',
    },
    numWorker: {
        title: 'Numero di worker',
        description: '',
    },
    parallel: {
        title: 'Eseguire in parallelo',
        description: '',
    },
    commands: {
        title: 'Commandi',
        description: '',
    },
    forceBuild: {
        title: 'Forzare build',
        description: '',
    },
    targetImage: {
        title: 'Immagine target',
        description: '',
    },
    info: 'Info',
};

const messages = {
    ...italianMessages,
    login: {
        basicMessage: 'Autenticarsi per continuare',
        title: 'Resource Manager',
        message: 'Login',
    },
    bar: {
        backProjects: 'Torna ai progetti',
    },
    menu: {
        projects: 'Progetti',
        configuration: 'Configurazione',
    },
    exception: {
        code_invalid:
            'Codice non valido: impossibile visualizzare il codice sorgente. Errore di conversione',
    },
    fields: fields,
    specs: specs,
    resources: {
        projects: {
            name: 'Progetto |||| Progetti',
            fields: { ...fields },
        },
        functions: {
            name: 'Funzione |||| Funzioni',
            list: 'Lista delle funzioni con filtri di ricerca',
            fields: { ...fields },
            tab: {
                summary: 'Riepilogo',
                test: 'test',
            },
        },
        secrets: {
            title: 'Segreti',
            list: 'Lista dei segreti',
            showData: 'Mostra il segreto',
            name: 'Segreto |||| Segreti',
            value: 'Valore',
            labelName: 'Nome',
            path: 'Percorso',
            provider: 'Provider',
        },
        runs: {
            name: 'Esecuzione |||| Esecuzioni',
            list: 'Lista delle esecuzioni',
            fields: {
                ...fields,
            },
            empty: 'Nessuna esecuzione',
            create: 'Crea una nuova esecuzione',
            labelName: 'Nome',
        },
        artifacts: {
            name: 'Artefatto |||| Artefatti',
            list: 'Lista degli artefatti con filtri di ricerca',
            fields: { ...fields },
        },
        dataitems: {
            name: 'Dato |||| Dati',
            list: 'Lista dei dati con filtri di ricerca',
            fields: { ...fields },
            tab: {
                schema: 'Schema',
                preview: 'Anteprima',
            },
            schema: {
                title: 'Schema',
                name: 'Nome',
                type: 'Tipo',
            },
            preview: {
                title: 'Anteprima',
                true: 'Vero',
                false: 'Falso',
                numberOfRows: 'Numero di righe',
                notAvailable: 'Anteprima non disponibile',
            },
        },
        models: {
            name: 'Modello |||| Modelli',
            list: 'Lista dei modelli con filtri di ricerca',
            fields: { ...fields },
            tab: {
                metrics: 'Metriche',
                preview: 'Anteprima',
            },
            metrics: {
                title: 'Metriche',
                key: 'Nome',
                value: 'Valore',
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
                requestMinorLimits: 'Request deve essere minore di Limits',
            },
        },
        workflows: {
            name: 'Workflow |||| Workflow',
            list: 'Elenco e ricerca di workflow',
            fields: {
                ...fields,
                run_id: 'ID Esecuzione',
                action: 'Task',
                function: 'Funzione',
                start_time: 'Inizio',
                end_time: 'Fine',
            },
            tab: {
                summary: 'Recap',
                test: 'test',
                runs: 'Esecuzioni',
            },
            inputs: 'Parametri di Input',
            outputs: 'Parametri di Output',
        },
        logs: {
            name: 'Log |||| Log',
            list: 'Elenco log',
            fields: {
                ...fields,
                run_id: 'Run ID',
            },
        },
        common: {
            emptySpec: 'Seleziona il tipo per visualizzare le specifiche',
            labels: 'Etichette',
            version: {
                title: 'Versioni',
                version: 'Versione',
                created: 'Data di creazione',
            },
        },
        list: {
            expandable: {
                version: 'Versione',
                created: 'Data di creazione',
            },
        },
    },
    states: {
        completed: 'Completato',
        running: 'In esecuzione',
        error: 'Errore',
        built: 'Built',
        ready: 'Pronto',
        deleting: 'In cancellazione',
        deleted: 'Cancellato',
    },
    pages: {
        dashboard: {
            text: 'Definisci, crea ed esegui funzioni per gestire artefatti e data items.',
            created: 'Creazione',
            updated: 'Aggiornamento',
            recent: 'Recenti',
            states: {
                completed: 'Completati',
                running: 'In esecuzione',
                error: 'Errore',
            },
            functions: {
                title: 'Funzioni e codice',
                empty: 'Ancora nessuna funzione',
            },
            dataitems: {
                title: 'Dati',
                empty: 'Ancora nessun dato',
            },
            models: {
                title: 'Modelli',
                empty: 'Ancora nessun modello',
            },
            artifacts: {
                title: 'Artefatti',
                empty: 'Ancora nessun artefatto',
            },
            runs: {
                title: 'Compiti ed esecuzioni',
                empty: 'Ancora nessuna esecuzione',
            },
        },
        functions: {
            show: {
                title: 'Funzione #%{name}',
                subtitle: '%{kind} funzione',
            },
        },
        config: {
            title: 'Configurazione',
            text: 'Riguarda e aggiorna la configurazione del progetto e le impostazioni',
        },
    },
    pageTitle: {
        show: {
            title: '%{resource} #%{name}',
            subtitle: '%{kind} %{resource}',
        },
        create: {
            title: 'Crea %{resource}',
            subtitle: 'Compila il modulo per creare e salvare %{resource}',
        },
        edit: {
            title: 'Modifica %{resource} #%{name}',
            subtitle:
                'Modifica %{resource} per %{kind} aggiornando i metadati e le specifiche',
        },
        list: {
            title: '%{resource}',
        },
    },
    search: {
        name: 'Nome',
        kind: 'Tipo',
    },
    buttons: {
        cancel: 'Annulla',
        newVersion: 'Nuova versione',
        create: 'Create',
    },
    dashboard: {
        create: 'Per creare un nuovo progetto premi sul pulsante qui sotto',
    },
    validation: {
        minValue: 'Il valore deve esere maggiore o uguale a %{min}',
        noSpace: 'Il valore non deve contenere spazi',
        wrongChar:
            "Il nome deve contenere esclusivamente numeri, lettere minuscole e trattini, senza la possibilità di posizionare questi ultimi all'inizio o alla fine della parola",
        invalidKind: 'Tipo invalido',
        invalidValue: 'Valore invalido',
        invalidDate: 'Data non valida',
        invalidDatetime: 'Datetime non valido',
        unsupportedField: 'Campo non supportato',
    },
    csv: {
        buttonMain: {
            label: 'Importa',
            tooltip: "Deve essere un file '.csv' o '.tsv'",
            emptyResource:
                "La proprietà 'resource' era vuota, hai passato {...props} al pulsante di importazione?",
        },
        parsing: {
            collidingIds: 'Trovati record con ID che collidono',
            failedValidateRow:
                'Il CSV non ha superato i requisiti di validazione',
            invalidCsv:
                'Il documento non può essere analizzato come file "csv"',
        },
        dialogCommon: {
            subtitle:
                'Importazione di %{count} elementi dal file %{fileName} a "%{resource}"',
            conflictCount:
                'La risorsa "%{resource}" presenta <strong>%{conflictingCount}</strong> record con ID collidente/i',
            buttons: {
                cancel: 'Annulla',
            },
        },
        dialogImport: {
            alertClose: '%{fname} importato',
            title: 'Importazione in "%{resource}"',
            buttons: {
                replaceAllConflicts: 'Sostituisci le righe',
                skipAllConflicts: 'Salta queste righe',
                letmeDecide: 'Lascia che decida per ogni riga',
            },
        },
        dialogDecide: {
            title: 'Importazione in "%{resource}" dell\'elemento con ID %{id}',
            buttons: {
                replaceRow: 'Sostituisci la riga con ID %{id}',
                addAsNewRow: 'Aggiungi come nuova riga (non sostituire)',
                skipDontReplace: 'Salta questa riga (non sostituire)',
            },
        },
        loading: 'Caricamento...',
    },
    messages: {
        type_and_press_enter: 'Type and press ENTER to add',
        double_click_to_edit: 'Double click to edit',
    },
    k8s: {
        envs: {
            title: 'Ambienti',
            description: 'Definizione di ambienti',
        },
        node_selector: {
            title: 'Selettore di nodo',
            description: 'Definizione di Selettore di nodo',
        },
        secrets: {
            title: 'Segreti',
            description: 'Definizione di segreti',
        },
        volumes: {
            title: 'Volumi',
            description: 'Definizione di volumi',
        },
        resources: {
            title: 'Risorse',
            description: 'Definizione di risorse',
            cpu: {
                title: 'Cpu',
            },
            memory: {
                title: 'Memoria',
            },
            gpu: {
                title: 'Gpu',
            },
        },
    },
};

export default messages;
