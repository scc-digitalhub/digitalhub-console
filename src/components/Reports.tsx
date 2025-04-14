import {
    ChipField,
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    Identifier,
    Labeled,
    ListView,
    RaRecord,
    ShowButton,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useGetResourceLabel,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { Stack, Typography, Box } from '@mui/material';
import get from 'lodash/get';

import {
    CreateInDialogButton,
    EditInDialogButton,
    ShowInDialogButton,
} from '@dslab/ra-dialog-crud';
import { InspectButton } from '@dslab/ra-inspect-button';
import { RowButtonGroup } from './buttons/RowButtonGroup';
import { StateChips } from './StateChips';
import { LogsButton } from './buttons/LogsButton';
import { filterProps } from '../common/schemas';
import { useGetManySchemas } from '../controllers/schemaController';
import { Empty } from './Empty';
import { ReactElement } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { StopButton } from '../resources/runs/StopButton';
import { DropDownButton } from './buttons/DropdownButton';
import { ReportCreate } from '../resources/reports/create';
import { BulkDeleteAllVersionsButton } from './buttons/BulkDeleteAllVersionsButton';
import { ListBaseLive } from './ListBaseLive';
import { ReportEdit } from '../resources/reports';

export const Reports = ({ entity_type }: { entity_type?: string }) => {

    return (
        <>
            <ReportList entity_type={entity_type}/>
        </>
    );
};

const ReportList = ({ entity_type }: { entity_type?: string }) => {
    const record = useRecordContext();
    const getResourceLabel = useGetResourceLabel();
    const label = getResourceLabel('reports', 2);

    const key = `${record.kind}://${record.project}/${record.id}`;

    const { data: schemas } = useGetManySchemas([
        { resource: 'reports' },
    ]);

    const partial = {
        project: record?.project,
        spec: {
            entity: record.id,
            entity_type,
        },
    };

    const prepare = (r: any) => {
        console.log('perpare', r);
        return {
            ...r,
            spec: {
                entity: record.id,
                entity_type,
                    //copy the task spec  (using form)
                ...r.spec,
            },
        };
    };

    const CreateActionButton = (props: {
        record?: any;
        label?: string;
        icon?: ReactElement;
    }) => {
        const { record, label, icon } = props;
        return (
            <CreateInDialogButton
                resource="reports"
                label={label}
                icon={icon}
                record={record}
                fullWidth
                maxWidth={'lg'}
                transform={prepare}
            >
                    <ReportCreate
                    />
            </CreateInDialogButton>
        );
    };

    return (
        <>
            <Typography variant="h4" color={'secondary.main'}>
                {label}
            </Typography>

            <ListBaseLive
                resource="reports"
                sort={{ field: 'created', order: 'DESC' }}
                filter={{ task: key }}
                disableSyncWithLocation
            >
                <ListView
                    component={Box}
                    empty={
                        <Empty>
                            <CreateActionButton record={partial} />
                        </Empty>
                    }
                    actions={<CreateActionButton record={partial} />}
                >
                    <Datagrid
                        bulkActionButtons={<BulkDeleteAllVersionsButton />}
                        rowClick={false}>
                        <DateField
                            source="metadata.created"
                            showTime
                            label="fields.metadata.created"
                        />
                        <TextField source="name" sortable={true} />                        
                        <TextField source="kind" sortable={true} />
                        <TestStatusChips
                            source="spec.status"
                            sortable={false}
                            label="fields.spec.status"
                        />
                        <RowButtonGroup>
                            <DropDownButton>
                                <ShowButton />
                                <EditActionButton />
                                <InspectButton fullWidth />
                                <DeleteWithConfirmButton redirect={false} />
                            </DropDownButton>
                        </RowButtonGroup>
                    </Datagrid>
                </ListView>
            </ListBaseLive>
        </>
    );
};

const EditActionButton = (props: {
    label?: string;
    icon?: ReactElement;
}) => {
    const { label, icon } = props;
    return (
        <EditInDialogButton
            resource="reports"
            label={label}
            icon={icon}
            fullWidth
            maxWidth={'lg'}>
                <ReportEdit />
        </EditInDialogButton>
    );
};

export const TestStatusChips = (props: {
    resource?: string;
    record?: RaRecord<Identifier>;
    source: string;
    label?: string;
    sortable?: boolean;
}) => {
    const { source, ...rest } = props;
    const translate = useTranslate();
    const record = useRecordContext(rest);
    const value = get(record, source)?.toString();
    if (!record || !value) {
        return <></>;
    }

    const r = {
        value: translate('test.status.' + value.toLowerCase()).toUpperCase(),
    };

    return <ChipField record={r} source={'value'} color={StateColors[value]} />;
};

export enum StateColors {
    SUCCESS = 'success',
    FAILURE = 'error',
    ERROR = 'error',
    UNKNOWN = 'info',

}
