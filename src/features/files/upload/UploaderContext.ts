// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { createContext, useContext } from 'react';
import { UploaderContextValue } from './types';

export const UploaderContext = createContext<UploaderContextValue | undefined>(
    undefined
);

export const useUploader = (): UploaderContextValue | undefined =>
    useContext(UploaderContext);
