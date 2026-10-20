// SPDX-FileCopyrightText: © 2026 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { FC, useState } from 'react';
import {
    ThreadPrimitive,
    MessagePrimitive,
    ComposerPrimitive,
    AuiIf,
    useAuiState,
} from '@assistant-ui/react';
import {
    Box,
    Typography,
    IconButton,
    Tooltip,
    Paper,
    Avatar,
    useTheme,
    alpha,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import PersonIcon from '@mui/icons-material/Person';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FolderIcon from '@mui/icons-material/Folder';
import TableChartIcon from '@mui/icons-material/TableChart';
import CodeIcon from '@mui/icons-material/Code';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BoltIcon from '@mui/icons-material/Bolt';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ToolCallView } from './ToolCallView';
import { ToolGroupView } from './ToolGroupView';
import { useTranslate } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { useAssistant } from '../AssistantContext';

const SUGGESTIONS = [
    {
        title: 'Learn DigitalHub',
        prompt: 'How does DigitalHub work?',
        icon: MenuBookIcon,
        color: 'info.main',
    },
    {
        title: 'Work with Data',
        prompt: 'How do I manage data in DigitalHub?',
        icon: TableChartIcon,
        color: 'success.main',
    },
    {
        title: 'Build & Run',
        prompt: 'How do I create and run a function?',
        icon: BoltIcon,
        color: 'warning.main',
    },
    {
        title: 'Troubleshoot',
        prompt: 'How do I debug a failed run?',
        icon: TroubleshootIcon,
        color: 'secondary.main',
    },
];

// Markdown text renderer for assistant message parts
const MarkdownContent: FC = () => {
    const text = useAuiState(s => {
        if (s.part.type !== 'text' && s.part.type !== 'reasoning') return null;
        return s.part.text;
    });
    const theme = useTheme();
    const navigate = useNavigate();

    if (!text) return null;

    return (
        <Box
            sx={{
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: 'text.primary',
                '& p': { my: 0.8 },
                '& pre': {
                    p: 1.5,
                    borderRadius: 1.5,
                    backgroundColor:
                        theme.palette.mode === 'dark'
                            ? alpha(theme.palette.common.white, 0.05)
                            : alpha(theme.palette.grey[500], 0.08),
                    overflowX: 'auto',
                    fontSize: '0.82rem',
                    fontFamily: 'monospace',
                    border: '1px solid',
                    borderColor: 'divider',
                    my: 1,
                },
                '& code': {
                    px: 0.6,
                    py: 0.2,
                    borderRadius: 1,
                    backgroundColor:
                        theme.palette.mode === 'dark'
                            ? alpha(theme.palette.common.white, 0.08)
                            : alpha(theme.palette.grey[500], 0.12),
                    fontFamily: 'monospace',
                    fontSize: '0.82rem',
                },
                '& pre code': {
                    p: 0,
                    backgroundColor: 'transparent',
                },
                '& table': {
                    width: '100%',
                    borderCollapse: 'collapse',
                    my: 1.5,
                    fontSize: '0.85rem',
                },
                '& th, & td': {
                    p: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    textAlign: 'left',
                },
                '& th': {
                    backgroundColor:
                        theme.palette.mode === 'dark'
                            ? alpha(theme.palette.common.white, 0.06)
                            : alpha(theme.palette.grey[500], 0.08),
                    fontWeight: 600,
                },
                '& ul, & ol': {
                    pl: 2.5,
                    my: 0.8,
                },
                '& li': {
                    my: 0.3,
                },
                '& a': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            }}
        >
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    a: ({ href, children, ...rest }) => {
                        const isInternal =
                            href &&
                            (href.startsWith('/') || href.startsWith('#'));
                        if (isInternal) {
                            return (
                                <a
                                    href={href}
                                    {...rest}
                                    onClick={e => {
                                        if (
                                            !e.ctrlKey &&
                                            !e.metaKey &&
                                            !e.shiftKey
                                        ) {
                                            e.preventDefault();
                                            navigate(href);
                                        }
                                    }}
                                >
                                    {children}
                                </a>
                            );
                        }
                        return (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                {...rest}
                            >
                                {children}
                            </a>
                        );
                    },
                }}
            >
                {text}
            </ReactMarkdown>
        </Box>
    );
};

const ToolCallRenderer: FC<any> = props => {
    const { toolName, args, result, status } = props;
    const isRunning = status?.type === 'running';
    const isError = status?.type === 'incomplete' && Boolean(status?.error);

    return (
        <ToolCallView
            name={toolName || 'tool_call'}
            args={args}
            result={result}
            status={isRunning ? 'running' : isError ? 'error' : 'complete'}
            error={status?.error}
        />
    );
};

