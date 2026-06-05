// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    useRecordContext,
    Button,
    FieldProps,
    ButtonProps,
    RaRecord,
    useTranslate,
} from 'react-admin';
import SignpostIcon from '@mui/icons-material/Signpost';
import CloseIcon from '@mui/icons-material/Close';
import BrowserIcon from '@mui/icons-material/TravelExplore';
import {
    Fragment,
    ReactElement,
    useCallback,
    useMemo,
    useState,
    SyntheticEvent,
} from 'react';

import {
    Breakpoint,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    styled,
    Typography,
    Stack,
    Switch,
    FormControlLabel,
} from '@mui/material';

import { StandardHttpClient } from './StandardHttpClient';
import { InferenceV2Client } from './InferenceV2Client';
import { ChatClient } from '../chat/ChatClient';
import { BrowserClient } from './BrowserClient';

const defaultIcon = <SignpostIcon />;

export type ClientButtonMode = 'http' | 'chat' | 'v2' | 'browser';

export interface ClientButtonProps<RecordType extends RaRecord = any>
    extends Omit<FieldProps<RecordType>, 'source'>,
        Omit<ButtonProps, 'variant' | 'label'> {
    icon?: ReactElement;
    fullWidth?: boolean;
    maxWidth?: Breakpoint;
    mode?: ClientButtonMode;
    label?: string;
}

export const ClientButton = (props: ClientButtonProps) => {
    const {
        color = 'secondary',
        label: labelProps,
        icon: iconProps,
        fullWidth = true,
        maxWidth = 'lg',
        mode = 'http',
        disabled,
        ...rest
    } = props;

    const translate = useTranslate();
    const [open, setOpen] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);

    const record = useRecordContext(props);
    const urls = useMemo<string[]>(() => {
        const serviceUrls: string[] = [];
        if (record?.status?.service) {
            if (record.status?.service?.url) {
                serviceUrls.push(record.status.service.url);
            }
            if (record.status?.service?.urls) {
                serviceUrls.push(...record.status.service.urls);
            }
        }
        return serviceUrls;
    }, [record]);

    const handleDialogOpen = (e: SyntheticEvent) => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = (e: SyntheticEvent) => {
        e.stopPropagation();
        setOpen(false);
    };

    const handleClick = useCallback((e: SyntheticEvent) => {
        e.stopPropagation();
    }, []);

    if (!record) {
        return <></>;
    }
    const icon =
        iconProps || (mode === 'browser' ? <BrowserIcon /> : defaultIcon);
    const label =
        labelProps ||
        (mode === 'browser'
            ? 'pages.browser.title'
            : 'pages.http-client.title');
    const titleText = label ? translate(label) : '';
    const isDisabled =
        disabled || record.status?.state !== 'RUNNING' || urls.length === 0;

    return (
        <Fragment>
            <Button
                label={label}
                color={color}
                onClick={handleDialogOpen}
                disabled={isDisabled}
                {...rest}
            >
                {icon}
            </Button>
            <ClientDialog
                open={open}
                onClose={handleDialogClose}
                onClick={handleClick}
                fullWidth={fullWidth}
                fullScreen={fullScreen}
                maxWidth={maxWidth}
                aria-labelledby="client-dialog-title"
                className={ClientButtonClasses.dialog}
            >
                <div
                    className={ClientButtonClasses.header}
                    role="fieldset"
                    aria-labelledby="client-dialog-title-main"
                >
                    <Stack direction="column" spacing={0.5} sx={{ flex: 1 }}>
                        <DialogTitle
                            id="client-dialog-title-main"
                            className={ClientButtonClasses.title}
                        >
                            {titleText} {record?.name ? `#${record.name}` : ''}
                        </DialogTitle>
                    </Stack>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={fullScreen === true}
                                onChange={() => {
                                    setFullScreen(!fullScreen);
                                }}
                            />
                        }
                        label={translate('actions.fullscreen')}
                        labelPlacement="start"
                        disableTypography
                        sx={{ fontSize: '80%' }}
                    />

                    <IconButton
                        className={ClientButtonClasses.closeButton}
                        aria-label={translate('ra.action.close')}
                        title={translate('ra.action.close')}
                        onClick={handleDialogClose}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
                <DialogContent>
                    <Client mode={mode} record={record} />
                </DialogContent>
            </ClientDialog>
        </Fragment>
    );
};

type ClientProps = {
    mode?: ClientButtonMode[number];
    record?: RaRecord;
    urls?: string[];
};

const Client = (props: ClientProps) => {
    const { mode: modeProps, urls: urlsProps } = props;
    const record = useRecordContext(props);
    const translate = useTranslate();

    const urls = useMemo<string[]>(() => {
        const serviceUrls: string[] = [];
        if (urlsProps && urlsProps.length > 0) {
            serviceUrls.push(...urlsProps);
        } else if (record?.status?.service) {
            if (record.status?.service?.url) {
                serviceUrls.push(record.status.service.url);
            }
            if (record.status?.service?.urls) {
                serviceUrls.push(...record.status.service.urls);
            }
        }
        return serviceUrls;
    }, [record, urlsProps]);

    const mode = useMemo<string>(() => {
        if (modeProps) return modeProps;
        if (record?.status?.openai) return 'chat';
        if (record?.status?.inference_v2) return 'v2';
        return 'http';
    }, [record, modeProps]);

    if (!record?.id) return null;

    return (
        <>
            <Typography variant="body2" mb={1}>
                {translate('pages.http-client.helperText')}
            </Typography>

            {(() => {
                switch (mode) {
                    case 'v2':
                        return (
                            <InferenceV2Client
                                baseUrl={record.status?.inference_v2?.baseUrl}
                                model={record.status?.inference_v2?.model}
                                historyKey={`http.client.history.${record.id}`}
                            />
                        );
                    case 'chat':
                        return (
                            <ChatClient
                                modelName={record.status?.openai?.model}
                                baseUrl={record.status?.openai?.baseUrl}
                                storageKey={`http.client.history.${record.id}`}
                            />
                        );
                    case 'browser':
                        return <BrowserClient urls={urls} />;
                    case 'http':
                    default:
                        return (
                            <StandardHttpClient
                                urls={urls}
                                historyKey={`http.client.history.${record.id}`}
                            />
                        );
                }
            })()}
        </>
    );
};

const PREFIX = 'ClientButton';

const ClientButtonClasses = {
    button: `${PREFIX}-button`,
    dialog: `${PREFIX}-dialog`,
    header: `${PREFIX}-header`,
    title: `${PREFIX}-title`,
    closeButton: `${PREFIX}-close-button`,
};

const ClientDialog = styled(Dialog, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${ClientButtonClasses.title}`]: {
        padding: theme.spacing(0),
    },
    [`& .${ClientButtonClasses.header}`]: {
        padding: theme.spacing(2, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    [`& .${ClientButtonClasses.closeButton}`]: {
        height: 'fit-content',
    },
}));
