import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const toRepositoryAssetUrl = (
    repository?: string,
    assetName?: string
): string | null => {
    if (!repository || !assetName) return null;

    const ghTreeMatch = repository.match(
        /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)(?:\/(.+))?$/
    );

    if (ghTreeMatch) {
        const [, owner, repo, branch, path] = ghTreeMatch;
        const basePath = path ? `/${path}` : '';
        return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}${basePath}/${assetName}`;
    }

    return `${repository.replace(/\/$/, '')}/${assetName}`;
};

export const MarkdownContainer = styled(Box)(({ theme }) => ({
    color: theme.palette.text.primary,
    width: '100%',
    minWidth: 0,
    overflowX: 'hidden',

    '& *': {
        maxWidth: '100%',
        boxSizing: 'border-box',
    },
    '& h1': {
        ...theme.typography.h4,
        margin: theme.spacing(1, 0),
    },
    '& h2': {
        ...theme.typography.h5,
        margin: theme.spacing(2, 0, 1, 0),
    },
    '& h3': {
        ...theme.typography.h6,
        margin: theme.spacing(2, 0, 1, 0),
    },
    '& p, & li': {
        ...theme.typography.body1,
        marginBottom: theme.spacing(1.5),
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
    },
    '& a': {
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
    },
    '& code': {
        fontFamily: 'monospace',
        backgroundColor: theme.palette.action.hover,
        padding: theme.spacing(0.2, 0.6),
        borderRadius: theme.shape.borderRadius,
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
    },
    '& pre': {
        maxWidth: '100%',
        backgroundColor: theme.palette.action.hover,
        padding: theme.spacing(1.5),
        borderRadius: theme.shape.borderRadius,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
        wordBreak: 'break-all',
        overflowX: 'hidden',

        '& code': {
            backgroundColor: 'transparent',
            padding: 0,
        },
    },
    '& table': {
        width: '100%',
        tableLayout: 'fixed',
        borderCollapse: 'collapse',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
    },
    '& td, & th': {
        border: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(1),
    },
}));
