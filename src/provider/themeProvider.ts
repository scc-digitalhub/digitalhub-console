import { createTheme, PaletteOptions, Theme } from '@mui/material';
import {
    defaultTheme,
    houseLightTheme,
    nanoLightTheme,
    radiantLightTheme,
    RaThemeOptions,
} from 'react-admin';
import { alpha } from '@mui/material';

const componentsOverrides = (theme: Theme) => ({
    ...theme.components,
    RaAppBar: {
        styleOverrides: {
            root: {
                color: theme.palette.text.primary,
                '& .RaAppBar-toolbar': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.background.default,
                },
            },
        },
    },
    RaMenu: {
        styleOverrides: {
            root: {
                backgroundColor: theme.palette?.background?.paper,
                '& .MuiButtonBase-root': {
                    marginTop: 3,
                    marginBottom: 3,
                },
            },
        },
    },
    RaMenuItemLink: {
        styleOverrides: {
            root: {
                padding: 10,
                marginRight: 10,
                marginLeft: 10,
                color: theme.palette?.text?.primary,
                '& .MuiSvgIcon-root': {
                    fill: theme.palette?.text?.primary,
                },
                '&.RaMenuItemLink-active': {
                    backgroundColor: alpha(theme.palette?.primary?.main, 0.12),
                    color: theme.palette?.primary?.main,
                    '& .MuiSvgIcon-root': {
                        fill: theme.palette?.primary?.main,
                    },
                },
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                '&.MuiButton-contained': {
                    paddingTop: 6,
                    paddingBottom: 6,
                },
            },
        },
    },
});

const palette: PaletteOptions = {
    mode: 'light' as 'light',
    primary: { main: '#db6a13' },
    secondary: { main: '#1384db' },
    background: { default: '#fafafa', paper: '#fff' },
    error: { main: '#b57185' },
    warning: { main: '#f2cb05' },
    info: { main: '#39aea9' },
    success: { main: '#00745f' },
};

// const createApplicationTheme = (palette: RaThemeOptions['palette']) => {
//     const themeOptions = {
//         palette,
//         sidebar: {
//             width: 170,
//             closeWidth: 70,
//         },
//     };
//     const theme = createTheme(themeOptions);
//     theme.components = componentsOverrides(theme);
//     return theme;
// };

const createApplicationTheme = (
    themeOptions: RaThemeOptions
): RaThemeOptions => {
    const options = {
        ...themeOptions,
        palette,
        sidebar: {
            width: 170,
            closeWidth: 70,
        },
    };
    const theme = createTheme(options);
    theme.components = componentsOverrides(theme);
    return theme;
};

export const BASE_THEME = defaultTheme;

export const themeProvider = (): RaThemeOptions => {
    return createApplicationTheme(BASE_THEME);
    // return createApplicationTheme(houseLightTheme);
};

export default themeProvider;
