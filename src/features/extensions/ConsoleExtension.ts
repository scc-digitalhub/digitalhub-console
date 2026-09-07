import type { ComponentType } from "react";

export type ConsoleViewName = "list" | "create" | "edit" | "show";

export type ConsoleViewShowIn = "toolbar" | "tab" | "section";

export type ConsoleExtensionComponents = Record<string, ComponentType<any>>;

export interface ConsoleJsonSchemaDescriptor {
  widgets?: Record<string, string>;
  templates?: Record<string, string>;
  fields?: Record<string, string>;
}

export interface ConsoleViewContributionDescriptor {
  id?: string;
  showIn: ConsoleViewShowIn;
  component: string;
  order?: number;
}

export type ConsoleViewDescriptor = Partial<
  Record<ConsoleViewName, ConsoleViewContributionDescriptor[]>
>;

export type ConsoleResourceViewsDescriptor = Record<string, ConsoleViewDescriptor>;

export interface ConsoleExtensionModule {
  id?: string;
  components: ConsoleExtensionComponents;
  views?: ConsoleResourceViewsDescriptor;
  jsonSchema?: ConsoleJsonSchemaDescriptor;
}

export interface ConsoleExtensionModuleLoader {
  id: string;
  load: () => Promise<ConsoleExtensionModule>;
}

export interface ConsoleViewContribution {
  id: string;
  moduleId: string;
  resource: string;
  view: ConsoleViewName;
  showIn: ConsoleViewShowIn;
  componentKey: string;
  order?: number;
}
