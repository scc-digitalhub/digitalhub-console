import type { ComplianceWidgetServices } from "../compliance-widgets/services/types";
import { createComplianceService } from "./complianceService";
import { createAgentService } from "./agentService";

export function createServices(record: any): ComplianceWidgetServices {

  return {
    complianceService: createComplianceService(record),
    agentService: createAgentService(),
  };
}
