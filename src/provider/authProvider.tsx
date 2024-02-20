import { AuthProvider } from 'react-admin';

export const authProvider: AuthProvider = {
    login: ({ username, password }) => {
        let user = {};
        user['authdata'] = window.btoa(username + ':' + password);
        localStorage.setItem('user', JSON.stringify(user));
        return Promise.resolve();
    },
    logout: () => {
        localStorage.removeItem('user');
        return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () =>
        localStorage.getItem('user') ? Promise.resolve() : Promise.reject(),
    getPermissions: () => Promise.resolve(),
};

export default authProvider;

export function authHeader() {
    let user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.authdata) {
        return user.authdata;
    } else {
        return '';
    }
}
