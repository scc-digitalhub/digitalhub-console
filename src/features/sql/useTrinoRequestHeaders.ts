// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { useAuthProvider } from 'react-admin';

const useTrinoRequestHeaders = (): Record<string, string> => {
    const authProvider = useAuthProvider();
    const [authHeader, setAuthHeader] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const fetchHeaders = () => {
            if (!authProvider) return;
            (authProvider as any)
                .getAuthorization?.()
                ?.then((header: unknown) => {
                    if (!cancelled && typeof header === 'string') {
                        setAuthHeader(header);
                    }
                })
                ?.catch(() => {
                    if (!cancelled) setAuthHeader(null);
                });

            authProvider
                .getIdentity?.()
                ?.then((identity: any) => {
                    if (!cancelled && identity?.fullName) {
                        setUsername(identity.fullName);
                    }
                })
                ?.catch(() => {});
        };

        fetchHeaders();
        return () => {
            cancelled = true;
        };
    }, [authProvider]);

    return useMemo(() => {
        const headers: Record<string, string> = {};

        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        // Trino's JWT authenticator only activates over HTTPS; over HTTP the
        // insecure authenticator is used and requires X-Trino-User to identify
        // the caller.
        if (username) {
            headers['X-Trino-User'] = username;
        }

        return headers;
    }, [authHeader]);
};

export default useTrinoRequestHeaders;
