// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useNotify, Button, useTranslate, RaRecord, FieldProps } from 'react-admin';
import { useEffect, useRef, useState } from 'react';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-drools';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-text';
import { usePapaParse } from 'react-papaparse';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { EmptyMessage } from '../../../../common/components/layout/EmptyMessage';

const CHUNK_SIZE = 1000;
/**
 * Sentinel bytes that could be lost between UTF-16 and UTF-8 char encoding.
 * Set to the maximum number of bytes per character in UTF-8 (at least 1 will not be lost).
 */
const UTF8_MAX_CHAR_BYTES = 4;

export const CSVViewer = (props: CSVViewerProps) => {
    const { url } = props;
    const { readRemoteFile } = usePapaParse();
    const [content, setContent] = useState<any>(undefined);
    const notify = useNotify();
    const translate = useTranslate();

    const [page, setPage] = useState<number>(1);
    const currentChunk = useRef<string>('');
    const headers = useRef<string>('');
    const remainder = useRef<string>('');
    const separator = useRef<string>('');
    const cursor = useRef<number>(0);

    useEffect(() => {
        let chunk = currentChunk.current;

        readRemoteFile(url, {
            header: true,
            download: true,
            skipEmptyLines: true,
            downloadRequestHeaders: {
                //TODO controllare cosa succede se la prima pagina è più piccola del chunk size
                //add range header to request a chunk of bytes
                Range: `bytes=${cursor.current}-${
                    cursor.current + CHUNK_SIZE + UTF8_MAX_CHAR_BYTES - 1
                }`,
            },
            beforeFirstChunk: newChunk => {
                //keep current chunk before parsing
                chunk = newChunk;
                //after first page, prepend header line and remainder
                if (page > 1) {
                    return `${headers.current}${separator.current}${remainder.current}${newChunk}`;
                }
                return newChunk;
            },
            complete: results => {
                if (results.data && results.data.length > 0) {
                    //store separator, header line and last line (possibly incomplete due to chunking) for next pages
                    separator.current = results.meta.linebreak;
                    const lines = chunk.split(separator.current);
                    if (!headers.current) {
                        headers.current = lines[0];
                    }
                    remainder.current = lines[lines.length - 1];

                    //remove remainder from result before display, unless it is the last page
                    const data =
                        new Blob([chunk]).size > CHUNK_SIZE
                            ? results.data.slice(0, -1)
                            : results.data;

                    //format result for datagrid
                    const cols = Object.keys(data[0] as any).map(c => ({
                        field: c,
                        flex: 1,
                    }));
                    const res = {
                        rows: data.map((row: any, index: number) => ({
                            ...row,
                            id: page + '_' + index,
                        })),
                        columns: cols,
                    };

                    //append result to previous content if any
                    setContent(prev => {
                        if (prev && !prev.pages.includes(page)) {
                            return {
                                columns: res.columns,
                                rows: [...prev.rows, ...res.rows],
                                pages: [...prev.pages, page],
                            };
                        }
                        res['pages'] = [page];
                        return res;
                    });
                }

                //store chunk for next page
                currentChunk.current = chunk;
                //increment cursor
                cursor.current = page * CHUNK_SIZE + page * UTF8_MAX_CHAR_BYTES;
            },
            error: () => {
                notify('ra.message.not_found', {
                    type: 'error',
                });
            },
        });
    }, [notify, page, readRemoteFile, url]);

    const CustomFooter = () => {
        return (
            <Box mt={1} textAlign="center">
                <Button
                    color="info"
                    size="small"
                    disabled={
                        !(new Blob([currentChunk.current]).size > CHUNK_SIZE)
                    }
                    onClick={() => setPage(prev => prev + 1)}
                >
                    {translate('actions.load_more')}
                </Button>
            </Box>
        );
    };

    return (
        <Box
            sx={{
                height: 400,
                width: '100%',
                '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bold',
                },
            }}
        >
            {content ? (
                <DataGrid
                    rows={content.rows}
                    columns={content.columns}
                    autoHeight
                    disableRowSelectionOnClick
                    paginationMode="server"
                    rowCount={-1}
                    slots={{
                        footer: CustomFooter,
                    }}
                />
            ) : (
                <EmptyMessage message="fields.info.empty" />
            )}
        </Box>
    );
};

export type CSVViewerProps<RecordType extends RaRecord = any> = Omit<
    FieldProps<RecordType>,
    'source'
> & {
    url: string;
};
