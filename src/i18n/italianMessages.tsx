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
        summary: "Descrizione",
        test:"test"
      }
    },
    artifact: {
      title: "Dettagli dell'artefatto",
      name: "Nome",
      kind:"Tipo",
    },
    dataitem: {
      title: "Dettagli dell'Data Item",
      name: "Nome",
      kind:"Tipo",
    },
    common: {
      emptySpec:"Selezionare Kind per visualizzare le specifiche"
    },
    list: {
      expandable: {
        version: "Versione",
        created: "Data di creazione",
      },
    },
    aside: {
      allVersion: "Tutte le versioni",
      version: "Versione",
      created: "Data di creazione",
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
    wrongChar: "Il valore puó contenere caratteri alfanumerici, -, .",
  },
};

export default messages;
