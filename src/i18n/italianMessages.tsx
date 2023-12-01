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
    projects:"Progetti"
  },
  resources: {
    function: {
     title: "Dettagli della funzione"
    },
    artifact: {
      title: "Dettagli dell'artefatto"
    },
    dataitem: {
      title: "Dettagli dell'Data Item"
    }
   },
   buttons:{
cancel: "Annulla"
   },
    validation: {
      minValue: "Il valore deve esere maggiore o uguale a %{min}",
      noSpace: "Il valore non deve contenere spazi",
      wrongChar: "Il valore puó contenere caratteri alfanumerici, -, ."

    }
};

export default messages;
