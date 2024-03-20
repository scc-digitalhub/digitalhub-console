import {
    Button,
    Labeled,
    ShowBase,
    ShowView,
    SimpleShowLayout,
    TextField,
    useRecordContext,
    useTranslate,
    useDataProvider,
    LoadingIndicator,
    useNotify,
    DeleteWithConfirmButton,
    EditButton,
    TopToolbar,
} from 'react-admin';
import {
    Container,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Typography,
} from '@mui/material';

import { memo, useEffect, useState } from 'react';
import { arePropsEqual } from '../../common/helper';

import { useRootSelector } from '@dslab/ra-root-selector';
import { ShowPageTitle } from '../../components/PageTitle';
import { FlatCard } from '../../components/FlatCard';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { SecretIcon } from './icon';

const ShowComponent = () => {
    const record = useRecordContext();

    return <SecretShowLayout record={record} />;
};
export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <EditButton style={{ marginLeft: 'auto' }} />
        <InspectButton />
        <ExportRecordButton language="yaml" color="info" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

export const SecretShowLayout = memo(function SecretShowLayout(props: {
    record: any;
}) {
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const [value, setValue] = useState<string>('');
    const translate = useTranslate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [open, setOpen] = useState(false);

    const notify = useNotify();
    const { record } = props;
    const kind = record?.kind || undefined;
    useEffect(() => {
        showData(false);
    }, []);

    function SimpleDialog(props: SimpleDialogProps) {
        const { onClose, selectedValue, open } = props;

        const handleClose = () => {
            onClose(selectedValue);
        };
        return (
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>{translate('resources.secrets.title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText
                        sx={{ color: 'black', fontWeight: 'bold' }}
                    >
                        {value}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        );
    }
    const handleClose = (value: string) => {
        setValue('');
        setOpen(false);
    };
    const showData = async (show: boolean) => {
        if (show)
            dataProvider
                .getSecretData({ keys: record.name, root })
                .then(({ data }) => {
                    if (show) {
                        setValue(data);
                        setOpen(true);
                    } else setValue('');
                    setLoading(false);
                })

                .catch(error => {
                    setError(error);
                    notify(`Error getting secret: ${error.message}`, {
                        type: 'error',
                    });
                    setValue('');
                    setLoading(false);
                });
        else {
            setValue('');
            setLoading(false);
        }
    };
    if (loading) return <LoadingIndicator />;
    if (!record) return <></>;
    return (
        <SimpleShowLayout record={record}>
            <Typography variant="h6" gutterBottom>
                {translate('resources.secrets.title')}
            </Typography>
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Labeled label="My Label">
                        <TextField source="name" />
                    </Labeled>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        label={translate('resources.secrets.showData')}
                        onClick={() => showData(!value)}
                    />
                    <SimpleDialog
                        selectedValue={value}
                        open={open}
                        onClose={handleClose}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Labeled label="My Label">
                        <TextField source="spec.path" />
                    </Labeled>
                </Grid>
                <Grid item xs={6}>
                    <Labeled label="My Label">
                        <TextField source="spec.provider" />
                    </Labeled>
                </Grid>
            </Grid>
        </SimpleShowLayout>
    );
},
arePropsEqual);

export const SecretShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBase>
                <>
                    <ShowPageTitle icon={<SecretIcon fontSize={'large'} />} />
                    <ShowView
                        actions={<ShowToolbar />}
                        sx={{
                            width: '100%',
                            '& .RaShow-main': {
                                display: 'grid',
                                gridTemplateColumns: { lg: '1fr 350px' },
                                gridTemplateRows: {
                                    xs: 'repeat(1, 1fr)',
                                    lg: '',
                                },
                                gap: 2,
                            },
                        }}
                        component={FlatCard}
                    >
                        <ShowComponent />
                    </ShowView>
                </>
            </ShowBase>
        </Container>
    );
};
