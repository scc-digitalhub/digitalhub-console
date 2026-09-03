import { v4 as uuidv4 } from "uuid";
import type { EntityKind, JsonRecord } from "../compliance-widgets/types";
import type { AgentResult, AgentService } from "../compliance-widgets/services/types";

/** In-browser mock {@link AgentService}. See module doc comment above. */
export function createAgentService(): AgentService {
  return {
    async generateComplianceSpec(kind, entity) {
      return new Promise((resolve) => setTimeout(() => resolve({} as AgentResult), 500));
    },

    async extendComplianceSpec(kind, entity, _currentSpec) {
      return new Promise((resolve) => setTimeout(() => resolve({} as AgentResult), 500));
    },
  };
}
