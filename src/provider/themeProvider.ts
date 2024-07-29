import { createTheme, PaletteOptions, Theme } from '@mui/material';
import {
    defaultTheme,
    houseLightTheme,
    houseDarkTheme,
    nanoLightTheme,
    radiantLightTheme,
    RaThemeOptions,
} from 'react-admin';
import { alpha } from '@mui/material';
// import { palette } from '@mui/system';

const componentsOverrides = (theme: Theme) => ({
    ...theme.components,
    MuiTextField: {
        defaultProps: {
            size: 'small',
        },
    },
    MuiSelect: {
        defaultProps: {
            size: 'small',
        },
    },
    // MuiCssBaseline: {
    //     styleOverrides: {
    //         '*': {
    //             boxSizing: 'border-box',
    //         },
    //         html: {
    //             MozOsxFontSmoothing: 'grayscale',
    //             WebkitFontSmoothing: 'antialiased',
    //             display: 'flex',
    //             flexDirection: 'column',
    //             minHeight: '100%',
    //             width: '100%',
    //         },
    //         body: {
    //             display: 'flex',
    //             flex: '1 1 auto',
    //             flexDirection: 'column',
    //             minHeight: '100%',
    //             width: '100%',
    //         },
    //         '#root': {
    //             display: 'flex',
    //             flex: '1 1 auto',
    //             flexDirection: 'column',
    //             height: '100%',
    //             width: '100%',
    //         },
    //     },
    // },
    RaAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: theme.palette?.primary?.main,
                color: theme.palette?.primary?.contrastText,
            },
        },
    },
    RaListToolbar: {
        styleOverrides: {
            root: {
                marginBottom: theme.spacing(1),
            },
        },
    },
    // RaMenu: {
    //     styleOverrides: {
    //         root: {
    //             backgroundColor: theme.palette['paper'],
    //             // borderRight: '1px solid ' + theme.palette.divider,
    //             '& .MuiButtonBase-root': {
    //                 marginTop: 3,
    //                 marginBottom: 3,
    //             },
    //         },
    //     },
    // },
    // RaLayout: {
    //     styleOverrides: {
    //         root: {
    //             '& .RaLayout-content': {
    //                 backgroundColor: theme.palette?.background?.default,
    //             },
    //         },
    //     },
    // },
    RaMenuItemLink: {
        styleOverrides: {
            root: {
                padding: 10,
                paddingLeft: 5,
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
                '& th.RaDatagrid-headerCell:last-child': {
                    textAlign: 'right',
                },
            },
        },
    },
    MuiOutlinedInput: {
        styleOverrides: {},
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
                '&.MuiTableCell-head': {
                    backgroundColor: alpha(theme.palette?.primary?.main, 0.05),
                    fontWeight: '600',
                },
            },
        },
    },
    RaDataGrid: {
        styleOverrides: {
            root: {
                '& .RaDatagrid-headerCell': {
                    backgroundColor: alpha(theme.palette?.primary?.main, 0.12),
                },
            },
        },
    },
    MuiTablePagination: {
        styleOverrides: {
            root: {
                '& .MuiTablePagination-input ': {
                    paddingTop: '6px'
                },
            },
        },
    },
    MuiTab: {},
    MuiTabs: {},
});

// const palette: PaletteOptions & { paper: string } = {
//     mode: 'light' as 'light',
//     primary: {
//         main: '#E0701B',
//         dark: '#9c3b15',
//         light: '#ec934f',
//     },
//     secondary: { main: '#062D4B' },
//     paper: '#F8F7F2',
//     background: { default: '#f5f5f6', paper: '#FFF' },
// };

const palette: {
    light: PaletteOptions & { paper: string };
    dark: PaletteOptions & { paper: string };
} = {
    light: {
        mode: 'light' as 'light',
        primary: {
            main: '#E0701B',
            dark: '#9c3b15',
            light: '#ec934f',
        },
        secondary: { main: '#062D4B' },
        paper: '#F8F7F2',
        background: { default: '#f5f5f6', paper: '#FFF' },
    },
    dark: {
        mode: 'dark' as 'dark',
        primary: {
            main: '#E0701B',
            dark: '#9c3b15',
            light: '#ec934f',
        },
        secondary: { main: '#6EA3CB' },
        paper: '#2B3033',
        background: { default: '#363D40', paper: '#2B3033' },
    },
};

const createApplicationTheme = (
    themeOptions: RaThemeOptions,
    mode: 'light' | 'dark'
): RaThemeOptions => {
    const options = {
        ...themeOptions,
        palette: palette[mode],
        shape: { borderRadius: 5 },
    };
    const theme = createTheme(options);
    theme.components = componentsOverrides(theme);
    return theme;
};

export const BASE_THEME = defaultTheme;

// export const themeProvider = (): RaThemeOptions => {
//     // return createApplicationTheme(BASE_THEME);
//     return createApplicationTheme(houseLightTheme);
// };

export const themeProvider = (): {
    light: RaThemeOptions;
    dark: RaThemeOptions;
} => {
    return {
        light: createApplicationTheme(houseLightTheme, 'light'),
        dark: createApplicationTheme(houseDarkTheme, 'dark'),
    };
};

export default themeProvider;
