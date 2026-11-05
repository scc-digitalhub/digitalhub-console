// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    InspectButton as BaseInspectButton,
    InspectButtonProps,
} from '@dslab/ra-inspect-button';
import { DialogWrapper } from '../DialogWrapper';

export const InspectButton = (props: InspectButtonProps) => (
    <DialogWrapper>
        <BaseInspectButton {...props} />
    </DialogWrapper>
);
