// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { SelectInput, required } from 'react-admin';
import { isValidKind } from '../utils/helpers';

export const KindSelector = (props: {
    kinds?: any[] | undefined;
    readOnly?: boolean;
}) => {
    const { kinds = [], readOnly = false } = props;

    return (
        <SelectInput
            readOnly={readOnly}
            source="kind"
            choices={kinds}
            validate={[required(), isValidKind(kinds)]}
        />
    );
};
