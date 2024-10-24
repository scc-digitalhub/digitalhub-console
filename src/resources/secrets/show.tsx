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
    useNotify,
    DeleteWithConfirmButton,
    EditButton,
    TopToolbar,
} from 'react-admin';
import { Container, Stack, Typography } from '@mui/material';
import { MouseEvent } from 'react';
import { useEffect, useState } from 'react';

import { useRootSelector } from '@dslab/ra-root-selector';
import { ShowPageTitle } from '../../components/PageTitle';
import { FlatCard } from '../../components/FlatCard';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { SecretIcon } from './icon';
import HideIcon from '@mui/icons-material/VisibilityOff';
import ShowIcon from '@mui/icons-material/Visibility';
import { IdField } from '../../components/IdField';

const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <EditButton style={{ marginLeft: 'auto' }} />
        <InspectButton />
        <ExportRecordButton language="yaml" color="info" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

const ShowComponent = () => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const record = useRecordContext();

    const [value, setValue] = useState<string>('');
    const [show, setShow] = useState<boolean>(false);

    const notify = useNotify();

    const toggleLabel = translate('actions.toggle_x', {
        el: translate('fields.secrets.title'),
    });

    const loadData = () => {
        if (record) {
            dataProvider
                .readSecretData(record.name, { root })
                .then(({ data }) => {
                    if (typeof data === 'string') {
                        setValue(data);
                    } else if (typeof data === 'object') {
                        if (record.name in data) {
                            setValue(data[record.name] || '');
                        }
                    }
                })
                .catch(error => {
                    setValue('');
                    const e =
                        typeof error === 'string'
                            ? error
                            : error.message || 'error';
                    notify(e);
                });
        }
    };

    const toggle = () => {
        setShow(v => !v);
    };

    useEffect(() => {
        loadData();
    }, [record]);

    if (!record) return <></>;

    return (
        <SimpleShowLayout record={record}>
            <Stack direction={'row'} spacing={3}>
                <Labeled>
                    <TextField source="kind" />
                </Labeled>

                <Labeled>
                    <IdField source="id" />
                </Labeled>
            </Stack>
            <Labeled>
                <IdField source="key" />
            </Labeled>

            <Typography component="h5" variant="h5" pt={2}>
                {translate('fields.secrets.title')}
            </Typography>
            <Stack direction={'row'} spacing={3}>
                <Labeled>
                    <TextField source="spec.provider" />
                </Labeled>
                <Labeled>
                    <TextField source="spec.path" />
                </Labeled>
            </Stack>
            <Stack direction={'row'} spacing={3}>
                <Labeled>
                    <TextField source="name" label="fields.key.title" />
                </Labeled>

                <Labeled label="fields.value.title">
                    <Typography
                        component="span"
                        variant="body2"
                        sx={{ background: 'lightgray', paddingX: '2px' }}
                        fontFamily={'monospace'}
                    >
                        {show ? value : '*******************'}
                    </Typography>
                </Labeled>
            </Stack>

            <Button
                onClick={(event: MouseEvent<HTMLElement>) => {
                    event.stopPropagation();
                    toggle();
                }}
                color="error"
                variant="contained"
                label={toggleLabel}
                startIcon={
                    show ? (
                        <HideIcon fontSize="small" />
                    ) : (
                        <ShowIcon fontSize="small" />
                    )
                }
            />
        </SimpleShowLayout>
    );
};

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
