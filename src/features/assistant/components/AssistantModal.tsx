// SPDX-FileCopyrightText: © 2026 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import React, { FC, forwardRef } from 'react';
import { useTranslate } from 'react-admin';
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    useTheme,
    Chip,
    Paper,
    Fab,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { AssistantModalPrimitive } from '@assistant-ui/react';
import { useAssistant } from '../AssistantContext';
import { AssistantThread } from './AssistantThread';
import { useModalResize } from './useModalResize';

const ResizeHandle: FC<{ onPointerDown: (e: React.PointerEvent) => void }> = ({
    onPointerDown,
}) => {
    const theme = useTheme();

    return (
        <Box
            onPointerDown={onPointerDown}
            sx={{
                display: { xs: 'none', sm: 'flex' },
                position: 'absolute',
                top: 0,
                left: 0,
                width: 22,
                height: 22,
                cursor: 'nwse-resize',
                zIndex: 12,
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover .corner-grip': {
                    borderColor: 'primary.main',
                    opacity: 1,
                },
            }}
            title="Drag to resize"
        >
            <Box
                className="corner-grip"
                sx={{
                    width: 9,
                    height: 9,
                    borderTop: '2px solid',
                    borderLeft: '2px solid',
                    borderColor:
                        theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.35)'
                            : 'rgba(0, 0, 0, 0.3)',
                    borderTopLeftRadius: '3px',
                    transition: 'border-color 0.2s, opacity 0.2s',
                    pointerEvents: 'none',
                }}
            />
        </Box>
    );
};

/**
 * Floating action button trigger with tooltip and open/closed icon transition.
 */
interface AssistantModalTriggerProps {
    isOpen: boolean;
}

const AssistantModalTrigger = forwardRef<
    HTMLButtonElement,
    AssistantModalTriggerProps
>(function AssistantModalTrigger({ isOpen, ...props }, ref) {
    const translate = useTranslate();
    const tooltip = isOpen
        ? translate('messages.assistant.close', { _: 'Close' })
        : translate('messages.assistant.digitalhub_ai_assistant', {
              _: 'DigitalHub AI Assistant',
          });

    return (
        <Tooltip title={tooltip} placement="left">
            <Fab
                ref={ref}
                color="primary"
                aria-label={tooltip}
                {...props}
                sx={{
                    width: 52,
                    height: 52,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.28)',
                    transition: 'all 0.2s cubic-bezier(0.2, 0, 0, 1)',
                    '&:hover': {
                        transform: 'scale(1.06)',
                    },
                }}
            >
                {isOpen ? (
                    <CloseIcon sx={{ fontSize: 24 }} />
                ) : (
                    <AutoAwesomeIcon sx={{ fontSize: 24 }} />
                )}
            </Fab>
        </Tooltip>
    );
});

/**
 * Modal header displaying the title, active project context chip, and actions.
 */
interface AssistantModalHeaderProps {
    currentProject?: string;
    onReset: () => void;
    onClose: () => void;
}

const AssistantModalHeader: FC<AssistantModalHeaderProps> = ({
    currentProject,
    onReset,
    onClose,
}) => {
    const theme = useTheme();
    const translate = useTranslate();

    return (
        <Box
            sx={{
                p: 1.5,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor:
                    theme.palette.mode === 'dark'
                        ? theme.palette.background.paper
                        : theme.palette.background.default,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                    minWidth: 0,
                }}
            >
                <AutoAwesomeIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={700} noWrap>
                    {translate('messages.assistant.title', {
                        _: 'DigitalHub Assistant',
                    })}
                </Typography>
                {currentProject ? (
                    <Chip
                        size="small"
                        color="primary"
                        variant="outlined"
                        label={currentProject}
                        title={`Active Project Context: ${currentProject}`}
                        sx={{
                            height: 22,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            maxWidth: 160,
                        }}
                    />
                ) : (
                    <Chip
                        size="small"
                        variant="outlined"
                        label="No Project"
                        title="Outside project context (global)"
                        sx={{
                            height: 22,
                            fontSize: '0.75rem',
                            opacity: 0.7,
                        }}
                    />
                )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip
                    title={translate('messages.assistant.clear_session', {
                        _: 'Clear Session',
                    })}
                >
                    <IconButton size="small" onClick={onReset}>
                        <DeleteSweepIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip
                    title={translate('messages.assistant.close', {
                        _: 'Close',
                    })}
                >
                    <IconButton size="small" onClick={onClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

/**
 * Main Assistant Modal component
 */
export const AssistantModal: FC = () => {
    const theme = useTheme();
    const { size, startResizing } = useModalResize();
    const {
        isOpen,
        openAssistant,
        closeAssistant,
        resetThread,
        currentProject,
    } = useAssistant();

    return (
        <AssistantModalPrimitive.Root
            open={isOpen}
            onOpenChange={open => (open ? openAssistant() : closeAssistant())}
        >
            <AssistantModalPrimitive.Anchor
                style={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1200,
                }}
            >
                <AssistantModalPrimitive.Trigger asChild>
                    <AssistantModalTrigger isOpen={isOpen} />
                </AssistantModalPrimitive.Trigger>
            </AssistantModalPrimitive.Anchor>

            <AssistantModalPrimitive.Content
                side="top"
                align="end"
                sideOffset={16}
                style={{
                    zIndex: 1300,
                    outline: 'none',
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        position: 'relative',
                        width: {
                            xs: 'calc(100vw - 32px)',
                            sm: `${size.width}px`,
                        },
                        height: {
                            xs: 'calc(100vh - 120px)',
                            sm: `${size.height}px`,
                        },
                        maxHeight: 'calc(100vh - 100px)',
                        maxWidth: 'calc(100vw - 32px)',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '16px',
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: theme.palette.background.paper,
                        boxShadow:
                            theme.palette.mode === 'dark'
                                ? '0 20px 48px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08)'
                                : '0 20px 48px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                        overflow: 'hidden',
                    }}
                >
                    <ResizeHandle onPointerDown={startResizing} />

                    <AssistantModalHeader
                        currentProject={currentProject}
                        onReset={resetThread}
                        onClose={closeAssistant}
                    />

                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <AssistantThread />
                    </Box>
                </Paper>
            </AssistantModalPrimitive.Content>
        </AssistantModalPrimitive.Root>
    );
};
