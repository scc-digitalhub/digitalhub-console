// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Box,
    Button,
    ButtonProps,
    CardContent,
    Step,
    StepLabel,
    Stepper,
    styled,
    useTheme,
} from '@mui/material';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { Error as RaError, Toolbar, useTranslate } from 'react-admin';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { useTutorialsContext } from '../TutorialsContext';
import { Spinner } from '../../../common/components/layout/Spinner';
import MarkdownPreview from '@uiw/react-markdown-preview';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { TutorialToolbar } from './TutorialToolbar';

export const TutorialView = () => {
    const { selectedTutorial } = useTutorialsContext();
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [fileContent, setFileContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const steps = useMemo(() => {
        if (!selectedTutorial?.steps) return [];
        return selectedTutorial.steps;
    }, [selectedTutorial]);

    useEffect(() => {
        if (steps.length === 0 || !steps[activeStep].url) {
            setFileContent('');
            setLoading(false);
            setError(null);
            return;
        }

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        //TODO use toRepositoryAssetUrl
        fetch(steps[activeStep].url, { signal: controller.signal })
            .then(res =>
                res.ok ? res.text() : Promise.reject(new Error('Not Found'))
            )
            .then(text => {
                if (!controller.signal.aborted) {
                    setFileContent(text);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (err.name !== 'AbortError' && !controller.signal.aborted) {
                    setFileContent('');
                    setLoading(false);
                    setError(
                        err instanceof Error
                            ? err
                            : new Error('README fetch failed')
                    );
                }
            });

        return () => controller.abort();
    }, [activeStep, steps]);

    return (
        <>
            <TutorialToolbar />
            <FlatCard sx={{ width: '100%', pb: 2 }}>
                <CardContent>
                    <Stepper activeStep={activeStep}>
                        {steps.map(step => (
                            <Step key={step.name}>
                                <StepLabel>{step.name}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </CardContent>
                {loading ? (
                    <Spinner />
                ) : error ? (
                    <RaError
                        error={error}
                        resetErrorBoundary={() => setError(null)}
                    />
                ) : (
                    <MarkdownBox>
                        <MarkdownPreview
                            source={fileContent}
                            style={{
                                padding: 16,
                                borderRadius: 10,
                                backgroundColor:
                                    theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.08)'
                                        : 'rgba(0, 0, 0, 0.04)',
                            }}
                            wrapperElement={{
                                'data-color-mode': theme.palette.mode,
                            }}
                        />
                    </MarkdownBox>
                )}
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box>
                        <NavigationButton
                            color="secondary"
                            disabled={activeStep === 0}
                            onClick={() => setActiveStep(prev => prev - 1)}
                            label="ra.navigation.previous"
                            icon={<NavigateBeforeIcon />}
                        />
                    </Box>
                    <Box>
                        <NavigationButton
                            disabled={activeStep === steps.length - 1}
                            onClick={() => setActiveStep(prev => prev + 1)}
                            label="ra.navigation.next"
                            icon={<NavigateNextIcon />}
                        />
                    </Box>
                </Toolbar>
            </FlatCard>
        </>
    );
};

const NavigationButton = (
    props: ButtonProps & { label: string; icon: ReactElement }
) => {
    const { label, icon, ...rest } = props;
    const translate = useTranslate();

    return (
        <Button
            variant="text"
            color="primary"
            type="button"
            sx={{
                position: 'relative',
                [`& .MuiSvgIcon-root, & .MuiIcon-root`]: {
                    fontSize: 18,
                },
            }}
            {...rest}
        >
            {translate(label)} {icon}
        </Button>
    );
};

const MarkdownBox = styled(Box, {
    name: 'MarkdownBox',
    overridesResolver: (props, styles) => styles.root,
})(() => ({
    width: '100%',
    minWidth: 0,
    '& .wmde-markdown': {
        maxWidth: '100%',
        overflow: 'hidden',
        '& p, & pre, & code': {
            whiteSpace: 'pre-wrap !important',
            overflowWrap: 'anywhere !important',
            wordBreak: 'break-word !important',
        },
        '& pre': {
            overflowX: 'auto',
        },
        '& .copied': {
            visibility: 'visible !important',
        },
    },
}));
