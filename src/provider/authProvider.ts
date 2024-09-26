import {
    AuthorizationAwareAuthProvider,
    OidcConfiguration,
    OidcAuthProvider as RaOidcAuthProvider,
} from '@dslab/ra-auth-oidc';
import { useMemo } from 'react';
import {
    Identifier,
    useAuthProvider,
    usePermissions,
    AuthProvider,
} from 'react-admin';

const refreshUser = (provider: AuthProvider, loginUrl: string) => {
    return provider
        .getAuthorization()
        .then(auth => {
            if (!auth) {
                return Promise.reject(new Error('invalid auth'));
            }

            //try call to validate authorization
            const request = new Request(loginUrl, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    Authorization: auth,
                }),
            });

            return fetch(request);
        })
        .then(response => {
            if (response.status == 401 || response.status == 403) {
                throw new Error('ra.auth.sign_in_error');
            }
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(json => {
            const user = {
                username: json['username'],
                authorization: null,
                permissions: json['permissions'],
                updatedAt: Date.now(),
            } as BasicUser;

            sessionStorage.setItem('user', JSON.stringify(user));

            return Promise.resolve(user);
        });
};

export const OidcAuthProvider = (
    props: OidcConfiguration & {
        loginUrl: string;
        logoutTo: string;
    }
): AuthorizationAwareAuthProvider => {
    const { loginUrl, logoutTo } = props;
    const provider = RaOidcAuthProvider(props);

    return {
        ...provider,
        handleCallback: async () => {
            if (!provider.handleCallback) {
                return Promise.reject();
            }
            return provider
                .handleCallback()
                .then(() => {
                    return refreshUser(provider, loginUrl);
                })
                .then(user => {
                    return Promise.resolve();
                });
        },
        refreshUser,
        logout: (params: any) => {
            return provider.logout(params).then(() => {
                return logoutTo;
            });
        },
        getIdentity: async () => {
            if (!provider.getIdentity) {
                return Promise.reject();
            }
            return provider
                .getIdentity()
                .then(identity => {
                    const u = sessionStorage.getItem('user');
                    if (!u) {
                        return refreshUser(provider, loginUrl);
                    } else {
                        return JSON.parse(u) as BasicUser;
                    }
                })
                .then(user => {
                    const id = user.username;
                    const fullName = user.username;
                    const avatar = '';

                    return Promise.resolve({ id, fullName, avatar });
                });
        },
        getPermissions: () => {
            const u = sessionStorage.getItem('user');
            if (u) {
                const user = JSON.parse(u) as BasicUser;

                //check if expired
                const now = Date.now();
                if (user.updatedAt && now - user.updatedAt > 30 * 1000) {
                    return refreshUser(provider, loginUrl).then(usr => {
                        return Promise.resolve(usr.permissions);
                    });
                }

                return Promise.resolve(user.permissions);
            } else {
                return Promise.reject(new Error('missing identity'));
            }
        },
    };
};

export const BasicAuthProvider = (props: {
    loginUrl: string;
    logoutTo: string;
}): AuthorizationAwareAuthProvider => {
    const { loginUrl, logoutTo } = props;

    return {
        getAuthorization: () => {
            const u = sessionStorage.getItem('user');
            if (u) {
                const user = JSON.parse(u) as BasicUser;
                return Promise.resolve('Basic ' + user.authorization);
            } else {
                return Promise.reject();
            }
        },
        login: ({ username, password }) => {
            if (username && password) {
                const user = {
                    username: username,
                    authorization: window.btoa(username + ':' + password),
                    permissions: [],
                    updatedAt: Date.now(),
                } as BasicUser;

                //try call to validate authorization
                const request = new Request(loginUrl, {
                    method: 'POST',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        Authorization: 'Basic ' + user.authorization,
                    }),
                });

                return fetch(request)
                    .then(response => {
                        if (response.status == 401 || response.status == 403) {
                            throw new Error('ra.auth.sign_in_error');
                        }
                        if (response.status < 200 || response.status >= 300) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .then(json => {
                        user.permissions = json['permissions'];
                        sessionStorage.setItem('user', JSON.stringify(user));
                    });
            } else {
                throw new Error('ra.auth.sign_in_error');
            }
        },

        checkError: error => {
            if (error.status === 401 || error.status === 403) {
                sessionStorage.removeItem('user');
                return Promise.reject();
            } else {
                return Promise.resolve();
            }
        },
        checkAuth: () => {
            return sessionStorage.getItem('user')
                ? Promise.resolve()
                : Promise.reject();
        },
        logout: () => {
            sessionStorage.removeItem('user');
            return Promise.resolve(logoutTo);
        },
        getIdentity: async () => {
            const u = sessionStorage.getItem('user');
            if (u) {
                const user = JSON.parse(u) as BasicUser;
                const id = user.username;
                const fullName = user.username;
                const avatar = '';

                return Promise.resolve({ id, fullName, avatar });
            } else {
                return Promise.reject(new Error('invalid auth'));
            }
        },
        getPermissions: () => {
            const u = sessionStorage.getItem('user');
            if (u) {
                const user = JSON.parse(u) as BasicUser;
                return Promise.resolve(user.permissions);
            } else {
                return Promise.reject();
            }
        },
    };
};

export type BasicUser = {
    username: string;
    authorization: string | null;
    permissions: string[];
    updatedAt: number;
};

export const useProjectPermissions = () => {
    const authProvider = useAuthProvider();
    const { permissions } = usePermissions();

    const hasAccess = useMemo(() => {
        return (project: Identifier): boolean => {
            if (!authProvider) {
                return true;
            }

            //check permissions
            const pp = permissions || [];
            const isAdmin = pp.find(p => p == 'ROLE_ADMIN');
            const hasAccess = pp.find(p => p.startsWith(project + ':'));

            return isAdmin || hasAccess;
        };
    }, [authProvider, permissions]);

    return { hasAccess };
};
