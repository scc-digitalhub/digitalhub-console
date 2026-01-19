// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import { useEffect, useState } from 'react';
import {
    useDataProvider,
    useRecordContext,
} from 'react-admin';
import { Relationship } from '../../../../features/lineage';
import { keyParser } from '../../../../common/utils/helper';
import { RunIdsResult } from './types';


export const useGetRunIds = (): RunIdsResult => {
    const dataProvider = useDataProvider();
    const record = useRecordContext();
    const { root } = useRootSelector();
    const [result, setResult] = useState<RunIdsResult>({
        data: [],
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        if (dataProvider && record) {
            dataProvider
                .getLineage('triggers', { id: record.id, meta: { root } })
                .then((data: { lineage: Relationship[] }) => {
                    if (data?.lineage) {
                        let rels: string[] = [];
                        data.lineage.forEach(rel => {
                            const id = rel.source
                                ? keyParser(rel.source).id
                                : undefined;
                            if (id) {
                                rels.push(id);
                            }
                        });
                        setResult({
                            data: rels,
                            isLoading: false,
                            error: null,
                        });
                    }
                })
                .catch(e => {
                    setResult({
                        data: [],
                        isLoading: false,
                        error: e,
                    });
                });
        }
    }, [dataProvider, record, root]);

    return result;
};
