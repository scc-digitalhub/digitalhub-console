import {
    Datagrid,
    DateField,
    Labeled,
    ListContextProvider,
    TextField,
    useList,
} from 'react-admin';
import { StateChips } from '../../../components/StateChips';

export const EventsList = (props: { record: any }) => {
    const { record } = props;
    const data = record?.status?.transitions ? record.status.transitions : [];
    const listContext = useList({ data });
    return (
        <Labeled label="fields.events.title">
            <ListContextProvider value={listContext}>
                <Datagrid bulkActionButtons={false} rowClick={false}>
                    <DateField
                        showTime
                        source="time"
                        label="fields.events.time.title"
                    />
                    <StateChips
                        source="status"
                        sortable={false}
                        label="fields.events.status.title"
                    />
                    <TextField
                        source="message"
                        sortable={false}
                        label="fields.events.message.title"
                    />
                    <TextField
                        source="details"
                        sortable={false}
                        label="fields.events.details.title"
                    />
                </Datagrid>
            </ListContextProvider>
        </Labeled>
    );
};
