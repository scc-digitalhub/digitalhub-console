import {
    RootResourceSelectorMenu,
    useRootSelector,
} from '@dslab/ra-root-selector';
import {
    AppBar,
    CheckboxGroupInput,
    TextInput,
    useRedirect,
    useTranslate,
} from 'react-admin';
import { Button, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import { SearchBar } from '@dslab/ra-search-bar';

const filters = [
    <CheckboxGroupInput
        source="type"
        choices={[
            { id: 'function', name: 'Function' },
            { id: 'dataitem', name: 'DataItem' },
            { id: 'artifact', name: 'Artifact' },
        ]}
        label="Type"
        key={1}
        defaultValue={[]}
        parse={v => {
            //v=['function', 'dataitem']
            //return type:(function OR dataitem)
            return `type:(${v.join(' OR ')})`;
        }}
        format={v => {
            //v=type:(function OR dataitem)
            //return ['function', 'dataitem']
            const startIndex = v.indexOf('(');
            const endIndex = v.indexOf(')');
            return v.substring(startIndex + 1, endIndex).split(' OR ');
        }}
    />,
    <TextInput
        label="Name"
        source="metadata.name"
        alwaysOn
        key={2}
        defaultValue=""
        parse={v => {
            if (!(v.startsWith('"') && v.endsWith('"'))) {
                v = `"${v}"`;
            }
            return 'metadata.name:' + v;
        }}
        format={v => v.split(':')[1].split('"')[0]}
    />,
    <TextInput
        label="Description"
        source="metadata.description"
        alwaysOn
        key={3}
        defaultValue=""
        parse={v => {
            if (!(v.startsWith('"') && v.endsWith('"'))) {
                v = `"${v}"`;
            }
            return 'metadata.description:' + v;
        }}
        format={v => v.split(':')[1].split('"')[0]}
    />,
    <TextInput
        label="Version"
        source="metadata.version"
        alwaysOn
        key={4}
        defaultValue=""
        parse={v => {
            if (!(v.startsWith('"') && v.endsWith('"'))) {
                v = `"${v}"`;
            }
            return 'metadata.version:' + v;
        }}
        format={v => v.split(':')[1].split('"')[0]}
    />,
    <TextInput
        label="Labels"
        source="metadata.labels"
        alwaysOn
        key={5}
        defaultValue=""
        parse={v => {
            return `metadata.labels:(${v.split(',').join(' AND ')})`;
        }}
        format={v => {
            const startIndex = v.indexOf('(');
            const endIndex = v.indexOf(')');
            return v
                .substring(startIndex + 1, endIndex)
                .split(' AND ')
                .join(',');
        }}
    />,
];

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
            <SearchBar
                hintText="Search"
                to="searchresults"
                filters={filters}
                filterSeparator=":"
            ></SearchBar>
            <Button
                color="inherit"
                onClick={() => redirect('/')}
                startIcon={<HomeIcon />}
            >
                {translate('bar.backProjects')}
            </Button>
            <RootResourceSelectorMenu source="name" showSelected={false} />
        </AppBar>
    );
};
