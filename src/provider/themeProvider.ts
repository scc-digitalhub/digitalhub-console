import { createTheme, PaletteOptions, Theme } from '@mui/material';
import { defaultTheme, RaThemeOptions } from 'react-admin';
import { alpha } from '@mui/material';

const componentsOverrides = (theme: Theme) => ({
    ...defaultTheme.components,
    RaMenu: {
        styleOverrides: {
            root: {
                backgroundColor: theme.palette.background.paper,
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
                color: theme.palette.text.primary,
                '& .MuiSvgIcon-root': {
                    fill: theme.palette.text.primary,
                    transition: 'none',
                },
                '&.RaMenuItemLink-active': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    '& .MuiSvgIcon-root': {
                        fill: theme.palette.primary.main,
                    },
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

const createApplicationTheme = (palette: RaThemeOptions['palette']) => {
    const themeOptions = {
        palette,
        sidebar: {
            width: 170,
            closeWidth: 70,
        },
    };
    const theme = createTheme(themeOptions);
    theme.components = componentsOverrides(theme);
    return theme;
};

export const themeProvider = () => {
    return createApplicationTheme(palette);
};

export default themeProvider;
