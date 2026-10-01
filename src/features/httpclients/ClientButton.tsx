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
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Stack,
    Switch,
    FormControlLabel,
} from '@mui/material';

import { StandardHttpClient } from './StandardHttpClient';
import { InferenceV2Client } from './InferenceV2Client';
import { ChatClient } from '../chat/ChatClient';
import { BrowserClient } from './BrowserClient';
import {
    StyledDialog,
    StyledDialogClasses,
} from '../../common/theme/StyledDialog';
import { CHAT_FEATURES } from '../chat/utils';

const defaultIcon = <SignpostIcon />;

export type ClientButtonMode = 'http' | 'openai' | 'openinference_v2' | 'www';

export interface ClientButtonProps<RecordType extends RaRecord = any>
    extends Omit<FieldProps<RecordType>, 'source'>,
        Omit<ButtonProps, 'variant' | 'label'> {
    icon?: ReactElement;
    fullWidth?: boolean;
    maxWidth?: Breakpoint;
    mode?: ClientButtonMode;
    label?: string;
    url?: string;
}

export const ClientButton = (props: ClientButtonProps) => {
    const {
        color = 'secondary',
        label: labelProps,
        icon: iconProps,
        fullWidth = true,
        maxWidth = 'lg',
        mode: modeProps,
        url: urlProps,
        disabled,
        ...rest
    } = props;

    const translate = useTranslate();
    const [open, setOpen] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);

    const record = useRecordContext(props);
    const urls = useMemo<string[]>(() => {
        if (urlProps) {
            return [urlProps];
        }

        const serviceUrls: string[] = [];
        if (record?.status?.service) {
            if (record.status?.service?.url) {
                serviceUrls.push(record.status.service.url);
            }
            if (record.status?.service?.urls) {
                serviceUrls.push(...record.status.service.urls.map(u => u.url));
            }
        }
        return serviceUrls;
    }, [record, urlProps]);

    //pick first url to derive app protocol by default
    const appProtocol =
        record?.status?.service?.urls?.[0]?.app_protocol || 'http';
    const mode = modeProps || (urlProps ? 'http' : appProtocol);

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

    if (!record && !urlProps) {
        return <></>;
    }
    const icon = iconProps || (mode === 'www' ? <BrowserIcon /> : defaultIcon);
    const label =
        labelProps ||
        (mode === 'www' ? 'pages.browser.title' : 'pages.http-client.title');
    const titleText = label ? translate(label) : '';
    const isDisabled =
        disabled ||
        ((record?.status?.state !== 'RUNNING' ||
            !record?.status?.service?.url ||
            record?.status?.service?.urls?.length === 0) &&
            !urlProps);

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
            <StyledDialog
                open={open}
                onClose={handleDialogClose}
                onClick={handleClick}
                fullWidth={fullWidth}
                fullScreen={fullScreen}
                maxWidth={maxWidth}
                aria-labelledby="client-dialog-title"
                className={StyledDialogClasses.dialog}
            >
                <div
                    className={StyledDialogClasses.header}
                    role="fieldset"
                    aria-labelledby="client-dialog-title-main"
                >
                    <Stack direction="column" spacing={0.5} sx={{ flex: 1 }}>
                        <DialogTitle
                            id="client-dialog-title-main"
                            className={StyledDialogClasses.title}
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
                        className={StyledDialogClasses.closeButton}
                        aria-label={translate('ra.action.close')}
                        title={translate('ra.action.close')}
                        onClick={handleDialogClose}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
                <DialogContent>
                    <Client mode={mode} record={record} urls={urls} />
                </DialogContent>
            </StyledDialog>
        </Fragment>
    );
};

type ClientProps = {
    mode?: ClientButtonMode[number];
    record?: RaRecord;
    urls?: string[];
};

const Client = (props: ClientProps) => {
    const { mode: modeProps, urls = [] } = props;
    const record = useRecordContext(props);
    const translate = useTranslate();

    const mode = useMemo(() => {
        if (modeProps == 'openai') {
            //check features for chat
            if (
                record?.status?.openai?.features?.find(f =>
                    CHAT_FEATURES.includes(f)
                )
            ) {
                return 'openai_chat';
            }
        }

        return modeProps;
    }, [modeProps, record]);

    if (!record?.id) return null;

    return (
        <>
            <Typography variant="body2" mb={1}>
                {translate('pages.http-client.helperText')}
            </Typography>

            {(() => {
                switch (mode) {
                    case 'openinference_v2':
                        return (
                            <InferenceV2Client
                                baseUrl={record.status?.inference_v2?.baseUrl}
                                model={record.status?.inference_v2?.model}
                                historyKey={`http.client.history.${record.id}`}
                            />
                        );
                    case 'openai_chat':
                        return (
                            <ChatClient
                                modelName={record.status?.openai?.model}
                                baseUrl={record.status?.openai?.baseUrl}
                                storageKey={`http.client.history.${record.id}`}
                            />
                        );
                    case 'www':
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
