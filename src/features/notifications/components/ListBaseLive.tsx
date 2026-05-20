// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { StompSubscription } from '@stomp/stompjs';
import { ReactNode, useEffect, useRef } from 'react';
import {
    ListBase,
    ListControllerProps,
    RaRecord,
    useResourceContext,
} from 'react-admin';
import { useQueryClient } from '@tanstack/react-query';
import { useStompContext } from '../StompContext';

export const ListBaseLive = <RecordType extends RaRecord = any>({
    children,
    ...props
}: { children: ReactNode } & ListControllerProps<RecordType>) => {
    const resource = useResourceContext(props);
    const queryClient = useQueryClient();
    const { client } = useStompContext();
    const subscription = useRef<StompSubscription | null>(null);

    useEffect(() => {
        const topic = `/notifications/${resource}`;
        if (client && client.connected && queryClient && resource) {
            console.log('subscribing to', topic);
            const callback = message => {
                const notification = JSON.parse(message.body);
                const record = notification.record;
                if (!record?.id) return;

                const predicate = (query: any) =>
                    query.queryKey[0] === resource &&
                    query.queryKey[1] === 'getList' &&
                    query.queryKey[2]?.['meta']?.root === record.project;

                // Try to update the record in-place in every matching cached page.
                // Only fall back to invalidation for pages that don't contain the record.
                const matchingQueries = queryClient.getQueriesData<{
                    data: RaRecord[];
                    total: number;
                }>({ predicate });

                for (const [queryKey, cached] of matchingQueries) {
                    if (!cached?.data) continue;
                    const idx = cached.data.findIndex(r => r.id === record.id);
                    if (idx !== -1) {
                        const updatedData = [...cached.data];
                        updatedData[idx] = record;
                        queryClient.setQueryData(queryKey, {
                            ...cached,
                            data: updatedData,
                        });
                    }
                }
            };
            subscription.current = client.subscribe(topic, callback);
        }

        return () => {
            if (subscription.current !== null) {
                console.log('unsubscribing from', topic);
                subscription.current.unsubscribe();
            }
        };
    }, [client, queryClient, resource]);

    return <ListBase<RecordType> {...props}>{children}</ListBase>;
};
