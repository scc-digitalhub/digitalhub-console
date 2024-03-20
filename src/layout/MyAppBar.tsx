import {
    RootResourceSelectorMenu,
    useRootSelector,
} from '@dslab/ra-root-selector';
import { AppBar, useRedirect, useTranslate } from 'react-admin';
import { Button, IconButton, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';


export const MyAppBar = () => {
    const { root: projectId } = useRootSelector();
    const redirect = useRedirect();

    const translate = useTranslate();

    return (
        <AppBar color="primary" elevation={0}>
            <Typography
                flex="1"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                variant="h6"
                color="inherit"
            >
                {projectId}
            </Typography>
            <Button color="inherit" onClick={() => redirect('/')} startIcon={<HomeIcon />}>
                {translate('bar.backProjects')}
             </Button>
             
            <RootResourceSelectorMenu source="name" showSelected={false} />
        </AppBar>
    );
};