// Message bubble component
const UserMessageText: FC = () => {
    const text = useAuiState(s => {
        if (s.part.type !== 'text' && s.part.type !== 'reasoning') return null;
        return s.part.text;
    });
    return (
        <Typography
            variant="body2"
            sx={{
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
            }}
        >
            {text}
        </Typography>
    );
};

const MessageView: FC = () => {
    const theme = useTheme();
    const translate = useTranslate();
    const [copied, setCopied] = useState(false);

    return (
        <MessagePrimitive.Root
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                margin: '8px 0',
            }}
        >
            <AuiIf condition={s => s.message.role === 'user'}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1.5,
                        width: '100%',
                        pl: 4,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            borderRadius: '16px 16px 4px 16px',
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            maxWidth: '85%',
                            wordBreak: 'break-word',
                        }}
                    >
                        <MessagePrimitive.Parts
                            components={{
                                Text: UserMessageText,
                            }}
                        />
                    </Paper>
                    <Avatar
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: theme.palette.secondary.light,
                            fontSize: '0.85rem',
                        }}
                    >
                        <PersonIcon fontSize="small" />
                    </Avatar>
                </Box>
            </AuiIf>

            <AuiIf condition={s => s.message.role === 'assistant'}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        gap: 1.5,
                        width: '100%',
                        pr: 2,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 32,
                            height: 32,
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            mt: 0.5,
                        }}
                    >
                        <AutoAwesomeIcon fontSize="small" />
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0, maxWidth: '92%' }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: '4px 16px 16px 16px',
                                backgroundColor:
                                    theme.palette.mode === 'dark'
                                        ? alpha(
                                              theme.palette.background.paper,
                                              0.6
                                          )
                                        : theme.palette.background.paper,
                                border: '1px solid',
                                borderColor: 'divider',
                                wordBreak: 'break-word',
                            }}
                        >
                            <MessagePrimitive.Parts
                                components={{
                                    Text: MarkdownContent,
                                    tools: {
                                        Fallback: ToolCallRenderer,
                                    },
                                    ToolGroup: ToolGroupView,
                                }}
                            />
                        </Paper>

                        {/* Message actions */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                mt: 0.5,
                            }}
                        >
                            <Tooltip
                                title={
                                    copied
                                        ? translate(
                                              'messages.assistant.copied',
                                              {
                                                  _: 'Copied!',
                                              }
                                          )
                                        : translate(
                                              'messages.assistant.copy_response',
                                              {
                                                  _: 'Copy response',
                                              }
                                          )
                                }
                            >
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setCopied(true);
                                        setTimeout(
                                            () => setCopied(false),
                                            2000
                                        );
                                    }}
                                    sx={{
                                        opacity: 0.7,
                                        '&:hover': { opacity: 1 },
                                    }}
                                >
                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                </Box>
            </AuiIf>
        </MessagePrimitive.Root>
    );
};

// Thread empty state with starter suggestions
const EmptyState: FC = () => {
    const theme = useTheme();
    const translate = useTranslate();
    const { currentProject } = useAssistant();

    const emptyDescription = currentProject
        ? translate('messages.assistant.empty_state_project_description', {
              project: currentProject,
              _: `I'm ready to help you work inside project "${currentProject}". You can create functions, register dataitems, and execute runs directly here.`,
          })
        : translate('messages.assistant.empty_state_description', {
              _: 'I can help you explore projects, manage functions and artifacts, execute workflows, and inspect runs directly on DigitalHub CORE.',
          });

    const activeSuggestions = currentProject
        ? [
              {
                  title: 'Explore Project',
                  prompt: `List all functions, dataitems, and artifacts in ${currentProject}`,
                  icon: FolderIcon,
                  color: 'primary.main',
              },
              {
                  title: 'Create Function',
                  prompt: `Create and build a simple Python function in ${currentProject}`,
                  icon: CodeIcon,
                  color: 'info.main',
              },
              {
                  title: 'Register Data',
                  prompt: `Register a sample CSV dataitem in ${currentProject}`,
                  icon: TableChartIcon,
                  color: 'success.main',
              },
              {
                  title: 'Troubleshoot',
                  prompt: `How do I inspect and debug failed runs in ${currentProject}?`,
                  icon: TroubleshootIcon,
                  color: 'secondary.main',
              },
          ]
        : SUGGESTIONS;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                py: 6,
                px: 2,
                height: '100%',
            }}
        >
            <Avatar
                sx={{
                    width: 56,
                    height: 56,
                    mb: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                }}
            >
                <AutoAwesomeIcon sx={{ fontSize: 32 }} />
            </Avatar>

            <Typography variant="h6" fontWeight={700} gutterBottom>
                {translate('messages.assistant.digitalhub_ai_assistant', {
                    _: 'DigitalHub AI Assistant',
                })}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 440, mb: 4 }}
            >
                {emptyDescription}
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1.5,
                    width: '100%',
                    maxWidth: 500,
                }}
            >
                {activeSuggestions.map((item, idx) => (
                    <ThreadPrimitive.Suggestion
                        key={idx}
                        prompt={item.prompt}
                        send={true}
                        asChild
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.15s ease',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    backgroundColor: alpha(
                                        theme.palette.primary.main,
                                        0.04
                                    ),
                                    transform: 'translateY(-1px)',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.2,
                                    mb: 0.5,
                                }}
                            >
                                <item.icon
                                    fontSize="small"
                                    sx={{
                                        color: item.color || 'primary.main',
                                        flexShrink: 0,
                                    }}
                                />
                                <Typography variant="body2" fontWeight={600}>
                                    {item.title}
                                </Typography>
                            </Box>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}
                            >
                                {item.prompt}
                            </Typography>
                        </Paper>
                    </ThreadPrimitive.Suggestion>
                ))}
            </Box>
        </Box>
    );
};

