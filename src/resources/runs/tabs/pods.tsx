import { Divider, Stack } from '@mui/material';
import {
    DateField,
    Labeled,
    RecordContextProvider,
    TextField,
} from 'react-admin';
import { ConditionsList } from './conditions';
import { TypeChips } from '../../../components/TypeChips';

export default function PodsTab(props: { record: any }) {
    const { record } = props;
    const pod = record?.status.pods[0];
    console.log('PodsTab pod:', record);

    return (
        <Stack spacing={3} >
            <RecordContextProvider value={pod}>
                <Labeled>
                    <TextField source="name" label="fields.name.title" />
                </Labeled>
                <Labeled>
                    <DateField source="startTime" showTime label="fields.startTime.title"
                    />
                </Labeled>
                 <Labeled>
                    <TextField source="phase" label="fields.phase.title" />
                </Labeled>
                   
                 <Labeled>
                    <TextField source="namespace" label="fields.namespace.title" />
                </Labeled>
            </RecordContextProvider>
             <Divider />
              <Labeled width={100}>
                    <TypeChips
                        source="status.state"
                        label="fields.status.state"
                    />
                </Labeled>
            {pod?.conditions && <ConditionsList record={record}/>}
        </Stack>
    );
}