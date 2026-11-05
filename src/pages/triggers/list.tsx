// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import {
    ListView,
    SelectInput,
    TextInput,
    TopToolbar,
    useLocaleState,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { Box, Container } from '@mui/material';
import yamlExporter from '@dslab/ra-export-yaml';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { ListPageTitle } from '../../common/components/layout/PageTitle';
import { StateChips, StateColors } from '../../common/components/StateChips';
import { TriggerIcon } from '../../resources/triggers/icon';
import { useRootSelector } from '@dslab/ra-root-selector';
import { ListBaseLive } from '../../features/notifications/components/ListBaseLive';
import { useKinds } from '../../common/hooks/useKinds';
import { FILTER_INPUT_PROPS } from '../../common/theme';
import { TriggerList } from '../../resources/triggers/TriggerList';
import { DropDownButton } from '../../common/components/buttons/DropdownButton';
import Spacer from '../../common/components/layout/Spacer';
import { CreateInDialogButton } from '@dslab/ra-dialog-crud';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { TriggerCreate } from '../../resources/triggers/TriggerCreate';
import AddIcon from '@mui/icons-material/Add';

const allStateChoices = [
    { id: 'CREATED', name: 'states.created' },
    { id: 'ERROR', name: 'states.error' },
    { id: 'READY', name: 'states.ready' },
    { id: 'RUNNING', name: 'states.running' },
    { id: 'STOPPED', name: 'states.stopped' },
];

export const TriggerListView = () => {
    const { root } = useRootSelector();
    const resource = useResourceContext();
    const translate = useTranslate();
    const kinds = useKinds({ resource: 'triggers' });

    const [localeState] = useLocaleState();
    const locale = localeState?.startsWith('it') ? 'it' : 'en';

    const sortedStateChoices = useMemo(
        () =>
            [...allStateChoices].sort((a, b) =>
                translate(a.name).localeCompare(translate(b.name), locale)
            ),
        [translate, locale]
    );

    //generate create buttons
    const buttons = useMemo(() => {
        if (kinds) {
            return kinds.map(kind => {
                const partial = {
                    project: root,
                    kind: kind,
                    spec: {
                        template: {
                            local_execution: false,
                        },
                    },
                };

                const prepare = (r: any) => {
                    const v = {
                        ...r,
                        project: root,
                        kind: kind,
                        spec: {
                            //copy the full spec  (using form)
                            ...r.spec,
                        },
                    };

                    //clear values from template if set
                    if (v.spec.template) {
                        if (v.spec.template['function']) {
                            delete v.spec.template['function'];
                        }
                        if (v.spec.template['workflow']) {
                            delete v.spec.template['workflow'];
                        }
                        if (v.spec.template.task) {
                            delete v.spec.template.task;
                        }
                        v.spec.template.local_execution = false;
                    }

                    return v;
                };

                //TODO improve label generation based on kind and locale
                const label = kind;

                return (
                    <CreateInDialogButton
                        resource="triggers"
                        key={kind}
                        record={partial}
                        fullWidth
                        maxWidth={'lg'}
                        transform={prepare}
                        closeOnClickOutside={false}
                        label={label}
                        icon={<KeyboardArrowRightIcon fontSize="small" />}
                    >
                        <TriggerCreate kind={kind} />
                    </CreateInDialogButton>
                );
            });
        }
        return [];
    }, [kinds, root]);

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ListBaseLive
                exporter={yamlExporter}
                sort={{ field: 'metadata.updated', order: 'DESC' }}
                storeKey={`${root}.${resource}.listParams`}
                queryOptions={{ meta: { root } }}
            >
                <>
                    <ListPageTitle icon={<TriggerIcon fontSize={'large'} />} />

                    <ListToolbar buttons={buttons} />

                    <FlatCard>
                        <ListView
                            filters={
                                kinds
                                    ? [
                                          <TextInput
                                              label="ra.action.search"
                                              source="q"
                                              alwaysOn
                                              resettable
                                              key="q"
                                          />,
                                          <SelectInput
                                              key="kind"
                                              label="fields.kind"
                                              source="kind"
                                              choices={kinds.map(s => ({
                                                  id: s,
                                                  name: s,
                                              }))}
                                              {...FILTER_INPUT_PROPS}
                                          />,
                                          <SelectInput
                                              key="state"
                                              label="fields.status.state"
                                              source="state"
                                              choices={sortedStateChoices}
                                              optionText={choice => (
                                                  <StateChips
                                                      record={choice}
                                                      source="id"
                                                      label="name"
                                                      size="small"
                                                  />
                                              )}
                                              {...FILTER_INPUT_PROPS}
                                          />,
                                      ]
                                    : undefined
                            }
                            actions={false}
                            component={Box}
                            sx={{ pb: 2 }}
                        >
                            <TriggerList />
                        </ListView>
                    </FlatCard>
                </>
            </ListBaseLive>
        </Container>
    );
};

const ListToolbar = (props: { buttons?: React.ReactElement<any>[] }) => {
    return (
        <TopToolbar>
            <Spacer />
            {props.buttons && (
                <DropDownButton
                    label="ra.action.create"
                    variant="text"
                    icon={<AddIcon />}
                >
                    {props.buttons.map(button => button)}
                </DropDownButton>
            )}
        </TopToolbar>
    );
};
