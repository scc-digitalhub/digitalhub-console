import { Card, Paper } from '@mui/material';

// export const ShowOutlinedCard = (props: { children }) => (
//     <Card
//         variant="elevation"
//         // sx={{ width: '100%', borderRadius: '10px', order: { xs: 2, lg: 1 } }}
//     >
//         {props.children}
//     </Card>
// );
export const FlatCard = (props: { children }) => (
    <Paper variant="elevation" elevation={0}>
        {props.children}
    </Paper>
);
