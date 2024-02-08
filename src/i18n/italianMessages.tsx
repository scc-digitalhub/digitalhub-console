import italianMessages from "@dslab/ra-language-italian";
import { importLibraryItalianMessages } from "./importLibraryItalianMessages";

const messages = {
  ...italianMessages,
  ...importLibraryItalianMessages,
  login: {
    basicMessage: "Autenticarsi per continuare",
    title: "Resource Manager",
    message: "Accedi con AAC",
  },
  menu: {
    projects: "Progetti",
  },
  resources: {
    function: {
      title: "Dettagli della funzione",
      name: "Nome",
      kind:"Tipo",
      tab: {
        summary: "Riepilogo",
        test:"test"
      }
    },
    run: {
      title:"Esecuzione",
      create:"Crea",
      total:"Total"

    },
    artifact: {
      title: "Dettagli dell'artefatto",
      name: "Nome",
      kind:"Tipo",
    },
    dataitem: {
      title: "Dettagli del data item",
      name: "Nome",
      kind:"Tipo",
      tab: {
        summary: "Riepilogo",
        schema: "Schema",
        preview: "Anteprima",
      },
      summary: {
        spec: {
          title: "Spec",
          key: "Key",
          path: "Path",
        }
      },
      schema: {
        name: "Nome",
        type: "Tipo",
      },
      preview: {
        unsupported: "Non supportato",
      }
    },
    common: {
      emptySpec:"Selezionare Kind per visualizzare le specifiche",
      version: {
        title: "Versioni",
        version: "Versione",
        created: "Data di creazione",
      },
    },
    list: {
      expandable: {
        version: "Versione",
        created: "Data di creazione",
      },
    },
  },
  search:{
    name: "Nome",
    kind:"Tipo"
  },
  buttons: {
    cancel: "Annulla",
    newVersion: " Nuova versione",
  },
  validation: {
    minValue: "Il valore deve esere maggiore o uguale a %{min}",
    noSpace: "Il valore non deve contenere spazi",
    wrongChar: "Il nome deve contenere esclusivamente numeri, lettere minuscole e trattini, senza la possibilità di posizionare questi ultimi all'inizio o alla fine della parola",
  },
};

export default messages;
