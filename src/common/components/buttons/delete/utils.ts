// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { DeleteButtonOptions } from './types';

export const extractDeleteButtonOptions = (props: any): DeleteButtonOptions => {
    return {
        deleteAll: props.deleteAll,
        cascade: props.cascade,
        askForDeleteAll: props.askForDeleteAll,
        askForCascade: props.askForCascade,
        disableDeleteAll: props.disableDeleteAll,
        disableCascade: props.disableCascade,
        onDeleteAll: props.onDeleteAll,
        onCascade: props.onCascade,
        additionalContent: props.additionalContent,
    };
};

/* eslint-disable @typescript-eslint/no-unused-vars */
export const sanitizeDeleteButtonProps = (props: any) => {
    const {
        deleteAll,
        cascade,
        askForDeleteAll,
        askForCascade,
        disableDeleteAll,
        disableCascade,
        additionalContent,
        onDeleteAll,
        onCascade,
        ...rest
    } = props;
    return rest;
};
