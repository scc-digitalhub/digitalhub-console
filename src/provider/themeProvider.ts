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
    RaLayout: {
        styleOverrides: {
            root: {
                '& .RaLayout-content': {
                    backgroundColor: theme.palette?.background?.default,
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
    MuiTableRow: {
        styleOverrides: {
            root: {
                '&:last-child td': { border: 0 },
            },
        },
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                padding: theme.spacing(2),
                '&.MuiTableCell-sizeSmall': {
                    padding: theme.spacing(1.5),
                },
                '&.MuiTableCell-paddingNone': {
                    padding: theme.spacing(0.5),
                },
            },
        },
    },
    RaDataGrid: {
        styleOverrides: {
            header: {
                '& .RaDatagrid-headerCell': {
                    backgroundColor: alpha(theme.palette?.primary?.main, 0.12),
                },
            },
        },
    },
});

const palette: PaletteOptions = {
    mode: 'light' as 'light',
    primary: {
        main: '#E0701B',
        dark: '#9c3b15',
        light: '#ec934f',
    },
    secondary: { main: '#062D4B' },
    background: { default: '#FFF' },
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