export const AssistantThread: FC = () => {
    const theme = useTheme();
    const translate = useTranslate();
    return (
        <ThreadPrimitive.Root
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
                backgroundColor:
                    theme.palette.mode === 'dark'
                        ? theme.palette.background.default
                        : alpha(theme.palette.grey[500], 0.04),
            }}
        >
            {/* Scrollable messages viewport */}
            <ThreadPrimitive.Viewport
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <ThreadPrimitive.Empty>
                    <EmptyState />
                </ThreadPrimitive.Empty>

                <ThreadPrimitive.Messages
                    components={{
                        Message: MessageView,
                    }}
                />
            </ThreadPrimitive.Viewport>

            {/* Input Composer */}
            <ComposerPrimitive.Root
                style={{
                    padding: '12px 16px',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 1,
                        p: 1,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor:
                            theme.palette.mode === 'dark'
                                ? alpha(theme.palette.common.white, 0.05)
                                : alpha(theme.palette.grey[500], 0.05),
                        '&:focus-within': {
                            borderColor: 'primary.main',
                            boxShadow: `0 0 0 2px ${alpha(
                                theme.palette.primary.main,
                                0.2
                            )}`,
                        },
                    }}
                >
                    <ComposerPrimitive.Input
                        placeholder={translate(
                            'messages.assistant.ask_placeholder',
                            {
                                _: 'Ask DigitalHub Assistant... (Shift+Enter for new line)',
                            }
                        )}
                        rows={1}
                        maxRows={6}
                        autoFocus
                        style={{
                            flex: 1,
                            border: 'none',
                            outline: 'none',
                            resize: 'none',
                            background: 'transparent',
                            color: theme.palette.text.primary,
                            fontFamily: theme.typography.fontFamily,
                            fontSize: '0.9rem',
                            padding: '6px 8px',
                            lineHeight: 1.4,
                        }}
                    />

                    {/* Send / Stop toggle */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ComposerPrimitive.Cancel asChild>
                            <IconButton
                                size="small"
                                color="error"
                                title={translate(
                                    'messages.assistant.stop_generating',
                                    {
                                        _: 'Stop generating',
                                    }
                                )}
                                sx={{
                                    bgcolor: alpha(
                                        theme.palette.error.main,
                                        0.1
                                    ),
                                    '&:hover': {
                                        bgcolor: alpha(
                                            theme.palette.error.main,
                                            0.2
                                        ),
                                    },
                                }}
                            >
                                <StopIcon fontSize="small" />
                            </IconButton>
                        </ComposerPrimitive.Cancel>

                        <ComposerPrimitive.Send asChild>
                            <IconButton
                                size="small"
                                color="primary"
                                title={translate(
                                    'messages.assistant.send_message',
                                    {
                                        _: 'Send message',
                                    }
                                )}
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    '&:hover': { bgcolor: 'primary.dark' },
                                    '&.Mui-disabled': {
                                        bgcolor: 'action.disabledBackground',
                                        color: 'action.disabled',
                                    },
                                }}
                            >
                                <SendIcon fontSize="small" />
                            </IconButton>
                        </ComposerPrimitive.Send>
                    </Box>
                </Box>
            </ComposerPrimitive.Root>
        </ThreadPrimitive.Root>
    );
};
