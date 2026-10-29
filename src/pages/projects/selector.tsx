// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    List,
    Pagination,
    TopToolbar,
    useAuthenticated,
    SortButton,
    useGetIdentity,
    TextInput,
    SelectInput,
    ResourceContextProvider,
} from 'react-admin';
import { Box, Stack } from '@mui/material';

import { CreateProjectButton } from '../../resources/projects/create';
import { Empty } from '../../common/components/layout/Empty';
import { InstanceMetrics } from '../../features/k8smetrics/InstanceMetrics';
import { ProjectGrid } from '../../resources/projects/list/ProjectGrid';

const enableMetrics: string =
    (globalThis as any).REACT_APP_ENABLE_METRICS ||
    (process.env.REACT_APP_ENABLE_METRICS as string) ||
    false;
const INSTANCE_METRICS: string =
    (globalThis as any).REACT_APP_INSTANCE_METRICS ||
    (process.env.REACT_APP_INSTANCE_METRICS as string) ||
    null;

export const ProjectSelectorList = props => {
    //check if auth is required to redirect to login
    useAuthenticated();
    const { data: identity } = useGetIdentity();

    const perPage = 12;
    const username = identity?.id || null;
    const filters = username
        ? [
              <TextInput
                  label="fields.name.title"
                  source="name"
                  alwaysOn
                  resettable
                  key={1}
              />,
              <SelectInput
                  alwaysOn
                  key={2}
                  label="fields.createdBy.title"
                  source="user"
                  choices={[
                      { id: username, name: 'pages.search.createdBy.me' },
                      {
                          id: username + ':shared',
                          name: 'pages.search.createdBy.shared',
                      },
                  ]}
                  emptyText={'pages.search.createdBy.anyone'}
                  emptyValue={''}
                  sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
              />,
          ]
        : [];

    return (
        <Stack spacing={1}>
            <ResourceContextProvider value="projects">
                <List
                    {...props}
                    actions={<Toolbar />}
                    component={Box}
                    sort={{ field: 'updated', order: 'DESC' }}
                    perPage={perPage}
                    storeKey={false}
                    pagination={<Pagination rowsPerPageOptions={[perPage]} />}
                    filters={filters}
                    filterDefaultValues={{ user: username }}
                    empty={
                        <Empty>
                            <CreateProjectButton />
                        </Empty>
                    }
                >
                    <ProjectGrid />
                </List>
                {enableMetrics && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}
                    >
                        <InstanceMetrics
                            metrics={
                                INSTANCE_METRICS
                                    ? INSTANCE_METRICS.split(',')
                                    : true
                            }
                        />
                    </Box>
                )}
            </ResourceContextProvider>
        </Stack>
    );
};

const Toolbar = () => {
    return (
        <TopToolbar>
            <SortButton fields={['updated', 'name']} />
            <CreateProjectButton />
        </TopToolbar>
    );
};
