// SPDX-FileCopyrightText: © 2026 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { useTranslate } from 'react-admin';
import {
    Box,
    Typography,
    Collapse,
    Tooltip,
    IconButton,
    CircularProgress,
    useTheme,
    alpha,
} from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

export interface ToolCallViewProps {
    name: string;
    args?: any;
    result?: any;
    status?: 'running' | 'complete' | 'success' | 'error' | 'requires-action';
    error?: string;
}

export const ToolGroupContext = React.createContext<{ inGroup: boolean }>({
    inGroup: false,
});

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
    const [copiedParam, setCopiedParam] = useState<boolean>(false);
    const [copiedResult, setCopiedResult] = useState<boolean>(false);

    const isRunning = status === 'running';
    const isError = status === 'error' || Boolean(error);

    const getToolIcon = (toolName: string) => {
        const lower = toolName.toLowerCase();
        const sx = { fontSize: 16 };
        if (
            lower.includes('knowledge') ||
            lower.includes('doc') ||
            lower.includes('search')
        ) {
            return <MenuBookOutlinedIcon sx={sx} />;
        }
        if (lower.includes('workflow') || lower.includes('pipeline')) {
            return <AccountTreeOutlinedIcon sx={sx} />;
        }
        if (
            lower.includes('table') ||
            lower.includes('sql') ||
            lower.includes('data')
        ) {
            return <TableChartOutlinedIcon sx={sx} />;
        }
        if (
            lower.includes('file') ||
            lower.includes('artifact') ||
            lower.includes('store')
        ) {
            return <FolderOutlinedIcon sx={sx} />;
        }
        if (lower.includes('secret') || lower.includes('key')) {
            return <VpnKeyOutlinedIcon sx={sx} />;
        }
        if (
            lower.includes('python') ||
            lower.includes('code') ||
            lower.includes('func')
        ) {
            return <CodeOutlinedIcon sx={sx} />;
        }
        if (
            lower.includes('terminal') ||
            lower.includes('job') ||
            lower.includes('run') ||
            lower.includes('dh')
        ) {
            return <TerminalOutlinedIcon sx={sx} />;
        }
        return <BuildOutlinedIcon sx={sx} />;
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

    const handleCopy = (
        e: React.MouseEvent,
        data: any,
        setCopied: (v: boolean) => void
    ) => {
        e.stopPropagation();
        const textToCopy = formatPayload(data);
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Box sx={{ my: 0.25 }}>
            {/* Tool Item Row: [icon] tool_name > */}
            <Box
                onClick={() => setExpanded(prev => !prev)}
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    py: 0.35,
                    px: 0.5,
                    borderRadius: 1,
                    cursor: 'pointer',
                    userSelect: 'none',
                    transition: 'background-color 0.15s ease-in-out',
                    '&:hover': {
                        backgroundColor:
                            theme.palette.mode === 'dark'
                                ? alpha(theme.palette.common.white, 0.04)
                                : alpha(theme.palette.common.black, 0.04),
                    },
                }}
            >
                {/* Left icon */}
                <Box
                    sx={{
                        color: isError ? 'error.main' : 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                    }}
                >
                    {isRunning ? (
                        <CircularProgress size={13} color="inherit" />
                    ) : (
                        getToolIcon(name)
                    )}
                </Box>

                {/* Monospace Tool Name */}
                <Typography
                    component="span"
                    sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.8125rem',
                        color: isError ? 'error.main' : 'text.primary',
                        fontWeight: 500,
                        flexShrink: 0,
                    }}
                >
                    {name}
                </Typography>

                {/* Right chevron */}
                <Box
                    sx={{
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                    }}
                >
                    {expanded ? (
                        <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
                    ) : (
                        <KeyboardArrowRightIcon sx={{ fontSize: 16 }} />
                    )}
                </Box>
            </Box>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box
                    sx={{
                        pl: 3,
                        pt: 1,
                        pb: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                    }}
                >
                    {args !== undefined && (
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    display: 'block',
                                    mb: 0.5,
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
                                sx={{
                                    position: 'relative',
                                    borderRadius: 2,
                                    backgroundColor:
                                        theme.palette.mode === 'dark'
                                            ? alpha(
                                                  theme.palette.common.white,
                                                  0.04
                                              )
                                            : alpha(
                                                  theme.palette.grey[500],
                                                  0.08
                                              ),
                                    overflow: 'hidden',
                                    '&:hover .copy-btn': {
                                        opacity: 1,
                                    },
                                }}
                            >
                                <Tooltip
                                    title={
                                        copiedParam
                                            ? translate(
                                                  'messages.assistant.tool.copied',
                                                  { _: 'Copied!' }
                                              )
                                            : translate(
                                                  'messages.assistant.tool.copy_parameters',
                                                  { _: 'Copy' }
                                              )
                                    }
                                >
                                    <IconButton
                                        className="copy-btn"
                                        size="small"
                                        onClick={e =>
                                            handleCopy(e, args, setCopiedParam)
                                        }
                                        sx={{
                                            position: 'absolute',
                                            top: 6,
                                            right: 6,
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                            p: 0.5,
                                            color: 'text.secondary',
                                            backgroundColor: alpha(
                                                theme.palette.background.paper,
                                                0.7
                                            ),
                                            '&:hover': {
                                                backgroundColor:
                                                    theme.palette.background
                                                        .paper,
                                            },
                                        }}
                                    >
                                        {copiedParam ? (
                                            <CheckIcon
                                                sx={{
                                                    fontSize: 14,
                                                    color: 'success.main',
                                                }}
                                            />
                                        ) : (
                                            <ContentCopyIcon
                                                sx={{ fontSize: 14 }}
                                            />
                                        )}
                                    </IconButton>
                                </Tooltip>
                                <Box
                                    component="pre"
                                    sx={{
                                        m: 0,
                                        p: 1.5,
                                        fontFamily: 'monospace',
                                        fontSize: '0.78rem',
                                        lineHeight: 1.5,
                                        overflowX: 'auto',
                                        maxHeight: 240,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-all',
                                        color: 'text.primary',
                                    }}
                                >
                                    {formatPayload(args) || '(no parameters)'}
                                </Box>
                            </Box>
                        </Box>
                    )}

                    {/* Result Block */}
                    {(result !== undefined || error) && (
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: isError
                                        ? 'error.main'
                                        : 'text.secondary',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    display: 'block',
                                    mb: 0.5,
                                }}
                            >
                                {isError
                                    ? translate(
                                          'messages.assistant.tool.error_output',
                                          { _: 'Error' }
                                      )
                                    : translate(
                                          'messages.assistant.tool.result',
                                          {
                                              _: 'Result',
                                          }
                                      )}
                            </Typography>
                            <Box
                                sx={{
                                    position: 'relative',
                                    borderRadius: 2,
                                    backgroundColor: isError
                                        ? alpha(theme.palette.error.main, 0.08)
                                        : theme.palette.mode === 'dark'
                                        ? alpha(
                                              theme.palette.common.white,
                                              0.04
                                          )
                                        : alpha(theme.palette.grey[500], 0.08),
                                    overflow: 'hidden',
                                    '&:hover .copy-btn': {
                                        opacity: 1,
                                    },
                                }}
                            >
                                <Tooltip
                                    title={
                                        copiedResult
                                            ? translate(
                                                  'messages.assistant.tool.copied',
                                                  { _: 'Copied!' }
                                              )
                                            : translate(
                                                  'messages.assistant.tool.copy_result',
                                                  { _: 'Copy' }
                                              )
                                    }
                                >
                                    <IconButton
                                        className="copy-btn"
                                        size="small"
                                        onClick={e =>
                                            handleCopy(
                                                e,
                                                error || result,
                                                setCopiedResult
                                            )
                                        }
                                        sx={{
                                            position: 'absolute',
                                            top: 6,
                                            right: 6,
                                            opacity: 0,
                                            transition: 'opacity 0.2s',
                                            p: 0.5,
                                            color: 'text.secondary',
                                            backgroundColor: alpha(
                                                theme.palette.background.paper,
                                                0.7
                                            ),
                                            '&:hover': {
                                                backgroundColor:
                                                    theme.palette.background
                                                        .paper,
                                            },
                                        }}
                                    >
                                        {copiedResult ? (
                                            <CheckIcon
                                                sx={{
                                                    fontSize: 14,
                                                    color: 'success.main',
                                                }}
                                            />
                                        ) : (
                                            <ContentCopyIcon
                                                sx={{ fontSize: 14 }}
                                            />
                                        )}
                                    </IconButton>
                                </Tooltip>
                                <Box
                                    component="pre"
                                    sx={{
                                        m: 0,
                                        p: 1.5,
                                        fontFamily: 'monospace',
                                        fontSize: '0.78rem',
                                        lineHeight: 1.5,
                                        overflowX: 'auto',
                                        maxHeight: 280,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-all',
                                        color: isError
                                            ? theme.palette.error.main
                                            : 'text.primary',
                                    }}
                                >
                                    {error || formatPayload(result)}
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
};
