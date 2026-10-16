// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { FunctionField, useRecordContext } from 'react-admin';
import { Tooltip } from '@mui/material';
import { StateChips } from './StateChips';
import InfoIcon from '@mui/icons-material/Info';

export const StateBadge = props => {
    const record = useRecordContext(props);

    return (
        record?.status?.state && (
            <>
                <StateChips source="status.state" label="fields.status.state" />
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
    );
};
