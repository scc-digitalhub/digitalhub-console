import englishMessages from "ra-language-english";

const messages = {
  ...englishMessages,
  login: {
    basicMessage: "Authenticate to continue",
    title: "Resource Manager",
    message: "Access with AAC",
  },
  menu: {
    projects: "Projects",
  },
  resources: {
    function: {
      title: "Funtion Details",
    },
    artifact: {
      title: "Artifact Details",
    },
    dataitem: {
      title: "Data Item details",
    },
    list: {
      expandable: {
        version: "Versione",
        created: "Creation Date",
      },
    },
  },
  buttons: {
    cancel: "Cancel",
    newVersion: " New version",
  },
  validation: {
    minValue: "Value must be greater that or equal to %{min}",
    noSpace: "Value must contain no space",
    wrongChar: "Value must contain alphanumeric, -, .",
  },
};

export default messages;
