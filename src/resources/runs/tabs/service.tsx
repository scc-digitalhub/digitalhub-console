// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { K8sServiceDetails } from './k8sServiceDetails';
import { OpenAIDetails } from './openai';

export const ServiceDetails = (props: { record: any }) => {
    const { record } = props;

    return record?.status?.openai ? (
        <OpenAIDetails record={record} />
    ) : (
        <K8sServiceDetails record={record} />
    );
};
