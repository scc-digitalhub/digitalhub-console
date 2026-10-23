// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    JSXElementConstructor,
    ReactElement,
    useCallback,
    useState,
} from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Box, Container } from '@mui/material';
import {
    CreateBase,
    CreateView,
    LinearProgress,
    MutationMode,
    RedirectionSideEffect,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { CreatePageTitle } from '../../../common/components/layout/PageTitle';
import { FunctionIcon } from '../icon';
import { TemplatesSelector } from '../../../common/components/TemplatesSelector';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { CreateToolbar } from './CreateToolbar';
import { useGetTemplates } from '../../../common/provider/templateProvider';
import {
    MutationFunctionContext,
    UseMutationOptions,
} from '@tanstack/react-query';
import { FunctionCreateForm } from './FunctionForm';

export const FunctionCreateView = () => {
    const resource = useResourceContext();
    const redirect = useRedirect();

    const { data: templates, isLoading } = useGetTemplates(resource);
    const [template, setTemplate] = useState<any | undefined>();

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <CreatePageTitle icon={<FunctionIcon fontSize={'large'} />} />
            <CreateToolbar />

            <FlatCard sx={{ paddingBottom: '12px' }}>
                {isLoading ? (
                    <LinearProgress />
                ) : templates &&
                  templates.length > 0 &&
                  template === undefined ? (
                    <TemplatesSelector
                        templates={templates}
                        template={template}
                        onSelected={setTemplate}
                    />
                ) : (
                    <FunctionCreate template={template} redirect="list">
                        <FunctionCreateForm
                            isFromTemplate={!!template}
                            onCancel={() => {
                                if (templates?.length) {
                                    setTemplate(undefined);
                                } else {
                                    redirect('list', resource);
                                }
                            }}
                        />
                    </FunctionCreate>
                )}
            </FlatCard>
        </Container>
    );
};

export const FunctionCreate = (props: {
    id?: string;
    template?: any;
    redirect?: RedirectionSideEffect;
    mutationMode?: MutationMode;
    mutationOptions?: UseMutationOptions & { meta?: any };
    actions?:
        | false
        | ReactElement<any, string | JSXElementConstructor<any>>
        | undefined;
    children: ReactElement;
}) => {
    const { id, template, mutationMode = 'pessimistic', children } = props;
    const { root } = useRootSelector();
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();

    const onSuccess = (
        data,
        variables,
        onMutateResult,
        context: MutationFunctionContext
    ) => {
        if (props.mutationOptions?.onSuccess) {
            props.mutationOptions.onSuccess(
                data,
                variables,
                onMutateResult,
                context
            );
        }
    };

    const onSettled = async (
        data: any,
        error: any,
        variables,
        onMutateResult,
        context: MutationFunctionContext
    ) => {
        if (error) {
            //onError already handles notify
            return;
        }

        //always notify
        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });

        if (props.mutationOptions?.onSettled) {
            props.mutationOptions.onSettled(
                data,
                error,
                variables,
                onMutateResult,
                context
            );
        }

        if (props.redirect === false) {
            return;
        }

        redirect(props.redirect ?? 'list', resource);
    };

    const transform = useCallback(
        (data: any) => {
            return {
                ...data,
                id,
                project: root || '',
            };
        },
        [root, id]
    );

    const defaultValues = template
        ? { ...template, id: undefined, path: template?.spec?.path }
        : { spec: {} };

    return (
        <CreateBase
            transform={data => transform(data)}
            mutationOptions={{ onSuccess, onSettled }}
            record={defaultValues}
            redirect={false}
            mutationMode={mutationMode}
        >
            <CreateView component={Box} actions={props.actions}>
                {children}
            </CreateView>
        </CreateBase>
    );
};
