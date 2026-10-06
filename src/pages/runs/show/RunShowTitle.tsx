// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    FunctionField,
    useGetResourceLabel,
    useShowContext,
    useTranslate,
} from 'react-admin';
import { Tooltip } from '@mui/material';
import { RunIcon } from '../icon';
import {
    PageTitle,
    RecordPageTitleProps,
} from '../../../common/components/layout/PageTitle';
import { StateChips } from '../../../common/components/StateChips';

import InfoIcon from '@mui/icons-material/Info';

export const RunShowTitle = (props: RecordPageTitleProps) => {
    const { resource, record } = useShowContext();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const label = getResourceLabel(resource, 1);

    const uri = record?.spec?.function
        ? new URL(record.spec.function)
        : record?.spec?.workflow
        ? new URL(record.spec.workflow)
        : null;

    const parent = uri ? uri.pathname.split(':')[0].substring(1) : null;

    const name = parent
        ? `${parent}/${record?.name || ''}`
        : record?.name || '';
    const kind = record?.kind || '';

    return (
        <PageTitle
            text={translate('pages.pageTitle.show.title', {
                resource: label,
                name,
            })}
            secondaryText={translate('pages.pageTitle.show.subtitle', {
                resource: label,
                kind,
            })}
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
