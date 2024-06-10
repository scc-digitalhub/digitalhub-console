import {
    RootResourceSelectorMenu,
    useRootSelector,
} from '@dslab/ra-root-selector';
import {
    AppBar,
    AutocompleteArrayInput,
    CheckboxGroupInput,
    ReferenceArrayInput,
    TextInput,
    ToggleThemeButton,
    useRedirect,
    useTranslate,
} from 'react-admin';
import { Button, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import { DateIntervalInput } from '../search/DateIntervalInput';
import SearchBar from '../search/searchbar/SearchBar';
import { useContext } from 'react';
import { SearchEnabledContext } from '../App';

const APP_VERSION: string =
    (globalThis as any).REACT_APP_VERSION ||
    (process.env.REACT_APP_VERSION as string);
const docsVersion = APP_VERSION
    ? APP_VERSION.replace(new RegExp(/\.[^/.]+$/), '')
    : undefined;

const convertToDateString = (date: Date) => {
    let day: string | number = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let month: string | number = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
};

const filters = [
    <CheckboxGroupInput
        source="type"
        choices={[
            { id: 'function', name: 'Function' },
            { id: 'dataitem', name: 'DataItem' },
            { id: 'artifact', name: 'Artifact' },
            { id: 'workflow', name: 'Workflow' },
            { id: 'model', name: 'Model' },
        ]}
        label="Type"
        key={1}
        helperText={false}
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
        fullWidth
        key={2}
        helperText={false}
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
        fullWidth
        key={3}
        helperText={false}
        defaultValue=""
        parse={v => {
            if (!(v.startsWith('"') && v.endsWith('"'))) {
                v = `"${v}"`;
            }
            return 'metadata.description:' + v;
        }}
        format={v => v.split(':')[1].split('"')[0]}
    />,
    <ReferenceArrayInput
        source="metadata.labels"
        reference="labels"
        key={4}
        defaultValue={[]}
        parse={v => {
            return `metadata.labels:(${v.join(' AND ')})`;
        }}
        format={v => {
            const startIndex = v.indexOf('(');
            const endIndex = v.indexOf(')');
            return v.substring(startIndex + 1, endIndex).split(' AND ');
        }}
    >
        <AutocompleteArrayInput
            label="Labels"
            filterToQuery={searchText => ({ label: searchText })}
            optionText="label"
            optionValue="label"
            disablePortal={true}
            fullWidth
            helperText={false}
        />
    </ReferenceArrayInput>,
    <DateIntervalInput
        source="metadata.updated"
        alwaysOn
        key={5}
        helperText={false}
        defaultValue={','}
        parse={v => {
            let from = '*';
            const dates = v.split(',');
            if (dates[0]?.length > 0) {
                const fromDate = new Date(`${dates[0]}T00:00:00.000`);
                from = `"${fromDate.toISOString()}"`;
            }
            let to = '*';
            if (dates[1]?.length > 1) {
                const toDate = new Date(`${dates[1]}T23:59:59.000`);
                to = `"${toDate.toISOString()}"`;
            }
            return `metadata.updated:[${from} TO ${to}]`;
        }}
        format={v => {
            let dateList: string[] = [];
            let startIndex = v.indexOf('metadata.updated:[');
            let endIndex = v.indexOf(' TO');
            const from = v.substring(startIndex + 1, endIndex);
            if (from !== '*') {
                //remove quotes and add to list
                dateList.push(
                    convertToDateString(
                        new Date(from.substring(1, from.length - 1))
                    )
                );
            }

            startIndex = v.indexOf('TO ');
            endIndex = v.indexOf(']');
            const to = v.substring(startIndex + 1, endIndex);
            if (to !== '*') {
                //remove quotes and add to list
                dateList.push(
                    convertToDateString(
                        new Date(to.substring(1, to.length - 1))
                    )
                );
            }

            return dateList.join(',');
        }}
    />,
];

export const MyAppBar = () => {
    const { root: projectId } = useRootSelector();
    const redirect = useRedirect();

    const translate = useTranslate();

    const enableSearch = useContext(SearchEnabledContext);

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
                {/* {projectId} */}
                <RootResourceSelectorMenu
                    source="name"
                    showSelected={true}
                    icon={false}
                />
            </Typography>
            {enableSearch && (
                <SearchBar
                    hintText="Search"
                    to="searchresults"
                    filters={filters}
                    filterSeparator=":"
                />
            )}

            {docsVersion && (
                <Button
                    color="inherit"
                    href={
                        'https://scc-digitalhub.github.io/docs/' + docsVersion
                    }
                    target="_blank"
                >
                    <HelpCenterIcon />
                </Button>
            )}
        </AppBar>
    );
};
