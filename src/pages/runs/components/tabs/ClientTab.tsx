// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Labeled, useTranslate } from 'react-admin';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Typography } from '@mui/material';
import { StandardHttpClient } from '../../../../features/httpclients/components/StandardHttpClient';

export const ClientTab = (props: { record: any }) => {
    const { record } = props;
    const { root: projectId } = useRootSelector();
    const translate = useTranslate();
    const url = record?.status?.service?.url;

    return (
        <Labeled label="pages.http-client.title" fullWidth>
            <>
                <Typography variant="body2" mb={1}>
                    {translate('pages.http-client.helperText')}
                </Typography>
                <StandardHttpClient
                    urls={[url]}
                    proxy={'/-/' + projectId + '/runs/' + record.id + '/proxy'}
                />
            </>
        </Labeled>
    );
};
