/* SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

SPDX-License-Identifier: Apache-2.0 */

import { twMerge } from 'tailwind-merge';
import './chatTheme.css';
import { ChatTheme, chatTheme as defaultTheme } from 'reachat';

export const chatTheme: ChatTheme = {
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
            'flex items-center justify-center w-full gap-2 px-4 py-3 mb-4 font-medium text-white transition-all rounded-lg shadow-md bg-[#E0701B] hover:bg-[#cc5f17] hover:shadow-lg active:scale-95 cursor-pointer mx-auto'
        ),
        session: {
            ...defaultTheme.sessions.session,
            base: twMerge(
                defaultTheme.sessions.session.base,
                'rounded-lg px-3 py-3 text-sm font-medium transition-all text-gray-600 mx-2 cursor-pointer',
                'hover:bg-[#E0701B]/10 '
            ),
            active: twMerge(
                defaultTheme.sessions.session.active,
                'bg-[#E0701B]/15 border-l-4 border-[#E0701B] shadow-xs'
            ),
            delete: 'text-gray-400 hover:text-red-500 p-1',
        },
    },

    messages: {
        ...defaultTheme.messages,
        base: twMerge(
            defaultTheme.messages.base,
            'bg-white dark:bg-gray-900 p-4'
        ),
        message: {
            ...defaultTheme.messages.message,
            base: twMerge(
                defaultTheme.messages.message.base,
                'mb-6 gap-3 max-w-3xl mx-auto w-full'
            ),

            question: twMerge(
                defaultTheme.messages.message.question,
                'bg-[#E0701B] text-white shadow-md rounded-2xl rounded-tr-sm px-5 py-3 text-base leading-relaxed ml-auto max-w-[80%]'
            ),

            response: twMerge(
                defaultTheme.messages.message.response,
                'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl rounded-tl-sm px-5 py-4 mr-auto max-w-[80%] text-base leading-relaxed'
            ),

            footer: {
                ...defaultTheme.messages.message.footer,
                base: 'flex gap-3 mt-2 px-1 text-gray-400',
                copy: 'hover:text-[#E0701B] transition-colors cursor-pointer',
                refresh:
                    'hover:text-[#E0701B] transition-colors cursor-pointer',
                upvote: 'hover:text-green-600 transition-colors cursor-pointer',
                downvote: 'hover:text-red-600 transition-colors cursor-pointer',
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
            'bg-white dark:bg-gray-800 text-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-hidden transition-all shadow-inner'
        ),
        actions: {
            ...defaultTheme.input.actions,
            base: 'flex items-center gap-2 ml-3',
            send: 'bg-[#E0701B] hover:bg-[#cc5f17] text-white w-12 h-10 rounded-lg flex items-center justify-center shadow-md transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
            stop: 'border border-red-500 text-red-500 w-12 h-10 rounded-lg flex items-center justify-center hover:bg-red-50 cursor-pointer',
        },
    },
};
