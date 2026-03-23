// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Container } from '@mui/material';
import { CreateBase, useCreatePath, useTranslate } from 'react-admin';
import { KindSelector } from '../../common/components/KindSelector';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';
import {
    CreatePageTitle,
    PageTitle,
} from '../../common/components/layout/PageTitle';
import { getFunctionUiSpec } from './types';
import { FunctionIcon } from './icon';

import { useEffect } from 'react';
import { useCreateFlow } from '../../common/hooks/useCreateFlow';
import { TemplatesSelector } from '../../common/components/TemplatesSelector';
import { useSchemaProvider } from '../../common/provider/schemaProvider';
import { BackButton } from '@dslab/ra-back-button';
import { ResourceStepperCreate } from '../../common/components/ResourceStepperCreate';

export const FunctionCreate = () => {
    const { root } = useRootSelector();
    const schemaProvider = useSchemaProvider();
    const createPath = useCreatePath();
    const cancelUrl = createPath({ resource: 'functions', type: 'list' });

    const {
        template,
        isSelector,
        isFromTemplate,
        startFromScratch,
        startFromTemplate,
        reset,
    } = useCreateFlow();
    const translate = useTranslate();

    const transform = useCallback(
        (data: any) => ({ ...data, project: root || '' }),
        [root]
    );
    const [schemas, setSchemas] = useState<any[]>();

    const kinds = schemas
        ?.map(s => ({
            id: s.kind,
            name: s.kind,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    useEffect(() => {
        if (schemaProvider && !schemas?.length) {
            schemaProvider.list('functions').then(res => {
                if (res) {
                    setSchemas(res);
                }
            });
        }
    }, [schemaProvider]);
    const defaultValues =
        isFromTemplate && template
            ? {
                  kind: template.kind ?? '',
                  name: template.name ?? '',
                  metadata: {
                      name: template.metadata?.name ?? '',
                      description: template.metadata?.description ?? '',
                      labels: template.metadata?.labels ?? [],
                  },
                  spec: template.spec ?? {},
              }
            : {};

    // seleziono modalita' 
    if (isSelector) {
        return (
            <Container maxWidth={false} sx={{ pb: 2 }}>
                <PageTitle
                    text={translate(
                        'resources.functions.template_selector.title'
                    )}
                    icon={<FunctionIcon fontSize={'large'} />}
                />
                <BackButton />
                <TemplatesSelector
                    template={null}
                    onSelected={template => {
                        if (template) startFromTemplate(template);
                        else startFromScratch();
                    }}
                />
            </Container>
        );
    }
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                resource="functions"
                transform={transform}
                redirect="list"
                record={defaultValues}
            >
                <>
                    <CreatePageTitle icon={<FunctionIcon fontSize="large" />} />
                    <ResourceStepperCreate
                        {...(isFromTemplate 
                            ? { cancelUrl } 
                            : { onCancel: reset }
                        )}
                        kindStep={
                            <KindSelector
                                kinds={kinds}
                                readOnly={isFromTemplate}
                            />
                        }
                        specStep={
                            <SpecInput
                                source="spec"
                                getUiSchema={getFunctionUiSpec}
                            />
                        }
                        alwaysEnableSave={true}
                    />
                </>
            </CreateBase>
        </Container>
    );
};
