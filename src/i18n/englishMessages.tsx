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
      name: "Name",
      kind:"Kind",
      tab: {
        summary: "Summary",
        test:"test"
      }
    },
    artifact: {
      title: "Artifact Details",
      name: "Name",
      kind:"Kind",
    },
    dataitem: {
      title: "Data Item details",
      name: "Name",
      kind:"Kind",
    },
    common: {
      emptySpec:"Select the Kind for spec modification"
    },
    list: {
      expandable: {
        version: "Version",
        created: "Creation Date",
      },
    },
    aside: {
      allVersion: "All versions",
      version: "Version",
      created: "Creation Date",
    },
  },
  search:{
    name: "Name",
    kind:"Kind"
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
