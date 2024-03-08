import { Card, Paper, PaperProps } from '@mui/material';

// export const ShowOutlinedCard = (props: { children }) => (
//     <Card
//         variant="elevation"
//         // sx={{ width: '100%', borderRadius: '10px', order: { xs: 2, lg: 1 } }}
//     >
//         {props.children}
//     </Card>
// );
export const FlatCard = (props: PaperProps) => {
    const { children, sx: sxProps = {}, ...rest } = props;
    const sx = { ...sxProps, paddingX: '8px' };
    return (
        <Paper variant="elevation" elevation={0} sx={sx} {...rest}>
            {children}
        </Paper>
    );
};
