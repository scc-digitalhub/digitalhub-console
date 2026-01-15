// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRecordContext } from 'react-admin';

export const RecordTitle = ({ prompt }: any) => {
    const record = useRecordContext();
    return (
        <span>
            {prompt} {record ? `${record.name}` : ''}
        </span>
    );
};
