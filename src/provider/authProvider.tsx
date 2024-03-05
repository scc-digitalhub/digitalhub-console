import {
    AuthorizationAwareAuthProvider,
    OidcConfiguration,
    OidcAuthProvider as RaOidcAuthProvider,
} from '@dslab/ra-auth-oidc';

export const OidcAuthProvider = (
    props: OidcConfiguration & {
        logoutTo: string;
    }
): AuthorizationAwareAuthProvider => {
    const { logoutTo } = props;
    const provider = RaOidcAuthProvider(props);

    return {
        ...provider,
        logout: (params: any) => {
            return provider.logout(params).then(() => {
                return logoutTo;
            });
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
                } as BasicUser;

                //try call to validate authorization
                const request = new Request(loginUrl, {
                    method: 'GET',
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
                    })
                    .then(() => {
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
                return Promise.reject();
            }
        },
        getPermissions: () => {
            return Promise.resolve();
        },
    };
};

type BasicUser = {
    username: string;
    authorization: string;
};
