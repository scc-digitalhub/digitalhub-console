// SPDX-FileCopyrightText: © 2026 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useMemo, useEffect } from 'react';
import { useAuiState } from '@assistant-ui/react';
import { Box, Collapse, CircularProgress } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ToolGroupContext } from './ToolCallView';

export interface ToolGroupViewProps {
    startIndex: number;
    endIndex: number;
    children?: React.ReactNode;
}

export const ToolGroupView: React.FC<ToolGroupViewProps> = ({
    startIndex,
    endIndex,
    children,
}) => {
    const count = endIndex - startIndex + 1;

    const parts = useAuiState(s => s.message.parts) as any[];
    const groupParts = useMemo(() => {
        if (!parts || !Array.isArray(parts)) return [];
        return parts.slice(startIndex, endIndex + 1);
    }, [parts, startIndex, endIndex]);

    const isRunning = groupParts.some(
        p => p.status?.type === 'running' || p.status === 'running'
    );

    const [expanded, setExpanded] = useState<boolean>(false);

    // Keep expanded while running so real-time activity is visible
    useEffect(() => {
        if (isRunning) {
            setExpanded(true);
        }
    }, [isRunning]);

    return (
        <Box sx={{ my: 0.75 }}>
            <Box
                component="button"
                onClick={() => setExpanded(prev => !prev)}
                sx={{
                    all: 'unset',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'pointer',
                    userSelect: 'none',
                    color: 'text.secondary',
                    fontSize: '0.8125rem',
                    fontWeight: 400,
                    py: 0.25,
                    mb: expanded ? 0.5 : 0,
                    transition: 'color 0.15s ease-in-out',
                    '&:hover': {
                        color: 'text.primary',
                    },
                }}
            >
                <span>
                    {count} {count === 1 ? 'tool call' : 'tool calls'}
                </span>
                {isRunning ? (
                    <CircularProgress
                        size={12}
                        sx={{ ml: 0.5, color: 'text.secondary' }}
                    />
                ) : expanded ? (
                    <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                ) : (
                    <KeyboardArrowRightIcon sx={{ fontSize: 16 }} />
                )}
            </Box>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <ToolGroupContext.Provider value={{ inGroup: true }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.25,
                            mt: 0.25,
                        }}
                    >
                        {children}
                    </Box>
                </ToolGroupContext.Provider>
            </Collapse>
        </Box>
    );
};
