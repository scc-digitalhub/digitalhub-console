import italianMessages from '@dslab/ra-language-italian';
import { fields } from './fields/italian';
import { resources } from './resources/italian';
import { specs } from './specs/italian';

const messages = {
    ...italianMessages,
    fields,
    specs,
    resources,
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
                subtitle: 'Funzione %{kind}',
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
            subtitle: '%{resource} %{kind}',
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
            "Il nome deve contenere esclusivamente numeri, lettere minuscole e trattini. I trattini non possono trovarsi all'inizio o alla fine della parola.",
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
            invalidCsv: 'Il documento non può essere analizzato come file "csv"',
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
        type_and_press_enter: 'Digita e premi INVIO per aggiungere',
    },
    k8s: {
        envs: {
            title: 'Ambienti',
            description: 'Definizione di ambienti',
        },
        node_selector: {
            title: 'Selettore di Nodo',
            description: 'Definizione di Selettore di Nodo',
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
            description: 'Risorse K8s',
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
    upload: {
        upload_error: "Errore durante l'upload del file %{fileName}. %{error}",
        file_too_big: 'Il file  supera il limite di 100 GiB',
    },
    actions: {
        'toggle-x': 'Mostra/Nascondi %{el}',
    },
};

export default messages;
