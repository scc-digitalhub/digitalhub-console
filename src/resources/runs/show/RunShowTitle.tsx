// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    FunctionField,
    useGetResourceLabel,
    useShowContext,
    useTranslate,
} from 'react-admin';
import { Stack, Tooltip, Typography } from '@mui/material';
import { RunIcon } from '../icon';
import {
    PageTitle,
    RecordPageTitleProps,
} from '../../../common/components/layout/PageTitle';
import { StateChips } from '../../../common/components/StateChips';

import InfoIcon from '@mui/icons-material/Info';
import { functionParser } from '../../../common/utils/parsers';
import { FunctionIcon } from '../../functions/icon';
import { WorkflowIcon } from '../../workflows/icon';

export const RunShowTitle = (props: RecordPageTitleProps) => {
    const { resource, record } = useShowContext();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const label = getResourceLabel(resource, 1);

    const functionKey = record?.spec?.function
        ? functionParser(record?.spec?.function)
        : null;
    const workflowKey = record?.spec?.workflow
        ? functionParser(record?.spec?.workflow)
        : null;

    const parent = functionKey?.name || workflowKey?.name;

    const name = parent
        ? `${parent}/${record?.name || ''}`
        : record?.name || '';
    const kind = record?.kind || '';

    const secondaryIcon = functionKey?.kind ? (
        <FunctionIcon fontSize="small" kind={functionKey.kind} />
    ) : workflowKey?.kind ? (
        <WorkflowIcon fontSize="small" />
    ) : (
        false
    );

    const secondaryText = secondaryIcon ? (
        <Stack direction="row" spacing={1} alignItems="center">
            {secondaryIcon}
            <Typography variant="subtitle1">
                {translate('pages.pageTitle.show.subtitle', {
                    resource: label,
                    kind,
                })}
            </Typography>
        </Stack>
    ) : (
        translate('pages.pageTitle.show.subtitle', {
            resource: label,
            kind,
        })
    );

    return (
        <PageTitle
            text={translate('pages.pageTitle.show.title', {
                resource: label,
                name,
            })}
            secondaryText={secondaryText}
            icon={<RunIcon fontSize={'large'} />}
            badge={
                record?.status?.state && (
                    <>
                        <StateChips
                            source="status.state"
                            label="fields.status.state"
                        />
                        <FunctionField
                            label="fields.status.state"
                            sortable={false}
                            render={record =>
                                record.status?.message ? (
                                    <Tooltip title={record.status.message}>
                                        <InfoIcon
                                            fontSize="small"
                                            color={'disabled'}
                                            sx={{ ml: 0.3 }}
                                        />
                                    </Tooltip>
                                ) : null
                            }
                        />
                    </>
                )
            }
            {...props}
        />
    );
};
