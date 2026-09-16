// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useRef, useState } from 'react';
import {
    LoadingIndicator,
    useDataProvider,
    ArrayInput,
    SimpleForm,
    SimpleFormIterator,
    TextInput,
    SelectInput,
    ResourceContextProvider,
} from 'react-admin';
import { useFieldObserver } from '../../common/hooks/useFieldObserver';
import { LoggerEntry, LOG_LEVEL_CHOICES } from './utils';

//backend returns a map of logger name to level, e.g. {"some.logger":"TRACE"}
const toLoggerEntries = (data: Record<string, string>): LoggerEntry[] =>
    Object.entries(data || {}).map(([key, level]) => ({
        key,
        level,
    }));

export const LoggersForm = (props: { refresh?: () => void }) => {
    const { refresh } = props;
    const dataProvider = useDataProvider();
    const [loggers, setLoggers] = useState<LoggerEntry[] | null>(null);

    const fetchLoggers = useCallback(() => {
        if (dataProvider) {
            const url = `/admin/logs/level`;

            dataProvider
                .invoke({
                    path: url,
                    options: { method: 'GET' },
                })
                .then(res => {
                    console.log('Fetched loggers:', res);
                    setLoggers(toLoggerEntries(res || {}));
                });
        }
    }, [dataProvider]);

    useEffect(() => {
        fetchLoggers();
    }, [fetchLoggers]);

    if (loggers === null) {
        return <LoadingIndicator />;
    }

    return (
        <ResourceContextProvider value="logs">
            <SimpleForm toolbar={false} defaultValues={{ loggers }}>
                <ArrayInput source="loggers">
                    <SimpleFormIterator
                        inline
                        fullWidth={false}
                        disableReordering
                    >
                        <TextInput
                            source="key"
                            helperText={false}
                            sx={{ width: 500 }}
                        />
                        <SelectInput
                            source="level"
                            choices={LOG_LEVEL_CHOICES}
                            helperText={false}
                        />
                    </SimpleFormIterator>
                </ArrayInput>
                <LoggerLevelObserver
                    initialLoggers={loggers}
                    refresh={refresh}
                />
            </SimpleForm>
        </ResourceContextProvider>
    );
};

const LoggerLevelObserver = (props: {
    initialLoggers: LoggerEntry[];
    refresh?: () => void;
}) => {
    const { initialLoggers, refresh } = props;
    const dataProvider = useDataProvider();
    const previousRef = useRef<LoggerEntry[]>(initialLoggers);

    //keep the diff baseline aligned with freshly fetched data, so a reload isn't mistaken for a user edit
    useEffect(() => {
        previousRef.current = initialLoggers;
    }, [initialLoggers]);

    useFieldObserver<LoggerEntry[]>('loggers', value => {
        const previous = previousRef.current || [];
        const current = value || [];

        //removed entries: reset the logger to its default level
        previous
            .filter(entry => entry?.key)
            .forEach(entry => {
                const stillExists = current.some(
                    item => item?.key === entry.key
                );
                if (!stillExists) {
                    dataProvider
                        .invoke({
                            path: `/admin/logs/level?logger=${encodeURIComponent(
                                entry.key
                            )}`,
                            options: { method: 'DELETE' },
                        })
                        .then(() => {
                            if (refresh) refresh();
                        });
                }
            });

        //new or changed entries: push the level to the backend
        current
            .filter(entry => entry?.key && entry?.level)
            .forEach(entry => {
                const previousEntry = previous.find(
                    item => item?.key === entry.key
                );
                if (!previousEntry || previousEntry.level !== entry.level) {
                    dataProvider
                        .invoke({
                            path: `/admin/logs/level?logger=${encodeURIComponent(
                                entry.key
                            )}&level=${encodeURIComponent(entry.level)}`,
                            options: { method: 'PUT' },
                        })
                        .then(() => {
                            if (refresh) refresh();
                        });
                }
            });

        previousRef.current = current;
    });

    return null;
};
