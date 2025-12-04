/* SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

SPDX-License-Identifier: Apache-2.0 */

import { twMerge } from 'tailwind-merge';
import './chatTheme.css';
import { ChatTheme, chatTheme as defaultTheme } from 'reachat';

export const createChatTheme = (

): ChatTheme => {
    const bgPrimary = `bg-[var(--primary)]`;
    const bgPrimaryAlpha = `bg-[var(--primary-alpha)]`;
    const hoverBgPrimary = `hover:bg-[var(--primary-hover)]`;
    const hoverBgPrimaryAlpha = `hover:bg-[var(--primary-hover-alpha)]`;
    const borderPrimary = `border-[var(--primary)]`;
    const ringPrimary = `focus:ring-[var(--primary)]`;
    const textPrimary = `text-[var(--primary)]`;

    return {
        ...defaultTheme,

        base: twMerge(
            defaultTheme.base,
            'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden'
        ),

        sessions: {
            ...defaultTheme.sessions,
            console: twMerge(
                defaultTheme.sessions.console,
                'bg-gray-50 dark:bg-gray-900 w-[280px] border-r border-gray-200 dark:border-gray-700'
            ),
            create: twMerge(
                defaultTheme.sessions.create,
                `flex items-center justify-center w-full gap-2 px-4 py-3 mb-4 font-medium text-white transition-all rounded-lg shadow-md ${bgPrimary} ${hoverBgPrimary} hover:shadow-lg active:scale-95 cursor-pointer mx-auto`
            ),
            session: {
                ...defaultTheme.sessions.session,
                base: twMerge(
                    defaultTheme.sessions.session.base,
                    'rounded-lg px-3 py-3 text-sm font-medium transition-all text-gray-600 mx-2 cursor-pointer',
                    hoverBgPrimaryAlpha
                ),
                active: twMerge(
                    defaultTheme.sessions.session.active,
                    `${bgPrimaryAlpha} border-l-4 ${borderPrimary} ${textPrimary} shadow-xs`
                ),
                delete: 'text-gray-400 hover:text-red-500 p-1',
            },
        },

        messages: {
            ...defaultTheme.messages,
            base: twMerge(
                defaultTheme.messages.base,
                'bg-white dark:bg-[#0B0B0C] p-4'
            ),

            message: {
                ...defaultTheme.messages.message,
                base: twMerge(
                    defaultTheme.messages.message.base,
                    'mb-6 gap-3 max-w-3xl mx-auto w-full'
                ),

                question: twMerge(
                    defaultTheme.messages.message.question,
                    `${bgPrimaryAlpha} text-gray-700`,
                    'rounded-2xl rounded-tr-sm px-5 py-3 shadow-md ml-auto max-w-[80%]'
                ),

                response: twMerge(
                    defaultTheme.messages.message.response,
                    'bg-white dark:bg-[#1E1E20] text-gray-800 dark:text-[#E5E5E7]',
                    'border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl rounded-tl-sm px-5 py-4 mr-auto max-w-[80%]'
                ),

                footer: {
                    ...defaultTheme.messages.message.footer,
                    base: 'flex gap-3 mt-2 px-1 text-gray-400',
                    copy: `hover:${textPrimary} transition-colors cursor-pointer`,
                    refresh: `hover:${textPrimary} transition-colors cursor-pointer`,
                    upvote: 'hidden',
                    downvote: 'hidden',
                },
            },
        },

        input: {
            ...defaultTheme.input,
            base: twMerge(
                defaultTheme.input.base,
                'bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700'
            ),
            input: twMerge(
                defaultTheme.input.input,
                `bg-white dark:bg-gray-800 text-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 ${ringPrimary} focus:border-transparent outline-hidden transition-all shadow-inner`
            ),
            actions: {
                ...defaultTheme.input.actions,
                base: 'flex items-center gap-2 ml-3',
                send: `${bgPrimary} text-white w-12 h-10 rounded-lg flex items-center justify-center shadow-md transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`,
                stop: 'bg-red-500 hover:bg-red-600 text-white w-12 h-10 rounded-lg flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer',
            },
        },
    };
};
