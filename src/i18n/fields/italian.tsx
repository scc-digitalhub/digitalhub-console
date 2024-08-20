export const fields = {
    id: 'Id',
    kind: 'Tipo',
    name: {
        title: 'Nome',
        description: '',
    },
    key: {
        title: 'Chiave',
        description: '',
    },
    project: { title: 'Progetto', description: 'Identificatore del progetto' },
    args: {
        item: {
            title: 'Oggetto',
            description: '',
        },
    },
    container: {
        args: {
            title: 'Argomenti di Esecuzione del Container',
            description: '',
        },
        instructions: {
            title: 'Istruzioni di Esecuzione',
            description:
                'Istruzioni eseguite come RUN durante la fase di build',
            item: {
                title: 'Run',
                description: '',
            },
        },
        baseImage: {
            title: 'Immagine di Base',
            description: 'Immagine usata come base per costruire i task',
        },
        command: {
            title: 'Comando di Esecuzione del Container',
            description: "Sovrascrive il comando eseguito nell'immagine",
        },
        image: {
            title: 'Immagine',
            description: 'Immagine usata per i container dei task',
        },
        tag: {
            title: 'Tag',
            description: '',
        },
    },
    execArgs: {
        title: 'Argomenti di Esecuzione',
        description: "Argomenti passati al comando per l'esecuzione",
    },
    schedule: {
        title: 'Schedule',
        description: 'Definizione di schedule come crontab',
    },
    backoffLimit: {
        title: 'Limite di Backoff',
        description: 'Limite di backoff per il completamento dei job',
    },
    requests: {
        title: 'Richieste',
        description: '',
    },
    limits: {
        title: 'Limiti',
        description: '',
    },
    base64: {
        title: 'Base 64',
        description: 'Codice sorgente codificato in base64',
    },
    mountPath: {
        title: 'Mount Path',
        description: '',
    },
    volumeType: {
        title: 'Tipo di Volume',
        description: '',
    },
    value: {
        title: 'Valore',
        description: '',
    },
    protocol: {
        title: 'Protocollo',
        description: '',
    },
    source: {
        title: 'Sorgente',
        description: '',
    },
    replicas: {
        title: 'Repliche',
        description: 'Numero di repliche per il task attuale',
    },
    contextSources: {
        title: 'Sorgenti di Contesto',
        description: '',
        item: {
            title: 'Elemento',
            description: '',
        },
    },
    secrets: {
        title: 'Segreti',
        description: '',
        item: {
            title: 'Chiave',
            description: '',
        },
    },
    instructions: {
        title: 'Istruzioni',
        description: '',
        item: {
            title: 'Titolo',
            description: '',
        },
    },
    destination: {
        title: 'Destinazione',
        description: '',
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
            title: '',
            description: '',
        },
        title: 'Risorse per Esecuzione',
        description: 'Definire le risorse necessarie per eseguire task in K8s',
    },
    spec: {
        title: 'Spec',
        description: '',
    },
    status: {
        state: 'Stato',
        files: 'File',
    },
    inputs: {
        title: 'Input',
        description: 'Elementi di input',
        item: {
            title: '',
            description: '',
        },
    },
    outputs: {
        title: 'Output',
        description: 'Elementi di output',
        item: {
            title: '',
            description: '',
        },
    },
    code: 'Codice sorgente',
    logs: 'Log',
    base: 'Base',
    summary: 'Riepilogo',
    description: {
        title: 'Descrizione',
        description: '',
    },
    labels: {
        title: 'Etichette',
        description: '',
    },
    updated: {
        title: 'Aggiornamento',
        description: "Data dell'ultimo aggiornamento",
    },
    embedded: {
        title: 'Integrato',
        description: '',
    },
    openMetadata: {
        title: 'Open Metadata',
        description: '',
    },
    publish: {
        title: 'Pubblicare',
        description: '',
    },
    createdBy: {
        title: 'Creato Da',
        description: "Username dell'autore della risorsa",
    },
    updatedBy: {
        title: 'Aggiornato Da',
        description:
            "Username dell'autore che ha modificato per ultimo la risorsa",
    },
    created: {
        title: 'Creazione',
        description: 'Data di creazione',
    },
    version: {
        title: 'Versione',
        description: 'Nome o identificativo della versione',
    },
    path: {
        title: 'Percorso',
        description: 'URI che punta al contenuto',
    },
    srcPath: {
        title: 'Percorso della Sorgente',
        description: 'URI che punta alla sorgente',
    },
    algorithm: {
        title: 'Algoritmo',
        description: '',
    },
    framework: {
        title: 'Framework',
        description: '',
    },
    parameters: {
        title: 'Parametri',
        description: '',
        item: {
            title: 'Elemento',
            description: '',
        },
    },
    baseModel: {
        title: 'Modello di Base',
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
        description: 'Oggetto di constraint',
        item: {
            title: 'Elemento',
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
            description:
                'Elenco di requisiti (formattati come requirements.txt)',
        },
        version: {
            title: 'Versione di Python',
            description: 'Versione maggiore del linguaggio',
        },
    },
    errorReport: {
        title: 'Rapporto sugli Errori',
        description: '',
    },
    sourceCode: {
        title: 'Codice Sorgente',
        description: 'Codice sorgente',
        source: {
            title: 'Riferimento',
            description: 'Riferimento al codice sorgente (percorso o URI)',
        },
        lang: {
            title: 'Linguaggio',
            description: 'Linguaggio usato per il codice sorgente',
        },
        handler: {
            title: 'Funzione Handler',
            description: 'Nome della funzione handler',
        },
        init_function: {
            title: 'Funzione di Inizializzazione',
            description: 'Nome della funzione di inizializzazione (opzionale)',
        },
        base64: {
            title: 'Codice',
            description: 'Codice',
        },
    },
    requirements: {
        item: {
            title: 'Componente',
            description: '',
        },
    },
    priorityClass: {
        title: 'Classe di Priorità',
        description: "Priorità dei pod impiegati per l'esecuzione di task",
    },
    runtimeClass: {
        title: 'Classe di Runtime',
        description: 'Nome della classe di runtime per i pod',
    },
    profile: {
        title: 'Profilo della Run',
        description:
            'Seleziona un profilo per sfruttare un template preconfigurato',
    },
    function: {
        title: 'Funzione',
        description: 'Riferimento statico alla funzione',
    },
    workflow: {
        title: 'Workflow',
        description: 'Riferimento statico al workflow',
    },
    numWorker: {
        title: 'Numero di Worker',
        description: '',
    },
    parallel: {
        title: 'Eseguire in Parallelo',
        description: '',
    },
    commands: {
        title: 'Comandi',
        description: '',
    },
    forceBuild: {
        title: 'Forzare Build',
        description: '',
    },
    targetImage: {
        title: 'Immagine Target',
        description: '',
    },
    info: {
        tab: 'Info',
        empty: 'Nessuna informazione disponibile',
    },
    datagrid: {
        key: 'Nome',
        value: 'Valore',
    },
    servicePorts: {
        title: 'Porte del Servizio',
        description: 'Definisci la mappatura delle porte per il servizio',
        item: {
            title: 'Porta',
            description: '',
        },
    },
    port: {
        title: 'Porta',
        description: 'Numero di porta per il traffico in ingresso al servizio',
    },
    targetPort: {
        title: 'Porta Target',
        description: 'Numero di porta per il traffico indirizzato al pod',
    },
    serviceType: {
        title: 'Tipo di Servizio',
        description:
            'Seleziona il tipo da usare nella definizione del servizio. Il default è `NodePort`',
    },
    task: {
        title: 'Task',
        description: '',
    },
    modelserve: {
        path: {
            title: 'URI del modello',
            description: '',
        },
        modelname: {
            title: 'Nome esposto del modello',
            description: '',
        },
        image: {
            title: 'Image del Inference Server',
            description: '',
        }
    },
    huggingface: {
        task: {
            title: 'HuggingFace Inference Task',
            description: '',   
        },
        backend: {
            title: 'Tipo di HuggingFace backend',
            description: '',   
        },
        tokenizerrevision: {
            title: 'Versione di HuggingFace Tokenizer',
            description: '',   
        },
        maxlength: {
            title: 'Lunghezza massima di Tokenizer Sequence',
            description: '',    
        },
        disablelowercase: {
            title: 'Disabilitare Tokenizer Lowercase',
            description: '',    
        },
        disablespecialtokens: {
            title: 'Disabilitare Special Tokens Encoding',
            description: '',    
        },
        dtype: {
            title: 'Tipo dati per Weights',
            description: '',    
        },
        trustremotecode: {
            title: 'Abilitare Custom Code per modelli e tokenizer',
            description: '',    
        },
        tensorinputnames: {
            title: 'Nomi input dei Tensor',
            description: '',
        },
        returntokentypeids: {
            title: 'Restituire Token Type ID',
            description: '',
        },
        returnprobabilities: {
            title: 'Restituire tuttel le probabilita`',
            description: '',
        },
        disablelogrequests: {
            title: 'Disabilitare le richieste di logging',
            description: '',
        },
        maxloglen: {
            title: 'Numero max dei prompt da loggare',
            description: '',
        },
    },
};
