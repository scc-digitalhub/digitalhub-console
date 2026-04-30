// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { HttpClient, HttpClientProps } from './HttpClient';

/**
 * Standard HTTP Client for general purpose requests.
 * Allows user to modify method, url, headers and body freely.
 */
export const StandardHttpClient = (props: HttpClientProps) => {
    return <HttpClient {...props} />;
};
