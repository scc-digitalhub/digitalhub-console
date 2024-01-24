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
      title: "Data item details",
      name: "Name",
      kind:"Kind",
      tab: {
        summary: "Summary",
        schema: "Schema",
        preview: "Preview",
      },
      summary: {
        spec: {
          title: "Spec",
          key: "Key",
          path: "Path",
        }
      },
      schema: {
        name: "Name",
        type: "Type",
      }
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
      created: "Creation date",
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
    wrongChar: "The name must consist exclusively of numbers, lowercase letters, and hyphens, without the possibility of placing the latter at the beginning or end of the word",
  },
};

export default messages;
