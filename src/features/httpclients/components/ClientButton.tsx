// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import {
    useRecordContext,
    Button,
    FieldProps,
    ButtonProps,
    RaRecord,
    useTranslate,
    useDataProvider,
} from 'react-admin';
import SignpostIcon from '@mui/icons-material/Signpost';
import CloseIcon from '@mui/icons-material/Close';
import {
    Fragment,
    ReactElement,
    useCallback,
    useState,
    useEffect,
    SyntheticEvent,
    useRef,
} from 'react';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-markdown';
import {
    Breakpoint,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    styled,
    Typography,
    Stack,
    Alert,
} from '@mui/material';
import { CreateInDialogButtonClasses } from '@dslab/ra-dialog-crud';
import { ReaChat } from '../../chat/components/ReaChat';

import { StandardHttpClient } from './StandardHttpClient';
import { InferenceV2Client } from './InferenceV2Client';
import { HealthChips } from './HealthChips';

const defaultIcon = <SignpostIcon />;

export type ClientButtonMode = 'http' | 'chat' | 'v2';
interface HealthStatus {
    ready: boolean;
    live: boolean;
}

export interface ClientButtonProps<RecordType extends RaRecord = any>
    extends Omit<FieldProps<RecordType>, 'source'>,
        Omit<ButtonProps, 'variant'> {
    icon?: ReactElement;
    fullWidth?: boolean;
    maxWidth?: Breakpoint;
    mode?: ClientButtonMode;
    showHealthChecks?: boolean;
}

export const ClientButton = (props: ClientButtonProps) => {
    const {
        color = 'secondary',
        label = 'pages.http-client.title',
        icon = defaultIcon,
        fullWidth = true,
        maxWidth = 'lg',
        mode = 'http',
        showHealthChecks = mode === 'v2',
        disabled,
        ...rest
    } = props;

    const translate = useTranslate();
    const [open, setOpen] = useState(false);
    const record = useRecordContext(props);
    const urls = useRef<string[]>([]);

    useEffect(() => {
        const serviceUrls: string[] = [];
        if (record?.status?.service) {
            if (record.status?.service?.url) {
                serviceUrls.push(record.status.service.url);
            }
            if (record.status?.service?.urls) {
                serviceUrls.push(...record.status.service.urls);
            }
        }
        urls.current = serviceUrls;
    }, [record?.status?.service]);

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

    const titleText = label ? translate(String(label)) : '';
    const isDisabled =
        disabled ||
        record.status?.state !== 'RUNNING' ||
        (mode !== 'chat' && urls.current.length === 0);

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
                maxWidth={maxWidth}
                aria-labelledby="client-dialog-title"
                className={CreateInDialogButtonClasses.dialog}
            >
                <div
                    className={CreateInDialogButtonClasses.header}
                    role="group"
                    aria-labelledby="client-dialog-title-main"
                >
                    <Stack direction="column" spacing={0.5} sx={{ flex: 1 }}>
                        <DialogTitle
                            id="client-dialog-title-main"
                            className={CreateInDialogButtonClasses.title}
                        >
                            {titleText} {record?.name ? `#${record.name}` : ''}
                        </DialogTitle>

                        {record.status?.openai?.model && (
                            <Typography
                                id="client-dialog-model"
                                className={CreateInDialogButtonClasses.title}
                            >
                                {record.status?.openai?.model}
                            </Typography>
                        )}
                    </Stack>

                    <IconButton
                        className={CreateInDialogButtonClasses.closeButton}
                        aria-label={translate('ra.action.close')}
                        title={translate('ra.action.close')}
                        onClick={handleDialogClose}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
                <DialogContent>
                    {mode === 'chat' ? (
                        <ReaChat />
                    ) : (
                        <Client
                            showHealthChecks={showHealthChecks}
                            mode={mode}
                            recordId={record.id}
                            urls={urls.current}
                        />
                    )}
                </DialogContent>
            </ClientDialog>
        </Fragment>
    );
};

type ClientProps = Pick<ClientButtonProps, 'showHealthChecks' | 'mode'> & {
    recordId: string;
    urls: string[];
};

const Client = (props: ClientProps) => {
    const { showHealthChecks, recordId, mode, urls } = props;
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const { root: projectId } = useRootSelector();
    const [healthStatus, setHealthStatus] = useState<HealthStatus>({
        ready: false,
        live: false,
    });
    const showContent = !showHealthChecks || healthStatus.live === true;
    const proxy = '/-/' + projectId + '/runs/' + recordId + '/proxy';

    useEffect(() => {
        const base = urls[0];
        if (!base) return;
        // DEBUG: both health flags true for testing
        // setHealthStatus({ ready: true, live: true });
        // return;
        const ctrl = new AbortController();

        const check = async (path: string, key: string) => {
            try {
                const targetUrl = `${base}${path}`;
                const apiUrl = await dataProvider.apiUrl();
                const proxyEndpoint = `${apiUrl}${proxy}`;

                const { json } = await dataProvider.client(proxyEndpoint, {
                    method: 'POST',
                    headers: new Headers({
                        'X-Proxy-URL': targetUrl,
                        'X-Proxy-Method': 'GET',
                        'Content-Type': 'application/json',
                    }),
                    signal: ctrl.signal,
                });

                return json?.[key] === true;
            } catch (error) {
                return false;
            }
        };

        (async () => {
            setHealthStatus({ ready: false, live: false });

            const isReady = await check('/v2/health/ready', 'ready');
            if (ctrl.signal.aborted) return;

            if (!isReady) {
                setHealthStatus({ ready: false, live: false });
            } else {
                setHealthStatus({ ready: true, live: false });
                const isLive = await check('/v2/health/live', 'live');
                if (!ctrl.signal.aborted)
                    setHealthStatus({ ready: true, live: isLive });
            }
        })();

        return () => ctrl.abort();
    }, [showHealthChecks, urls, dataProvider, proxy]);

    return (
        <>
            <Typography variant="body2" mb={1}>
                {translate('pages.http-client.helperText')}
            </Typography>

            {showHealthChecks && (
                <HealthChips
                    ready={healthStatus.ready}
                    live={healthStatus.live}
                />
            )}

            {showHealthChecks && !healthStatus.ready && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {translate('pages.http-client.modelNotReady')}
                </Alert>
            )}
            {showHealthChecks && healthStatus.ready && !healthStatus.live && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {translate('pages.http-client.modelNotLive')}
                </Alert>
            )}

            {/* Using InferenceV2Client */}
            {showContent && mode === 'v2' && (
                <InferenceV2Client urls={urls} proxy={proxy} />
            )}

            {/* Using StandardHttpClient */}
            {showContent && mode === 'http' && (
                <StandardHttpClient urls={urls} proxy={proxy} />
            )}
        </>
    );
};

const ClientDialog = styled(Dialog, {
    name: 'RaCreateInDialogButton',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${CreateInDialogButtonClasses.title}`]: {
        padding: theme.spacing(0),
    },
    [`& .${CreateInDialogButtonClasses.header}`]: {
        padding: theme.spacing(2, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    [`& .${CreateInDialogButtonClasses.closeButton}`]: {
        height: 'fit-content',
    },
}));
