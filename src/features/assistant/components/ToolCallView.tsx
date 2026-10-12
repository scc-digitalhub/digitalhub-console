// SPDX-FileCopyrightText: © 2026 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { useTranslate } from 'react-admin';
import {
    Box,
    Paper,
    Typography,
    Chip,
    IconButton,
    Collapse,
    Tooltip,
    CircularProgress,
    useTheme,
    alpha,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TerminalIcon from '@mui/icons-material/Terminal';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';

export interface ToolCallViewProps {
    name: string;
    args?: any;
    result?: any;
    status?: 'running' | 'complete' | 'success' | 'error' | 'requires-action';
    error?: string;
}

export const ToolCallView: React.FC<ToolCallViewProps> = ({
    name,
    args,
    result,
    status = 'complete',
    error,
}) => {
    const theme = useTheme();
    const translate = useTranslate();
    const [expanded, setExpanded] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const isRunning = status === 'running';
    const isError = status === 'error' || Boolean(error);
    const isSuccess = !isRunning && !isError;

    const getToolIcon = (toolName: string) => {
        const lower = toolName.toLowerCase();
        if (lower.includes('knowledge') || lower.includes('search')) {
            return (
                <MenuBookIcon
                    fontSize="small"
                    sx={{ color: theme.palette.info.main }}
                />
            );
        }
        if (lower.includes('secret')) {
            return (
                <VpnKeyIcon
                    fontSize="small"
                    sx={{ color: theme.palette.warning.main }}
                />
            );
        }
        if (lower.includes('sdk') || lower.includes('dh')) {
            return (
                <TerminalIcon
                    fontSize="small"
                    sx={{ color: theme.palette.success.main }}
                />
            );
        }
        if (lower.includes('dynamic') || lower.includes('tool')) {
            return (
                <SettingsSuggestIcon
                    fontSize="small"
                    sx={{ color: theme.palette.secondary.main }}
                />
            );
        }
        return (
            <BuildCircleIcon
                fontSize="small"
                sx={{ color: theme.palette.text.secondary }}
            />
        );
    };

    const formatPayload = (data: any): string => {
        if (data === undefined || data === null) return '';
        if (typeof data === 'string') {
            try {
                const parsed = JSON.parse(data);
                return JSON.stringify(parsed, null, 2);
            } catch {
                return data;
            }
        }
        return JSON.stringify(data, null, 2);
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        const textToCopy = formatPayload(result || args);
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                my: 1,
                border: '1px solid',
                borderColor: isError
                    ? 'error.light'
                    : isRunning
                    ? 'info.light'
                    : 'divider',
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor:
                    theme.palette.mode === 'dark'
                        ? alpha(theme.palette.common.white, 0.03)
                        : alpha(theme.palette.grey[500], 0.05),
                transition: theme.transitions.create(
                    ['background-color', 'border-color'],
                    {
                        duration: theme.transitions.duration.shorter,
                    }
                ),
            }}
        >
            {/* Header bar */}
            <Box
                onClick={() => setExpanded(!expanded)}
                sx={{
                    px: 1.5,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    '&:hover': {
                        backgroundColor:
                            theme.palette.mode === 'dark'
                                ? alpha(theme.palette.common.white, 0.06)
                                : alpha(theme.palette.common.black, 0.04),
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        minWidth: 0,
                    }}
                >
                    {getToolIcon(name)}
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                            fontFamily: 'monospace',
                            color: 'text.primary',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {name}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {isRunning && (
                        <Chip
                            size="small"
                            icon={
                                <CircularProgress size={12} color="inherit" />
                            }
                            label={translate(
                                'messages.assistant.tool.status_executing',
                                {
                                    _: 'Executing...',
                                }
                            )}
                            color="info"
                            variant="outlined"
                            sx={{ height: 22, fontSize: '0.75rem' }}
                        />
                    )}
                    {isSuccess && (
                        <Chip
                            size="small"
                            icon={
                                <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
                            }
                            label={translate(
                                'messages.assistant.tool.status_success',
                                {
                                    _: 'Success',
                                }
                            )}
                            color="success"
                            variant="outlined"
                            sx={{ height: 22, fontSize: '0.75rem' }}
                        />
                    )}
                    {isError && (
                        <Chip
                            size="small"
                            icon={<ErrorOutlineIcon sx={{ fontSize: 14 }} />}
                            label={translate(
                                'messages.assistant.tool.status_error',
                                {
                                    _: 'Error',
                                }
                            )}
                            color="error"
                            variant="outlined"
                            sx={{ height: 22, fontSize: '0.75rem' }}
                        />
                    )}

                    <IconButton
                        size="small"
                        onClick={e => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                        }}
                    >
                        {expanded ? (
                            <ExpandLessIcon fontSize="small" />
                        ) : (
                            <ExpandMoreIcon fontSize="small" />
                        )}
                    </IconButton>
                </Box>
            </Box>

            {/* Expandable details */}
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box
                    sx={{
                        px: 1.5,
                        pb: 1.5,
                        pt: 0.5,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        backgroundColor:
                            theme.palette.mode === 'dark'
                                ? alpha(theme.palette.background.paper, 0.6)
                                : theme.palette.background.paper,
                    }}
                >
                    {/* Arguments Section */}
                    {args !== undefined && (
                        <Box sx={{ mt: 1 }}>
                            <Typography
                                variant="caption"
                                fontWeight={700}
                                color="text.secondary"
                                sx={{
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                }}
                            >
                                {translate(
                                    'messages.assistant.tool.parameters',
                                    {
                                        _: 'Parameters',
                                    }
                                )}
                            </Typography>
                            <Box
                                component="pre"
                                sx={{
                                    m: 0,
                                    mt: 0.5,
                                    p: 1,
                                    borderRadius: 1,
                                    backgroundColor:
                                        theme.palette.mode === 'dark'
                                            ? alpha(
                                                  theme.palette.common.white,
                                                  0.05
                                              )
                                            : alpha(
                                                  theme.palette.grey[500],
                                                  0.08
                                              ),
                                    fontSize: '0.75rem',
                                    fontFamily: 'monospace',
                                    overflowX: 'auto',
                                    maxHeight: 200,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                }}
                            >
                                {formatPayload(args) ||
                                    translate(
                                        'messages.assistant.tool.no_parameters',
                                        {
                                            _: '(no parameters)',
                                        }
                                    )}
                            </Box>
                        </Box>
                    )}

                    {/* Result / Output Section */}
                    {(result !== undefined || error) && (
                        <Box sx={{ mt: 1.5 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    fontWeight={700}
                                    color={isError ? 'error' : 'text.secondary'}
                                    sx={{
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    {isError
                                        ? translate(
                                              'messages.assistant.tool.error_output',
                                              { _: 'Error Output' }
                                          )
                                        : translate(
                                              'messages.assistant.tool.result',
                                              {
                                                  _: 'Result',
                                              }
                                          )}
                                </Typography>
                                <Tooltip
                                    title={
                                        copied
                                            ? translate(
                                                  'messages.assistant.tool.copied',
                                                  { _: 'Copied!' }
                                              )
                                            : translate(
                                                  'messages.assistant.tool.copy_result',
                                                  { _: 'Copy Result' }
                                              )
                                    }
                                >
                                    <IconButton
                                        size="small"
                                        onClick={handleCopy}
                                        sx={{ p: 0.5 }}
                                    >
                                        <ContentCopyIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box
                                component="pre"
                                sx={{
                                    m: 0,
                                    mt: 0.5,
                                    p: 1,
                                    borderRadius: 1,
                                    backgroundColor: isError
                                        ? alpha(theme.palette.error.main, 0.1)
                                        : theme.palette.mode === 'dark'
                                        ? alpha(
                                              theme.palette.common.white,
                                              0.05
                                          )
                                        : alpha(theme.palette.grey[500], 0.08),
                                    color: isError
                                        ? theme.palette.error.main
                                        : theme.palette.text.primary,
                                    fontSize: '0.75rem',
                                    fontFamily: 'monospace',
                                    overflowX: 'auto',
                                    maxHeight: 260,
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                }}
                            >
                                {error || formatPayload(result)}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Collapse>
        </Paper>
    );
};
