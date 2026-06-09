// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Fragment,
    ReactElement,
    useCallback,
    useEffect,
    useState,
} from 'react';
import {
    Button,
    ButtonProps,
    LoadingIndicator,
    RaRecord,
    Identifier,
    useRecordContext,
    useTranslate,
    useDataProvider,
    useList,
    Datagrid,
    ListContextProvider,
    TextField,
    TextInput,
    Toolbar,
    Create,
    SaveButton,
    Form,
    FunctionField,
    ResourceContextProvider,
    regex,
} from 'react-admin';
import {
    Breakpoint,
    DialogContent,
    DialogTitle,
    IconButton,
    Grid,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import { ShareDialog, StyledDialogClasses } from '../../theme/StyledDialog';

const defaultIcon = <ShareIcon />;

export const ShareProjectButton = (props: ShareButtonProps) => {
    const {
        label = 'actions.share',
        icon = defaultIcon,
        fullWidth = true,
        maxWidth = 'md',
        color = 'info',
        record: recordFromProps,
        ...rest
    } = props;
    const translate = useTranslate();
    const [open, setOpen] = useState(false);
    const recordContext = useRecordContext();
    const record = recordFromProps || recordContext;

    const isLoading = !record;

    const handleDialogOpen = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = e => {
        e.stopPropagation();
        setOpen(false);
    };

    const handleClick = useCallback(e => {
        e.stopPropagation();
    }, []);

    return (
        <Fragment>
            <Button
                label={label}
                onClick={handleDialogOpen}
                color={color}
                {...rest}
            >
                {icon}
            </Button>
            <ShareDialog
                open={open}
                onClose={handleDialogClose}
                onClick={handleClick}
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                aria-labelledby="share-dialog-title"
                className={StyledDialogClasses.dialog}
            >
                <div className={StyledDialogClasses.header}>
                    <DialogTitle
                        id="share-dialog-title"
                        className={StyledDialogClasses.title}
                    >
                        {typeof label === 'string' ? translate(label) : label}
                    </DialogTitle>
                    <IconButton
                        className={StyledDialogClasses.closeButton}
                        aria-label={translate('ra.action.close')}
                        title={translate('ra.action.close')}
                        onClick={handleDialogClose}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>

                <DialogContent className={StyledDialogClasses.content}>
                    {isLoading ? (
                        <LoadingIndicator />
                    ) : (
                        <ShareList record={record} />
                    )}
                </DialogContent>
            </ShareDialog>
        </Fragment>
    );
};

const ShareList = (props: { record?: any }) => {
    const { record: recordFromProps } = props;
    const recordContext = useRecordContext();
    const dataProvider = useDataProvider();
    const translate = useTranslate();

    const record = recordFromProps || recordContext;
    const [data, setData] = useState<any[]>([]);
    const listContext = useList({ data });

    const reload = () => {
        if (record) {
            dataProvider
                .getShareList('projects', { id: record.id })
                .then(json => {
                    if (json) {
                        setData(json);
                    }
                });
        }
    };

    const handleRevoke = data => {
        return function (event) {
            if (data?.id) {
                dataProvider
                    .deleteShare('projects', {
                        id: record.id,
                        meta: { id: data.id },
                    })
                    .then(() => {
                        reload();
                    });
            }

            event.stopPropagation();
        };
    };

    useEffect(() => {
        reload();
    }, [record]);

    return (
        <>
            <Typography variant="body2">
                {translate('pages.share.description')}
            </Typography>
            <ShareCreateForm record={record} reload={reload} />
            <ResourceContextProvider value="users">
                <ListContextProvider value={listContext}>
                    <Datagrid bulkActionButtons={false} rowClick={false}>
                        <TextField source="user" sortable={false} />
                        <FunctionField
                            render={r => (
                                <Button
                                    label="actions.revoke"
                                    onClick={handleRevoke(r)}
                                    startIcon={<CancelIcon />}
                                    color="error"
                                />
                            )}
                        />
                    </Datagrid>
                </ListContextProvider>
            </ResourceContextProvider>
        </>
    );
};

const ShareCreateForm = (props: { record?: any; reload: () => void }) => {
    const { record: recordFromProps, reload } = props;
    const recordContext = useRecordContext();
    const dataProvider = useDataProvider();

    const record = recordFromProps || recordContext;
    const onSubmit = data => {
        if (record) {
            dataProvider
                .createShare('projects', {
                    id: record.id,
                    meta: { user: data.user.trim() },
                })
                .then(() => {
                    reload();
                });
        }
    };
    const userPattern = /^[a-zA-Z0-9!#$%&@'*+/=?^_`{|}~.-]+$/;
    const validateUser = regex(userPattern, 'messages.validation.wrongChar');

    return (
        <Create record={{}} component={Toolbar}>
            <Form onSubmit={onSubmit}>
                <Grid container>
                    <Grid size={10}>
                        <TextInput
                            source="user"
                            label="fields.user.title"
                            helperText="fields.user.description"
                            fullWidth
                            validate={validateUser}
                        />
                    </Grid>
                    <Grid size={2} pt={1}>
                        <SaveButton
                            label="ra.action.add"
                            variant="text"
                            icon={<AddIcon />}
                        />
                    </Grid>
                </Grid>
            </Form>
        </Create>
    );
};

export type ShareButtonProps<RecordType extends RaRecord = any> =
    ButtonProps & {
        /**
         * (Optional) ref id, by default uses record.id
         */
        id?: Identifier;
        /**
         * (Optional) Custom icon for the button
         */
        icon?: ReactElement;
        /**
         * (Optional) record object to use in place of the context
         */
        record?: RecordType;
        /**
         * (Optional) resource identifier to use in place of the context
         */
        resource?: string;
        /**
         * Display the modal window as full-width, filling the viewport. Defaults to `false`
         */
        fullWidth?: boolean;
        /**
         * Max width for the modal window (breakpoint). Defaults to `md`
         */
        maxWidth?: Breakpoint;
    };
