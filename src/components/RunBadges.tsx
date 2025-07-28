import { Box, Chip, Stack, Tooltip } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import {
    useCreatePath,
    useDataProvider,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { StateColors } from './StateChips';
import { ResponsiveStyleValue } from '@mui/system';
import { useNavigate } from 'react-router-dom';

export type RunBadgesProps = {
    states?: string[];
    filterById?: boolean;
    direction?: ResponsiveStyleValue<'row' | 'column'>;
};

export const RunBadges = (props: RunBadgesProps) => {
    const {
        states: statesFromProps,
        filterById = true,
        direction = 'column',
    } = props;
    const dataProvider = useDataProvider();
    const resource = useResourceContext();
    const record = useRecordContext();
    const createPath = useCreatePath();
    const navigate = useNavigate();
    const translate = useTranslate();
    const [data, setData] = useState<any>(null);
    const perPage = 100;

    const states = useMemo(() => {
        return statesFromProps || ['COMPLETED', 'RUNNING', 'ERROR'];
    }, [statesFromProps]);

    const resourceKey = useMemo(() => {
        if (record) {
            let key = `${record.kind}://${record.project}/${record.name}`;
            if (filterById) key += `:${record.id}`;
            return key;
        }
    }, [filterById, record]);

    const singularResource = resource?.substring(0, resource.length - 1);

    useEffect(() => {
        if (dataProvider && singularResource && resourceKey) {
            const promises = states.map(s =>
                dataProvider.getList('runs', {
                    pagination: { page: 1, perPage },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {
                        [singularResource]: resourceKey,
                        state: s,
                    },
                })
            );

            Promise.all(promises)
                .then(values => {
                    let d = {};
                    states.forEach((state, index) => {
                        if (values[index].data) {
                            d[state] = values[index].data.length;
                        }
                    });
                    setData(d);
                })
                .catch(() => {
                    setData(null);
                });
        }
    }, [dataProvider, singularResource, resourceKey, states]);

    if (!data) return null;

    const directionalProps =
        direction == 'row'
            ? { spacing: 1 }
            : { sx: { alignItems: 'center', width: '40px' } };

    const handleClick = (event, state: string) => {
        event.stopPropagation();
        event.preventDefault();

        let filter = { state };
        if (singularResource) filter[singularResource] = resourceKey;
        const link =
            createPath({ type: 'list', resource: 'runs' }) +
            '?filter=' +
            encodeURIComponent(JSON.stringify(filter));

        navigate(link);
    };

    return (
        <Stack direction={direction} {...directionalProps}>
            {states.map(s => (
                <Box key={'runbadge_' + s}>
                    <Tooltip
                        title={translate(`states.${s.toLowerCase()}`)}
                        placement={direction == 'row' ? 'bottom' : 'left'}
                    >
                        <Chip
                            color={StateColors[s]}
                            size="small"
                            label={
                                data[s] < perPage ? data[s] : `${perPage - 1}+`
                            }
                            onClick={e => handleClick(e, s)}
                            sx={{
                                '.MuiChip-label': {
                                    fontSize: '12px',
                                    lineHeight: '12px',
                                    paddingX: '6px',
                                },
                                height: '20px',
                            }}
                        />
                    </Tooltip>
                </Box>
            ))}
        </Stack>
    );
};
