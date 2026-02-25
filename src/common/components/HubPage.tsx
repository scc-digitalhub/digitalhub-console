import { useMemo, useState } from 'react';
import {
    useList,
    ListContextProvider,
    useListContext,
    useTranslate,
    useGetResourceLabel,
} from 'react-admin';
import {
    ExpandMore as ExpandMoreIcon,
    DataObject as DataObjectIcon,
} from '@mui/icons-material';
import {
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    useTheme,
    Container,
} from '@mui/material';

import catalogData from './../../../data.json';
import { PageTitle } from './layout/PageTitle';
import { FlatCard } from './layout/FlatCard';

const extractFilters = (items: any[]) => {
    const filters: Record<string, Set<string>> = {};
    items.forEach(item => {
        item.metadata?.labels?.forEach((label: string) => {
            const [category, value] = label.split(':');
            if (category && value) (filters[category] ??= new Set()).add(value);
        });
    });
    return Object.fromEntries(
        Object.entries(filters)
            .sort()
            .map(([k, v]) => [k, Array.from(v).sort()])
    );
};

// 1. Sidebar Component
const HubSidebar = ({
    availableFilters,
}: {
    availableFilters: Record<string, string[]>;
}) => {
    const theme = useTheme();
    const translate = useTranslate();

    const { filterValues, setFilters } = useListContext();

    const handleToggle = (category: string, value: string) => {
        const currentCatFilters = filterValues[category] || [];
        const newCatFilters = currentCatFilters.includes(value)
            ? currentCatFilters.filter((v: string) => v !== value)
            : [...currentCatFilters, value];

        setFilters({ ...filterValues, [category]: newCatFilters });
    };

    return (
        <Box sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0 }}>
            <TextField
                fullWidth
                size="small"
                sx={{ mb: 3 }}
                placeholder={translate('pages.hub.search', {
                    _: 'Search by name or description',
                })}
                value={filterValues.q || ''}
                onChange={e =>
                    setFilters({ ...filterValues, q: e.target.value })
                }
            />

            {Object.entries(availableFilters).map(([category, values]) => (
                <Accordion
                    key={category}
                    disableGutters
                    elevation={0}
                    sx={{
                        '&:before': { display: 'none' },
                        mb: 1.5,
                        borderRadius: '4px !important',
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.primary.main}`,
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon color="primary" />}
                        sx={{
                            minHeight: 40,
                            '& .MuiAccordionSummary-content': { my: 1 },
                        }}
                    >
                        <Typography
                            color="primary"
                            fontWeight="bold"
                            textTransform="capitalize"
                            fontSize="0.9rem"
                        >
                            {category}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, pb: 1 }}>
                        <FormGroup>
                            {values.map(val => (
                                <FormControlLabel
                                    key={val}
                                    label={
                                        <Typography variant="body2">
                                            {val}
                                        </Typography>
                                    }
                                    control={
                                        <Checkbox
                                            size="small"
                                            color="primary"
                                            sx={{ py: 0.5 }}
                                            checked={(
                                                filterValues[category] || []
                                            ).includes(val)}
                                            onChange={() =>
                                                handleToggle(category, val)
                                            }
                                        />
                                    }
                                />
                            ))}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

// 2. Custom Card List
const HubCardList = () => {
    const theme = useTheme();
    const translate = useTranslate();

    const { data: items } = useListContext();

    if (!items || items.length === 0) {
        return (
            <Typography variant="body1" color="text.secondary" mt={4}>
                {translate('pages.hub.empty', {
                    _: 'No templates match your current filters.',
                })}
            </Typography>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {items.map((item, index) => (
                <Card
                    key={item.id || index}
                    elevation={0}
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
                            {[`v${item.metadata?.version}`].map(lbl => (
                                <Chip
                                    key={lbl}
                                    label={lbl}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 1,
                                        height: 22,
                                        fontSize: '0.75rem',
                                    }}
                                />
                            ))}
                        </Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            mb={2}
                        >
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
            ))}
        </Box>
    );
};

// 3. Layout Wrapper
const HubLayout = () => {
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();
    const { resource = 'functions' } = useListContext();

    const singularLabel = getResourceLabel(resource, 1);

    const fullItems = catalogData.catalog.functions;
    const availableFilters = useMemo(
        () => extractFilters(fullItems),
        [fullItems]
    );

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <PageTitle
                text={translate('pages.hub.title', {
                    _: `Create a new ${singularLabel}`,
                    resource: singularLabel,
                })}
                secondaryText={translate('pages.hub.subtitle', {
                    _: 'Browse the available templates',
                })}
                icon={<DataObjectIcon fontSize={'large'} />}
            />

            <FlatCard
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 4,
                    p: { xs: 3, md: 4 },
                }}
            >
                <HubSidebar availableFilters={availableFilters} />
                <HubCardList />
            </FlatCard>
        </Container>
    );
};

// 4. Page Root Component
export const HubPage = () => {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});

    const filteredItems = useMemo(() => {
        const fullItems = catalogData.catalog.functions;
        return fullItems.filter(item => {
            const searchLower = (filterValues.q || '').toLowerCase();
            if (
                searchLower &&
                ![
                    item.metadata?.name,
                    item.metadata?.description,
                    item.name,
                ].some(field =>
                    (field || '').toLowerCase().includes(searchLower)
                )
            )
                return false;

            const activeCats = Object.keys(filterValues).filter(
                c => c !== 'q' && filterValues[c]?.length > 0
            );
            if (!activeCats.length) return true;

            const labels = item.metadata?.labels || [];
            return activeCats.every(cat =>
                filterValues[cat].some((val: string) =>
                    labels.includes(`${cat}:${val}`)
                )
            );
        });
    }, [filterValues]);

    const listContext = useList({ data: filteredItems });

    const customContext = {
        ...listContext,
        filterValues,
        setFilters: (filters: any) => setFilterValues(filters),
    };

    return (
        <ListContextProvider value={customContext}>
            <HubLayout />
        </ListContextProvider>
    );

    /* * FUTURE TODO:
     * In the future with dataProvider we can delete lines at 162 completely
     * and replace them with:
     * return (
     * <ListBase resource="functions" >
     * <HubLayout />
     * </ListBase>
     * );
     */
};
