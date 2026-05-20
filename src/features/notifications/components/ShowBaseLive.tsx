// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { StompSubscription } from '@stomp/stompjs';
import { ReactElement, useEffect, useRef } from 'react';
import {
    RaRecord,
    ShowBase,
    ShowControllerProps,
    useResourceContext,
} from 'react-admin';
import { useQueryClient } from '@tanstack/react-query';
import { useStompContext } from '../StompContext';
import { useParams } from 'react-router-dom';

export const ShowBaseLive = <RecordType extends RaRecord = any>({
    children,
    ...props
}: { children: ReactElement } & ShowControllerProps<RecordType>) => {
    const { id: propsId } = props;
    const resource = useResourceContext(props);
    const queryClient = useQueryClient();
    const { client } = useStompContext();
    const subscription = useRef<StompSubscription | null>(null);
    const { id: routeId } = useParams<'id'>();
    const id =
        propsId != null
            ? propsId
            : routeId
            ? decodeURIComponent(routeId)
            : undefined;

    useEffect(() => {
        const topic = `/notifications/${resource}/${id}`;
        if (client && client.connected && queryClient && resource && id) {
            console.log('subscribing to', topic);
            const callback = message => {
                const notification = JSON.parse(message.body);
                const record = notification.record;
                const state = record?.status?.state;
                // Ignore deletion states — the resource no longer exists.
                if (state === 'DELETING' || state === 'DELETED') return;

                const queryKey = [resource, 'getOne', { id: String(id) }];
                if (record?.id) {
                    // Full record available: update in-place, no network request.
                    queryClient.setQueryData(queryKey, { data: record });
                } else {
                    // Partial/missing record: fall back to invalidation.
                    queryClient.invalidateQueries({ queryKey });
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
    }, [client, id, queryClient, resource]);

    return <ShowBase<RecordType> {...props}>{children}</ShowBase>;
};
