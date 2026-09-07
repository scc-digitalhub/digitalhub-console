import type { ComponentType } from "react";
import type {
  ConsoleJsonSchemaDescriptor,
  ConsoleExtensionModule,
  ConsoleExtensionModuleLoader,
  ConsoleViewContribution,
  ConsoleViewName,
  ConsoleViewShowIn,
} from "./ConsoleExtension";

export class ConsoleExtensionRegistry {
  private readonly modules = new Map<string, ConsoleExtensionModuleLoader>();

  private readonly components = new Map<string, ComponentType<any>>();

  private readonly jsonSchemaWidgets = new Map<string, ComponentType<any>>();

  private readonly jsonSchemaTemplates = new Map<string, ComponentType<any>>();

  private readonly jsonSchemaFields = new Map<string, ComponentType<any>>();

  private readonly contributions: ConsoleViewContribution[] = [];

  private readonly loadedModules = new Set<string>();

  private readonly loadingModules = new Map<string, Promise<void>>();

  registerModule(loader: ConsoleExtensionModuleLoader) {
    this.modules.set(loader.id, loader);
  }

  getModuleIds() {
    return this.modules.keys();
  }

  async loadModule(id: string) {
    if (this.loadedModules.has(id)) {
      return;
    }

    const inFlight = this.loadingModules.get(id);
    if (inFlight !== undefined) {
      await inFlight;
      return;
    }

    const loader = this.modules.get(id);

    if (!loader) {
      throw new Error(`Console extension module not found: ${id}`);
    }

    const loading = (async () => {
      const loadedModule = await loader.load();
      const module = (loadedModule as any)?.default || loadedModule;

      this.registerLoadedModule(id, module);
      this.loadedModules.add(id);
    })();

    this.loadingModules.set(id, loading);

    try {
      await loading;
    } finally {
      this.loadingModules.delete(id);
    }
  }

  getComponent(componentKey: string) {
    return this.components.get(componentKey);
  }

  getViewContributions(
    resource: string,
    view: ConsoleViewName,
    showIn: ConsoleViewShowIn,
  ) {
    return this.contributions
      .filter(
        (contribution) =>
          contribution.resource === resource &&
          contribution.view === view &&
          contribution.showIn === showIn,
      )
      .sort((a, b) => {
        const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
        const orderB = b.order ?? Number.MAX_SAFE_INTEGER;

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        return a.id.localeCompare(b.id);
      });
  }

  getJsonSchemaWidgets() {
    return Object.fromEntries(this.jsonSchemaWidgets.entries());
  }

  getJsonSchemaTemplates() {
    return Object.fromEntries(this.jsonSchemaTemplates.entries());
  }

  getJsonSchemaFields() {
    return Object.fromEntries(this.jsonSchemaFields.entries());
  }

  private registerLoadedModule(
    discoveredModuleId: string,
    module: ConsoleExtensionModule,
  ) {
    const moduleId = module.id || discoveredModuleId;
    const components = module.components;

    if (!components) {
      throw new Error(
        `Console extension module ${moduleId} has no components descriptor`,
      );
    }

    for (const [localKey, component] of Object.entries(components)) {
      const namespacedKey = `${moduleId}.${localKey}`;

      if (this.components.has(namespacedKey)) {
        throw new Error(
          `Console extension component already registered: ${namespacedKey}`,
        );
      }

      this.components.set(namespacedKey, component);
    }

    const views = module.views || {};
    for (const [resource, resourceViews] of Object.entries(views)) {
      for (const viewName of ["list", "create", "edit", "show"] as const) {
        const descriptors = resourceViews[viewName] || [];

        descriptors.forEach((descriptor, index) => {
          const namespacedComponentKey = `${moduleId}.${descriptor.component}`;

          if (!this.components.has(namespacedComponentKey)) {
            throw new Error(
              `Console extension component not found: ${namespacedComponentKey}`,
            );
          }

          const contributionId =
            descriptor.id ||
            `${moduleId}.${resource}.${viewName}.${descriptor.showIn}.${index}`;

          if (
            this.contributions.some(
              (contribution) => contribution.id === contributionId,
            )
          ) {
            throw new Error(
              `Console extension contribution already registered: ${contributionId}`,
            );
          }

          this.contributions.push({
            id: contributionId,
            moduleId,
            resource,
            view: viewName,
            showIn: descriptor.showIn,
            componentKey: namespacedComponentKey,
            order: descriptor.order,
          });
        });
      }
    }

    this.registerJsonSchema(moduleId, module.jsonSchema);
  }

  private registerJsonSchema(
    moduleId: string,
    jsonSchema: ConsoleJsonSchemaDescriptor | undefined,
  ) {
    if (!jsonSchema) {
      return;
    }

    this.registerJsonSchemaMap(
      moduleId,
      "widget",
      jsonSchema.widgets,
      this.jsonSchemaWidgets,
    );
    this.registerJsonSchemaMap(
      moduleId,
      "template",
      jsonSchema.templates,
      this.jsonSchemaTemplates,
    );
    this.registerJsonSchemaMap(
      moduleId,
      "field",
      jsonSchema.fields,
      this.jsonSchemaFields,
    );
  }

  private registerJsonSchemaMap(
    moduleId: string,
    mapType: "widget" | "template" | "field",
    localMap: Record<string, string> | undefined,
    targetMap: Map<string, ComponentType<any>>,
  ) {
    if (!localMap) {
      return;
    }

    for (const [jsonSchemaKey, localComponentKey] of Object.entries(localMap)) {
      if (targetMap.has(jsonSchemaKey)) {
        throw new Error(
          `Console extension jsonSchema ${mapType} key already registered: ${jsonSchemaKey}`,
        );
      }

      const component = this.components.get(`${moduleId}.${localComponentKey}`);
      if (!component) {
        throw new Error(
          `Console extension component not found for jsonSchema ${mapType} key ${jsonSchemaKey}: ${moduleId}.${localComponentKey}`,
        );
      }

      targetMap.set(jsonSchemaKey, component);
    }
  }
}

export const consoleExtensionRegistry = new ConsoleExtensionRegistry();
