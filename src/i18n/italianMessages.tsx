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
    },
    status: {
        state: 'Stato',
    },
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
            fields: { ...fields },
            tab: {
                summary: 'Riepilogo',
                test: 'test',
            },
        },
        secret: { title: 'Segreti', showData: 'Mostra i dati' },
        runs: {
            name: 'Esecuzione |||| Esecuzioni',
            fields: {
                ...fields,
            },
        },
        artifacts: {
            name: 'Artefatto |||| Artefatti',
            fields: { ...fields },
        },
        dataitems: {
            name: 'Dato |||| Dati',
            fields: { ...fields },
            tab: {
                summary: 'Riepilogo',
                schema: 'Schema',
                preview: 'Anteprima',
            },
            summary: {
                title: 'Dettagli del data item',
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
