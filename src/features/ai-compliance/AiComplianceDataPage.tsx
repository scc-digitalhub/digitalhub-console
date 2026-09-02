// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    useRecordContext,
    useTranslate,
} from 'react-admin';

import {
    ComplianceServicesProvider,
    DatasetComplianceWidget
} from "./compliance-widgets";
import { PageTitle } from '../../common/components/layout/PageTitle';
import { ComplianceIcon } from './icon';
import { useGetSchemas } from '../../common/jsonSchema/schemaController';
 
export const AiComplianceDataPage = (props: {
    resource?: string;
    record?: any;
    source?: string;
}) => {
    const translate = useTranslate();
    const { source = 'extensions' } = props;
    const record = useRecordContext(props);
    //check if any extension is available
    const { data: schemas, isLoading } = useGetSchemas('extensions');

    const field = record ? record[source] : null;
    if (!field || isLoading || !schemas) {
        return <></>;
    }

    return (
        <ComplianceServicesProvider>
            <PageTitle
                text={translate('compliance.pages.datacompliance.title')}
                secondaryText={translate(
                    'compliance.pages.datacompliance.description'
                )}
                icon={<ComplianceIcon fontSize="large" />}
            />

            <DatasetComplianceWidget entityId="11111111-1111-1111-1111-111111111111" />
        </ComplianceServicesProvider>
    );
};