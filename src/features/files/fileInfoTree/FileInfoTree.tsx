// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Grid, Typography } from '@mui/material';
import {
    useNotify,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { ReactElement, useEffect, useRef, useState } from 'react';
import { useGetFileInfo } from '../info/useGetInfo';
import { Tree } from './Tree';
import { InfoTable } from './InfoTable';
import { convertFiles } from './utils';
import { Stats } from './Stats';
import { FileInfo } from '../info/types';
import { NoContent } from '../../../common/components/NoContent';
import { Spinner } from '../../../common/components/Spinner';

const DefaultTitle = () => {
    const translate = useTranslate();

    return (
        <Typography variant="h6" gutterBottom>
            {translate('fields.status.files')}
        </Typography>
    );
};

const DefaultNoContent = <NoContent message={'fields.info.empty'} />;

export const FileInfoTree = (props: {
    title?: false | ReactElement;
    noContent?: ReactElement;
    showStats?: boolean;
}) => {
    const {
        title = <DefaultTitle />,
        noContent = DefaultNoContent,
        showStats = true,
    } = props;
    const record = useRecordContext();
    const resource = useResourceContext();
    const notify = useNotify();
    const getFileInfo = useGetFileInfo();

    const [data, setData] = useState<FileInfo[]>();
    const [activeFile, setActiveFile] = useState<any>();
    const isLoading = useRef(false);

    const handleItemClick = (item: any) => {
        const a: any = activeFile;
        if (a && a?.path === item.id) {
            setActiveFile(undefined);
        } else if (item.children && item.children.length > 0) {
            if (!item.data) {
                item.data = {
                    path: item.id,
                    name: item.label,
                    elements: item.children.length,
                };
            }
            setActiveFile(item);
        } else {
            setActiveFile(item);
        }
    };

    useEffect(() => {
        if (record) {
            //reset activeFile
            setActiveFile(undefined);
            isLoading.current = true;
            if (record.status?.files?.length > 0) {
                setData(record.status.files);
                isLoading.current = false;
            } else {
                getFileInfo({
                    resource: resource || '',
                    id: record.id as string,
                })
                    .then(data => {
                        if (data) {
                            setData(data);
                            isLoading.current = false;
                        } else {
                            notify('ra.message.not_found', {
                                type: 'error',
                            });
                            isLoading.current = false;
                        }
                    })
                    .catch(error => {
                        const e =
                            typeof error === 'string'
                                ? error
                                : error.message || 'error';
                        notify(e);
                        isLoading.current = false;
                    });
            }
        }
    }, [getFileInfo, notify, record, resource]);

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            {title && title}
            {isLoading.current ? (
                <Spinner />
            ) : data ? (
                <>
                    {showStats && <Stats data={data} />}
                    <Grid container spacing={2} sx={{ width: '100%' }}>
                        <Grid size="grow">
                            <Tree
                                info={convertFiles(data)}
                                onItemClick={handleItemClick}
                            />
                        </Grid>
                        {activeFile && (
                            <Grid size="grow">
                                <InfoTable info={activeFile} />
                            </Grid>
                        )}
                    </Grid>
                </>
            ) : (
                noContent
            )}
        </Box>
    );
};
