import type { ComplianceWidgetServices } from "../types";
import { createMockComplianceService } from "./complianceService";
import { createMockAgentService } from "./agentService";

export { createMockComplianceService } from "./complianceService";
export { createMockAgentService } from "./agentService";

/**
 * Bundles the two in-browser mock services (compliance/agent) so the compliance widgets
 * work standalone with no backend wiring. This is the default used by
 * `<ComplianceServicesProvider>` when no `services` prop is supplied.
 */
export function createMockServices(): ComplianceWidgetServices {
  return {
    complianceService: createMockComplianceService(),
    agentService: createMockAgentService(),
  };
}
