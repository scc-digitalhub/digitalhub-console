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
      kind: "Kind",
      tab: {
        summary: "Summary",
        test: "test",
      },
    },
    run: {
      title:"Run",
      create:"Create",
      total:"Total"
    },
    artifact: {
      title: "Artifact Details",
      name: "Name",
      kind: "Kind",
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
      },
      preview: {
        unsupported: "Unsupported",
        invalidDate: "Invalid date",
        invalidDatetime: "Invalid datetime",
      }
    },
    common: {
      emptySpec:"Select the Kind for spec modification",
      version: {
        title: "Versions",
        version: "Version",
        created: "Creation date",
      },
    },
    list: {
      expandable: {
        version: "Version",
        created: "Creation Date",
      },
    },
  },
  pages: {
    dashboard: {
      title: "Dashboard",
      description: "Project overview",
      text: "Define, build and execute functions to manage artifacts and dataitems.",
      functions: {
        title: "Functions and code",
        description: "Define and manage functions",
      },
      dataitems: {
        title: "Data items",
        description: "Review and manage data items",
      },
      artifacts: {
        title: "Artifacts",
        description: "Review and manage artifacts",
      },
    },
    functions: {
      show: {
        title: "Function #%{name}",
        subtitle: "%{kind} function",
      },
    },
  },
  pageTitle: {
    show: {
      title: "%{resource} #%{name}",
      subtitle: "%{kind} %{resource}",
    },
    list: {
      title: "%{resource}",
    },
  },
  search: {
    name: "Name",
    kind: "Kind",
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
