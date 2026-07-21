import { styled, alpha } from '@mui/material/styles';

export const StyledQueryEditorWrapper = styled('div')(({ theme }) => {
    const isDark = theme.palette.mode === 'dark';
    return {
        color: theme.palette.text.primary,
        background: theme.palette.background.paper,
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,

        '& .trino-query-ui': {
            borderRadius: theme.shape.borderRadius,
            height: '100%',
            fontFamily: theme.typography.fontFamily,
        },

        // Catalog sidebar drawer
        '& .MuiDrawer-paper': {
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
        },

        // Tree view items in catalog
        '& .MuiTreeItem-content': {
            borderRadius: theme.shape.borderRadius,
            '&:hover': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    isDark ? 0.12 : 0.06
                ),
            },
            '&.Mui-selected': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    isDark ? 0.2 : 0.1
                ),
            },
        },

        // Data grid results
        '& .MuiDataGrid-root': {
            fontFamily: theme.typography.fontFamily,
            border: 'none',
        },
        '& .MuiDataGrid-columnHeaders': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                isDark ? 0.12 : 0.05
            ),
            color: theme.palette.text.primary,
            fontWeight: 600,
        },
        '& .MuiDataGrid-row:hover': {
            backgroundColor: alpha(
                theme.palette.primary.main,
                isDark ? 0.08 : 0.04
            ),
        },

        // Buttons
        '& .MuiButton-containedPrimary': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            borderRadius: theme.shape.borderRadius,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
                backgroundColor: theme.palette.primary.dark,
            },
        },
        '& .MuiButton-outlinedPrimary, & .MuiButton-outlined': {
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            borderRadius: theme.shape.borderRadius,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                borderColor: theme.palette.primary.dark,
            },
        },

        // Tabs
        '& .MuiTab-root': {
            textTransform: 'none',
        },
        '& .MuiTab-root.Mui-selected': {
            color: theme.palette.primary.main,
        },
        '& .MuiTabs-indicator': {
            backgroundColor: theme.palette.primary.main,
        },

        // Input fields
        '& .MuiOutlinedInput-root': {
            borderRadius: theme.shape.borderRadius,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
            },
        },

        // IconButtons
        '& .MuiIconButton-root:hover': {
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
    };
});
