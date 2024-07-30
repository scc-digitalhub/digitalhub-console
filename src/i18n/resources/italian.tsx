import { fields } from '../fields/italian';

export const resources = {
    projects: {
        name: 'Progetto |||| Progetti',
        fields: { ...fields, name: 'Nome', key: 'Chiave' },
    },
    functions: {
        name: 'Funzione |||| Funzioni',
        list: 'Elenco e ricerca di funzioni',
        fields: { ...fields, name: 'Nome', key: 'Chiave' },
        tab: {
            summary: 'Riepilogo',
            test: 'Test',
        },
    },
    secrets: {
        list: 'Elenco dei segreti',
        showData: 'Mostra il segreto',
        name: 'Segreto |||| Segreti',
        fields: {
            ...fields,
            name: 'Nome',
            key: 'Chiave',
            value: 'Valore',
            spec: {
                path: 'Percorso',
            },
        },
    },
    runs: {
        name: 'Esecuzione |||| Esecuzioni',
        list: 'Elenco e ricerca di esecuzioni',
        fields: { ...fields, name: 'Nome', key: 'Chiave' },
        empty: 'Nessuna esecuzione',
        create: 'Crea una nuova esecuzione',
        labelName: 'Nome',
    },
    artifacts: {
        name: 'Artefatto |||| Artefatti',
        list: 'Elenco e ricerca di artefatti',
        fields: { ...fields, name: 'Nome', key: 'Chiave' },
    },
    dataitems: {
        name: 'Dato |||| Dati',
        list: 'Elenco e ricerca di dati',
        fields: { ...fields, name: 'Nome', key: 'Chiave' },
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
        list: 'Elenco e ricerca di modelli',
        fields: { ...fields, name: 'Nome', key: 'Chiave' },
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
        fields: { ...fields, name: 'Nome', key: 'Chiave' },
        kinds: {
            transform: 'Trasforma',
            infer: 'Analizza',
            metric: 'Metriche',
            profile: 'Profila',
            validate: 'Valida',
            deploy: 'Deploy',
            job: 'Job',
            serve: 'Servi',
            pipeline: 'Pipeline',
            build: 'Build',
        },
        errors: {
            requestMinorLimits: 'Requests deve essere inferiore a Limits',
        },
    },
    workflows: {
        name: 'Workflow |||| Workflow',
        list: 'Elenco e ricerca di workflow',
        fields: {
            ...fields,
            name: 'Nome',
            key: 'Chiave',
            run_id: 'ID Esecuzione',
            action: 'Azione',
            function: 'Funzione',
            start_time: 'Inizio',
            end_time: 'Fine',
            lang: 'Linguaggio',
            source: 'Sorgente',
        },
        tab: {
            summary: 'Riepilogo',
            test: 'Test',
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
        reset: {
            title: 'Cambia tipologia',
            content:
                'Sei sicuro di voler cambiare tipologia? Le modifiche effettuate saranno annullate',
        },
        version: {
            title: 'Versioni',
            version: 'Versione',
            created: 'Data di creazione',
        },
    },
};
