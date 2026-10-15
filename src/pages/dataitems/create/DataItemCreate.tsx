// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    JSXElementConstructor,
    ReactElement,
    useEffect,
    useState,
} from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import {
    CreateBase,
    CreateView,
    useDataProvider,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { randomId } from '../../../common/utils/helpers';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { CreatePageTitle } from '../../../common/components/layout/PageTitle';
import { DataItemIcon } from '../icon';
import { UploadCoordinatorContext } from '../../../features/files/upload/UploaderContext';
import { useResourceUploader } from '../../../features/files/upload/useRecordUploader';
import { CreateToolbar } from './CreateToolbar';

import { Step, StepperForm } from '@dslab/ra-stepper';
import { StepperToolbar } from '../../../common/components/toolbars/StepperToolbar';
import { ExtensionsForm } from '../../../features/extensions/components/Form';
import { useGetExtensions } from '../../../features/extensions/utils';
import { useGetSchemas } from '../../../common/jsonSchema/schemaController';
import { useExtensionsSteps } from '../../../features/extensions/steps';
import { DataItemSpecStep, BaseStep, UploadStep } from './steps';
import { transformDataItemData } from './utils';
import { TemplatesSelector } from '../../../common/components/TemplatesSelector';

export const DataItemCreate = () => {
    const { root } = useRootSelector();
    const dataProvider = useDataProvider();
    const [id] = useState(randomId);
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const uploader = useResourceUploader({ id });
    const [templates, setTemplates] = useState<any[] | undefined>();
    const [template, setTemplate] = useState<any | undefined>();

    useEffect(() => {
        if (dataProvider) {
            dataProvider
                .getList('templates', {
                    pagination: { page: 1, perPage: 100 },
                    sort: { field: 'name', order: 'ASC' },
                    filter: { type: resource?.slice(0, -1) },
                })
                .then(({ data }) => {
                    setTemplates(data);
                })
                .catch(error => {
                    console.error('Error fetching templates:', error);
                });
        }
    }, [resource, dataProvider]);

    const onSuccess = () => {};

    const onSettled = async (data, error) => {
        if (error) {
            //onError already handles notify
            return;
        }

        await uploader.prepare(data);
        uploader.start();
        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });
        redirect('list', resource);
    };

    const defaultValues = template
        ? { id, ...template, path: template?.spec?.path }
        : { id, spec: {} };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreateBase
                transform={data =>
                    transformDataItemData(data, root, uploader.files.length > 0)
                }
                mutationOptions={{ onSuccess, onSettled }}
                record={defaultValues}
                redirect={'list'}
            >
                <UploadCoordinatorContext.Provider value={uploader}>
                    <CreatePageTitle
                        icon={<DataItemIcon fontSize={'large'} />}
                    />

                    <CreateView component={Box} actions={<CreateToolbar />}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            {' '}
                            {templates &&
                            templates.length > 0 &&
                            template === undefined ? (
                                <TemplatesSelector
                                    templates={templates}
                                    template={template}
                                    onSelected={setTemplate}
                                />
                            ) : (
                                <DataItemCreateForm
                                    onCancel={() => {
                                        if (templates?.length) {
                                            setTemplate(undefined);
                                        } else {
                                            redirect('list', resource);
                                        }
                                    }}
                                />
                            )}
                        </FlatCard>
                    </CreateView>
                </UploadCoordinatorContext.Provider>
            </CreateBase>
        </Container>
    );
};

export const DataItemCreateForm = (props: { onCancel?: () => void }) => {
    const { onCancel } = props;
    const resource = useResourceContext();

    const { data: kindSchemas } = useGetSchemas(resource || '');
    const { data: extensions } = useGetExtensions();
    const contributions = useExtensionsSteps();

    const kinds = kindSchemas
        ? kindSchemas.map(s => ({ id: s.kind, name: s.kind }))
        : [];

    //TODO fix stepperform handling for empty (null) children
    //we build steps outside to avoid false/null children to stepperForm
    const steps: ReactElement<any, JSXElementConstructor<Step>>[] = [
        <StepperForm.Step key="base" label={'fields.base'}>
            <BaseStep />
        </StepperForm.Step>,
        <StepperForm.Step key="spec" label={'fields.spec.title'}>
            <DataItemSpecStep kinds={kinds} />
            <UploadStep />
        </StepperForm.Step>,
    ];

    if (contributions && contributions.length > 0) {
        steps.push(...contributions);
    }

    if (extensions && extensions.length > 0) {
        steps.push(
            <StepperForm.Step
                key="extensions"
                label={'fields.extensions.title'}
            >
                <ExtensionsForm source="extensions" />
            </StepperForm.Step>
        );
    }

    return (
        <StepperForm toolbar={<StepperToolbar onCancel={onCancel} />}>
            {steps}
        </StepperForm>
    );
};
