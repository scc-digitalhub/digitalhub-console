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
    nefertem:{
        title:"Nefertem",
        description:""
    },
    python:{
        title:"Python",
        description:""
    },
    dbt:{
        title:"Dbt",
        description:""
    },
    mlrun:{
        title:"mlrun",
        description:""
    },
    table: {
        title:"Table",
        description:""
    },
}
const fields = {
    id: 'Id',
    name: 'Nome',
    kind: 'Tipo',
    key: 'Chiave',
    project: 'Progetto',
    metadata: {
        created: 'Creazione',
        updated: 'Aggiornamento',
        name: 'Nome',
        description: 'Descrizione',
        project: 'Progetto',
        version: 'Versione',
        labels: 'Etichette',
    },
    spec: {
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
    },
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
        title:"Publish",
        description:"" 
    },
    createdBy:{
        title:"Created by",
        description:"" 
    },
    updatedBy:{
        title:"Updated by",
        description:"" 
    },
    created:{
        title:"Created",
        description:"" 
    },
    
    version:{
        title:"Version",
        description:"" 
    },
    path:{
        title:"Path",
        description:"" 
    },
    srcPath:{
        title:"Src path",
        description:"" 
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
        title: 'Base Model',
        description: '',
    },
    info: 'Info',
    datagrid:{
        key: 'Nome',
        value: 'Valore'
    }
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
            list: 'List and search workflows',
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
    upload_error: " Errore durante l'upload del file %{fileName}.  %{error} ",
};

export default messages;
