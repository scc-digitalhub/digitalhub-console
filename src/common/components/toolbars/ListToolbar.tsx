// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { CreateButton, TopToolbar } from "react-admin";
import { ImportButton } from "../buttons/ImportButton";
import { UploadCreateButton } from "../buttons/UploadCreateButton";

export const ListToolbar = (props: ListToolbarProps) => {
    const { canImport = true, uploadCreate = false } = props;

    return (
        <TopToolbar>
            {uploadCreate && <UploadCreateButton />}
            <CreateButton />
            {canImport && <ImportButton />}
        </TopToolbar>
    );
};

export type ListToolbarProps = {
    canImport?: boolean;
    uploadCreate?: boolean;
};
