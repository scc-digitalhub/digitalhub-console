import {
    Button,
    Labeled,
    Show,
    ShowBase,
    ShowView,
    SimpleShowLayout,
    TextField,
    useRecordContext,
    useTranslate,
    useDataProvider,
    Loading,
    Error,
    LoadingIndicator,
    useNotify,
    List,
} from 'react-admin';
import {
    Avatar,
    Container,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import { MetadataSchema } from '../../common/types';
import {
    Aside,
    //Aside
    PostShowActions,
} from '../../components/helper';
import { memo, useEffect, useState } from 'react';
import { arePropsEqual } from '../../common/helper';
import { ShowOutlinedCard } from '../../components/OutlinedCard';
import { ShowPageTitle } from '../../components/pageTitle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRootSelector } from '@dslab/ra-root-selector';
import { blue } from '@mui/material/colors';

const ShowComponent = () => {
    const record = useRecordContext();

    return <SecretShowLayout record={record} />;
};
export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

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
                <DialogTitle>{translate('resources.secret.title')}</DialogTitle>
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
                    notify(`Comment approval error: ${error.message}`, {
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
                {translate('resources.secret.title')}
            </Typography>
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Labeled label="My Label">
                        <TextField source="name" />
                    </Labeled>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        label={translate('resources.secret.showData')}
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
                    <ShowPageTitle
                        icon={<VisibilityIcon fontSize={'large'} />}
                    />
                    <ShowView
                        actions={<PostShowActions />}
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
                        component={ShowOutlinedCard}
                    >
                        <ShowComponent />
                    </ShowView>
                </>
            </ShowBase>
        </Container>
    );
};
