// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    useTranslate,
} from 'react-admin';
import { useRootSelector } from '@dslab/ra-root-selector';


import {
    ComplianceServicesProvider, ProjectComplianceWidget,
} from "./compliance-widgets";
import { PageTitle } from '../../common/components/layout/PageTitle';
import { ComplianceIcon } from './icon';
 
export const AiCompliancePage = () => {
    const { root: projectId } = useRootSelector();
    const translate = useTranslate();

    return (
        <ComplianceServicesProvider>
            <PageTitle
                text={translate('compliance.pages.compliance.title')}
                secondaryText={translate(
                    'compliance.pages.compliance.description'
                )}
                icon={<ComplianceIcon fontSize="large" />}
            />

            <ProjectComplianceWidget entityId="11111111-1111-1111-1111-111111111111" />
        </ComplianceServicesProvider>
    );
};