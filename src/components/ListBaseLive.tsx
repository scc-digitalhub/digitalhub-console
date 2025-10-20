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
import { useStompContext } from '../contexts/StompContext';

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
                let notification = JSON.parse(message.body);
                // console.log('notification to', topic, notification);
                queryClient.invalidateQueries({
                    queryKey: [resource, 'getList'],
                });
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
