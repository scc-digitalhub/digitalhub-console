// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0
import { Labeled, useRecordContext } from 'react-admin';
import humanFormat from 'human-format';
import { JsonTab } from '../../../../common/components/tabs/json';

export const parameterScale = humanFormat.Scale.create(
    ['', 'K', 'M', 'B', 'T'],
    1000
);

export const MlflowParams = props => {
    const record = useRecordContext(props);
    const params = record?.spec?.params || {};

    return (
        <Labeled label="fields.parameters.title">
            <JsonTab record={params} />
        </Labeled>
    );
};
