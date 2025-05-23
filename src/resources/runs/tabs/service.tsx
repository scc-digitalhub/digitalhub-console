import { Labeled } from 'react-admin';
import { Box } from '@mui/material';
import { JSONTree } from 'react-json-tree';

export const ServiceDetails = (props: { record: any }) => {
    const { record } = props;

    const json = record?.status?.service || {};

    return (
        <Labeled label="fields.service.title" fullWidth>
            <Box
                sx={{
                    backgroundColor: '#002b36',
                    px: 2,
                    py: 0,
                    minHeight: '20vw',
                }}
            >
                <JSONTree data={json} hideRoot />
            </Box>
        </Labeled>
    );
};
