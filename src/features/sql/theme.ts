import { styled, alpha } from '@mui/material/styles';

export const StyledQueryEditorWrapper = styled('div')(({ theme }) => {
  const isDark = theme.palette.mode === 'dark';
  return {
    color: theme.palette.text.primary,
    background: theme.palette.background.paper,
    '& .trino-query-ui': {
      borderRadius: theme.shape.borderRadius,
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
        backgroundColor: alpha(theme.palette.secondary.main, 0.05),
      },
    },

    // Data grid results
    '& .MuiDataGrid-root': {
      fontFamily: '"Open Sans", sans-serif',
      border: 'none',
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.secondary.main,
      fontWeight: 600,
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        isDark ? 0.06 : 0.04
      ),
    },

    // Buttons 
    '& .MuiButton-outlinedPrimary, & .MuiButton-outlined': {
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, 0.08),
        borderColor: theme.palette.primary.dark,
      },
    },

    // Tabs
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
