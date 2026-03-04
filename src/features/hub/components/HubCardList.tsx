import { useTranslate, useRecordContext, ListView } from 'react-admin';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Typography,
    useTheme,
} from '@mui/material';
import { GridList } from '../../../common/components/layout/GridList';

const HubCard = () => {
    const theme = useTheme();
    const item = useRecordContext();

    if (!item) return null;

    return (
        <Card
            sx={{
                mb: 2,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
            }}
        >
            <CardContent sx={{ pb: '16px !important' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 0.5,
                        gap: 1.5,
                        flexWrap: 'wrap',
                    }}
                >
                    <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                        fontSize="1.1rem"
                    >
                        {item.metadata?.name}
                    </Typography>
                    <Chip
                        label={`v${item.metadata?.version}`}
                        size="small"
                        variant="outlined"
                        sx={{
                            borderRadius: 1,
                            height: 22,
                            fontSize: '0.75rem',
                        }}
                    />
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    {item.name}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.primary"
                    mb={3}
                    lineHeight={1.5}
                >
                    {item.metadata?.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {item.metadata?.labels?.map(
                        (label: string, idx: number) => (
                            <Chip
                                key={idx}
                                label={label.split(':')[1] || label}
                                size="small"
                                sx={{
                                    bgcolor: 'action.hover',
                                    border: 'none',
                                    height: 24,
                                }}
                            />
                        )
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export const HubCardList = () => {
    return (
        <ListView actions={false} pagination={false} component={Box}>
            <HubCardListContent />
        </ListView>
    );
};

const HubCardListContent = () => {
    const translate = useTranslate();
    return (
        <GridList
            spacing={0}
            component={<Box sx={{ width: '100%' }} />}
            empty={
                <Typography variant="body1" color="text.secondary" mt={4}>
                    {translate('pages.hub.empty', {
                        _: 'No templates match your current filters.',
                    })}
                </Typography>
            }
            linkType={false}
        >
            <HubCard />
        </GridList>
    );
};
