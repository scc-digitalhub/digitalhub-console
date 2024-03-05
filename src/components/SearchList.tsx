import {
    Datagrid,
    Loading,
    TextField,
    Error,
    useList,
    ListContextProvider,
    Pagination,
    SortPayload,
    ShowButton,
    useRecordContext,
} from 'react-admin';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import TableChartIcon from '@mui/icons-material/TableChart';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useSearch } from '@dslab/ra-search-bar';
import { useEffect, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { RowButtonGroup } from './RowButtonGroup';
import Card from '@mui/material/Card';
import { Container, Tooltip } from '@mui/material';

const mapTypes = {
    function: {plural:'functions',icon:<Tooltip title="function"><ElectricBoltIcon /></Tooltip>},
    artifact:  {plural:'artifacts',icon:<Tooltip title="artifact"><TableChartIcon /></Tooltip>},
    dataitem:  {plural:'dataitems',icon:<Tooltip title="dataitem"><InsertDriveFileIcon /></Tooltip>}
};
export const SearchList = () => {
    const { params: searchParams, setParams, provider } = useSearch();
    console.log('context', searchParams);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(50);
    const [total, setTotal] = useState(1000);
    const [results, setResults] = useState<[]>([]);
    const [paginationState, setPaginationState] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const { root } = useRootSelector();

    useEffect(() => {
        let newSearch = JSON.parse(
            JSON.stringify(searchParams)
        ) as typeof searchParams;
        const params = {
            pagination: { page, perPage },
            sort: { field: 'updated', order: 'DESC' } as SortPayload,
            filter: {},
        };
        if (!newSearch.fq) {
            newSearch.fq = [];
        }
        newSearch.fq.push({ filter: `project:${root}` });
        provider
            .search(newSearch, params)
            .then(({ data }) => {
                setResults(data.content);
                setPerPage(data.pageable.pageSize);
                setTotal(data.totalElements);
                setPage(data.pageable.pageNumber);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [provider, searchParams, root]);

    const listContext = useList({
        data: results,
        isLoading: loading,
        page,
        perPage,
    });

    if (loading) return <Loading />;
    if (error) return <Error />;
    if (!results) return null;

    console.log('results', results);

    return (
        <ListContextProvider value={listContext}>
            <Container>
                    <Datagrid
                        bulkActionButtons={false}
                        className="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation1 MuiCard-root RaList-content css-bhp9pd-MuiPaper-root-MuiCard-root"
                    >
                        <IconResource />
                        {/* <TextField source="type" label="Type"/> */}
                        <TextField source="metadata.name" label="Name"/>
                        <TextField source="kind" label="Kind"/>
                        <TextField source="metadata.description"label="Description" />
                        <TextField source="metadata.updated" label="Updated"/>
                        <RowButtonGroup>
                            <ShowResourceButton />
                        </RowButtonGroup>
                    </Datagrid>
                    <Pagination />
            </Container>
        </ListContextProvider>
    );
};

 const ShowResourceButton = () => {
    const record = useRecordContext();
    return <ShowButton resource={mapTypes[record.type].plural} />;
};
const IconResource = () => {
    const record = useRecordContext();
    return <>{mapTypes[record.type].icon}</>;
};
