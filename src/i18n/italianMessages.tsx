import italianMessages from '@dslab/ra-language-italian';
import { importLibraryItalianMessages } from './importLibraryItalianMessages';

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
    },
    status: {
        state: 'Stato',
    },
    code: 'Codice sorgente',
    base: 'Base',
    summary: 'Riepilogo',
};

const messages = {
    ...italianMessages,
    ...importLibraryItalianMessages,
    login: {
        basicMessage: 'Autenticarsi per continuare',
        title: 'Resource Manager',
        message: 'Accedi con AAC',
    },
    bar:{
        backProjects:'Torna ai progetti',
    },
    menu: {
        projects: 'Progetti',
        configuration: 'Configurazione',
    },
    bar:{
        backProjects:'Torna ai progetti',
    },
    fields: fields,
    resources: {
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
            showData: 'Mostra i dati',
            name: 'Segreto |||| Segreti',
            value: 'Valore',
        },
        runs: {
            name: 'Esecuzione |||| Esecuzioni',
            fields: {
                ...fields,
            },
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
};

export default messages;
