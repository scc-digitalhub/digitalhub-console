// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ListButton, TopToolbar } from "react-admin";
import { HubButton } from "../../../common/components/buttons/HubButton";

export const CreateToolbar = () => {
    return (
        <TopToolbar>
            <HubButton />
            <ListButton />
        </TopToolbar>
    );
};
