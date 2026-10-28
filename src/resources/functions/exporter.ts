// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { downloadYaml, toYaml } from '@dslab/ra-export-record-button';
import { Exporter } from 'react-admin';

export const exporter: Exporter = async (
    data,
    fetchRelatedRecords,
    dataProvider,
    resource
) => {
    const record = data[0];
    const name = `${resource}-${record.id}`;

    try {
        const tasks = await dataProvider
            .getList('tasks', {
                pagination: { page: 1, perPage: 100 },
                sort: { field: 'kind', order: 'ASC' },
                filter: {
                    function: `${record.kind}://${record.project}/${record.name}:${record.id}`,
                },
            })
            .then(list => list.data);

        const yamlTasks = tasks.map(t => toYaml(t));
        downloadYaml([toYaml(record), ...yamlTasks].join('---\n'), name);
    } catch (err) {
        //download only record
        downloadYaml(toYaml(record), name);
    }
};
