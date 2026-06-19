// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    useNotify,
    RaRecord,
    FieldProps,
    InfinitePaginationContext,
    InfinitePagination,
    ListContextProvider,
    useList,
    DataTable,
} from 'react-admin';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePapaParse } from 'react-papaparse';
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

                    //add row IDs
                    const indexedData = data.map((row: any, index: number) => ({
                        ...row,
                        id: page + '_' + index,
                    }));

                    //append result to previous content if any
                    setContent(prev => {
                        if (prev && !prev.pages.includes(page)) {
                            return {
                                data: [...prev.data, ...indexedData],
                                pages: [...prev.pages, page],
                            };
                        }
                        return { data: indexedData, pages: [page] };
                    });
                }

                //store chunk for next page
                currentChunk.current = chunk;
                //increment cursor
                cursor.current = page * (CHUNK_SIZE + UTF8_MAX_CHAR_BYTES);
            },
            error: () => {
                notify('ra.message.not_found', {
                    type: 'error',
                });
            },
        });
    }, [notify, page, readRemoteFile, url]);

    const scrollCallback = useCallback(() => setPage(prev => prev + 1), []);

    return (
        <Box>
            {content && content.data?.length > 0 ? (
                <ScrollableList
                    data={content.data}
                    fetchNextPage={scrollCallback}
                    hasNextPage={
                        new Blob([currentChunk.current]).size > CHUNK_SIZE
                    }
                    isFetchingNextPage={
                        content.pages[content.pages.length - 1] < page
                    }
                />
            ) : (
                <EmptyMessage message="fields.info.empty" />
            )}
        </Box>
    );
};

const ScrollableList = (props: {
    data: any[];
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
}) => {
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = props;
    const listContext = useList({ data });

    const infinitePaginationContext: any = useMemo(() => {
        return {
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <ListContextProvider value={listContext}>
            <DataTable bulkActionButtons={false} rowClick={false}>
                {Object.keys(data[0])
                    .filter(key => key !== 'id')
                    .map(key => (
                        <DataTable.Col source={key} key={key} />
                    ))}
            </DataTable>
            <InfinitePaginationContext.Provider
                value={infinitePaginationContext}
            >
                <InfinitePagination />
            </InfinitePaginationContext.Provider>
        </ListContextProvider>
    );
};

export type CSVViewerProps<RecordType extends RaRecord = any> = Omit<
    FieldProps<RecordType>,
    'source'
> & {
    url: string;
};
