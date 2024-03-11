import italianMessages from '@dslab/ra-language-italian';
import { importLibraryItalianMessages } from './importLibraryItalianMessages';

const fields = {
    id: 'Id',
    name: 'Nome',
    kind: 'Tipo',
    key: 'Chiave',
    project: 'Progetto',
    metadata: {
        created: 'Data di creazione',
        updated: 'Data di aggiornamento',
        name: 'Nome',
        description: 'Descrizione',
        project: 'Progetto',
        version: 'Versione',
        labels: 'Labels',
    },
    status: {
        state: 'Stato',
    },
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
    menu: {
        projects: 'Progetti',
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
        secret: {
            title: 'Segreti',
            showData: 'Mostra i dati',
            name: 'Nome',
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
                summary: 'Riepilogo',
                schema: 'Schema',
                preview: 'Anteprima',
            },
            summary: {
                spec: {
                    title: 'Spec',
                    key: 'Key',
                    path: 'Path',
                },
            },
            schema: {
                title: 'Schema',
                name: 'Nome',
                type: 'Tipo',
            },
            preview: {
                title: 'Anteprima',
                invalidValue: 'Valore invalido',
                invalidDate: 'Data non valida',
                invalidDatetime: 'Datetime non valido',
                unsupportedField: 'Campo non supportato',
                true: 'Vero',
                false: 'Falso',
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
            emptySpec: 'Selezionare Kind per visualizzare le specifiche',
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
        name: 'Nome',
        kind: 'Tipo',
    },
    buttons: {
        cancel: 'Annulla',
        newVersion: ' Nuova versione',
    },
    validation: {
        minValue: 'Il valore deve esere maggiore o uguale a %{min}',
        noSpace: 'Il valore non deve contenere spazi',
        wrongChar:
            "Il nome deve contenere esclusivamente numeri, lettere minuscole e trattini, senza la possibilità di posizionare questi ultimi all'inizio o alla fine della parola",
    },
};

export default messages;
