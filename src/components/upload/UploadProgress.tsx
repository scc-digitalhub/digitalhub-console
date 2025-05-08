import {
    Box,
    Card,
    CardContent,
    CardHeader,
    LinearProgress,
    styled,
    Typography,
} from '@mui/material';
import { Upload } from '../../contexts/UploadStatusContext';
import ClearIcon from '@mui/icons-material/Clear';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
    Confirm,
    DateField,
    IconButtonWithTooltip,
    useGetOne,
    useGetResourceLabel,
    useResourceDefinition,
    useTranslate,
} from 'react-admin';
import { createElement, useState } from 'react';
import { B } from '@wtfcode/byte-converter';
import { round } from 'lodash';

const scaleBytes = (bytes: number) => {
    const unit = B.value(bytes).autoScale({ type: 'decimal' });
    return `${round(unit.value, 1)} ${unit.unit.unit}`;
};

export const UploadProgress = (props: UploadProgressProps) => {
    const { upload, removeUploads } = props;
    const translate = useTranslate();
    const [open, setOpen] = useState(false);
    const getResourceLabel = useGetResourceLabel();
    const definition = useResourceDefinition({ resource: upload.resource });
    const { data: record } = useGetOne(upload.resource, {
        id: upload.resourceId,
    });

    if (!definition) {
        return <></>;
    }

    const subtitle = translate('pages.pageTitle.show.title', {
        resource: getResourceLabel(upload.resource, 1),
        name: record?.name || upload.resourceId,
    });

    const icon = definition.icon ? (
        createElement(definition.icon, { fontSize: 'small' })
    ) : (
        <FileUploadIcon fontSize="small" />
    );

    const deleteUpload = () => {
        if (upload.progress.percentage && upload.progress.percentage < 100) {
            //open confirmation dialog
            setOpen(true);
        } else {
            //remove upload notification
            removeUploads(upload);
        }
    };

    const handleConfirm = () => {
        //cancel upload and remove notification
        upload.remove();
        removeUploads(upload);
        setOpen(false);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    return (
        <UploadProgressCard elevation={0} square>
            <CardHeader
                avatar={icon}
                title={subtitle}
                subheader={
                    <DateField
                        record={upload.progress}
                        source="uploadStarted"
                        showTime
                    />
                }
                action={
                    <IconButtonWithTooltip
                        label={'ra.action.delete'}
                        onClick={deleteUpload}
                    >
                        <ClearIcon fontSize="small" />
                    </IconButtonWithTooltip>
                }
            />
            <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {upload.filename}
                </Typography>
                {upload.progress.bytesUploaded &&
                    upload.progress.bytesTotal && (
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                        >
                            {scaleBytes(upload.progress.bytesUploaded)} -{' '}
                            {scaleBytes(upload.progress.bytesTotal)}
                        </Typography>
                    )}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={upload.progress.percentage}
                            color={
                                upload.progress.percentage &&
                                upload.progress.percentage === 100
                                    ? 'success'
                                    : 'primary'
                            }
                        />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                        >{`${upload.progress.percentage}%`}</Typography>
                    </Box>
                </Box>
            </CardContent>
            <Confirm
                isOpen={open}
                title={translate('messages.upload.cancelUpload.title')}
                content={translate('messages.upload.cancelUpload.content')}
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
        </UploadProgressCard>
    );
};

const UploadProgressCard = styled(Card, {
    name: 'UploadProgressCard',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: theme.palette.common.white,
    ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.common.black,
    }),
    color: 'inherit',
    ...theme.applyStyles('dark', {
        color: 'inherit',
    }),
    ['& .MuiCardContent-root, & .MuiCardHeader-root']: {
        paddingBottom: 0,
        paddingTop: 8,
    },
    ['& .MuiCardHeader-action']: {
        paddingLeft: 8,
        marginRight: -12,
    },
    ['& .MuiCardActions-root']: {
        paddingLeft: 16,
    },
}));

type UploadProgressProps = {
    upload: Upload;
    removeUploads: (toBeRemoved?: Upload) => void;
};
