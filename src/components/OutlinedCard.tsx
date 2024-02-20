import { Card } from '@mui/material';

export const ShowOutlinedCard = (props: { children }) => (
    <Card
        variant="outlined"
        sx={{ width: '100%', borderRadius: '10px', order: { xs: 2, lg: 1 } }}
    >
        {props.children}
    </Card>
);
