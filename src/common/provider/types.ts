// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { fetchUtils } from 'ra-core';

/**
 * Function to make HTTP calls
 */
export type FetchFunction = (
    url: any,
    options?: fetchUtils.Options | undefined
) => Promise<{
    status: number;
    headers: Headers;
    body: string;
    json: any;
}>;
