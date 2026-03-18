// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Container } from '@mui/material';
import { CreateBase, LoadingIndicator, useCreatePath } from 'react-admin';
import { useLocation, useNavigate } from 'react-router-dom';
import { FunctionIcon } from '../../../pages/functions/icon';
import { getFunctionUiSpec } from '../../../pages/functions/types';
import { KindSelector } from '../../../common/components/KindSelector';
import { SpecInput } from '../../../common/jsonSchema/components/SpecInput';
import { useSchemaProvider } from '../../../common/provider/schemaProvider';
import { CreatePageTitle } from '../../../common/components/layout/PageTitle';
import { ResourceStepperCreate } from '../../../common/components/ResourceStepperCreate';

export const HubImport = () => {
    const { root } = useRootSelector();
    const { state } = useLocation();
    const hubTemplate = state?.hubTemplate;
    const createPath = useCreatePath();
    const cancelUrl = createPath({ resource: 'functions', type: 'list' });
    const navigate = useNavigate();

    const schemaProvider = useSchemaProvider();
    const [schemas, setSchemas] = useState<any[]>();
    useEffect(() => {
        if (schemaProvider && !schemas?.length) {
            schemaProvider.list('functions').then(res => {
                if (res) setSchemas(res);
            });
        }
    }, [schemaProvider]);

    const kinds = schemas
        ?.map(s => ({ id: s.kind, name: s.kind }))
        .sort((a, b) => a.name.localeCompare(b.name));

    const transform = data => ({ ...data, project: root || '' });
    const handleSuccess = (data: any) => {
        const showPath = createPath({ 
            resource: 'functions', 
            type: 'show', 
            id: data.id 
        });
        navigate(showPath, { replace: true }); 
    };
    const defaultValues = hubTemplate
        ? {
              kind: hubTemplate.kind,
              metadata: {
                  name: hubTemplate.metadata?.name || '',
                  description: hubTemplate.metadata?.description || '',
                  labels: hubTemplate.metadata?.labels || [],
              },
              spec: hubTemplate.spec || {},
          }
        : {};

    if (!schemas?.length) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                transform={transform}
                resource="functions"
                mutationOptions={{ onSuccess: handleSuccess }} 
                record={defaultValues}
            >
                <>
                    <CreatePageTitle icon={<FunctionIcon fontSize="large" />} />
                    <ResourceStepperCreate
                        cancelUrl={cancelUrl}
                        kindStep={
                            <KindSelector
                                kinds={kinds}
                                readOnly 
                            />
                        }
                        specStep={
                            <SpecInput
                                source="spec"
                                getUiSchema={getFunctionUiSpec}
                            />
                        }
                    />
                </>
            </CreateBase>
        </Container>
    );
};