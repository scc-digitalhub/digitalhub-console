// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import type { CSSProperties } from 'react';
import DOMPurify from 'dompurify';
import { styled } from '@mui/material';

const allowedTags = [
    'a',
    'b',
    'blockquote',
    'br',
    'caption',
    'cite',
    'code',
    'col',
    'colgroup',
    'dd',
    'div',
    'dl',
    'dt',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'i',
    'img',
    'li',
    'ol',
    'p',
    'pre',
    'q',
    'small',
    'span',
    'strike',
    'strong',
    'sub',
    'sup',
    'table',
    'tbody',
    'td',
    'tfoot',
    'th',
    'thead',
    'tr',
    'u',
    'ul',
];

const allowedAttributes: Record<string, string[]> = {
    a: ['href', 'title'],
    blockquote: ['cite'],
    col: ['span', 'width'],
    colgroup: ['span', 'width'],
    img: ['align', 'alt', 'height', 'src', 'title', 'width'],
    ol: ['start', 'type'],
    q: ['cite'],
    table: ['summary', 'width'],
    td: ['abbr', 'axis', 'colspan', 'rowspan', 'width'],
    th: ['abbr', 'axis', 'colspan', 'rowspan', 'scope', 'width'],
    ul: ['type'],
};

const allowedProtocols: Record<string, Record<string, string[]>> = {
    a: { href: ['ftp:', 'http:', 'https:', 'mailto:'] },
    blockquote: { cite: ['http:', 'https:'] },
    img: { src: ['http:', 'https:'] },
    q: { cite: ['http:', 'https:'] },
};

// Keep this safelist isolated from other DOMPurify consumers.
const sanitizer = DOMPurify();
sanitizer.setConfig({
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: Array.from(new Set(Object.values(allowedAttributes).flat())),
    ALLOW_ARIA_ATTR: false,
    ALLOW_DATA_ATTR: false,
});
sanitizer.addHook('uponSanitizeAttribute', (node, data) => {
    const tag = node.nodeName.toLowerCase();
    if (!allowedAttributes[tag]?.includes(data.attrName)) {
        data.keepAttr = false;
        return;
    }

    const protocols = allowedProtocols[tag]?.[data.attrName];
    if (protocols) {
        try {
            const url = new URL(data.attrValue, window.location.href);
            data.keepAttr = protocols.includes(url.protocol);
        } catch {
            data.keepAttr = false;
        }
    }
});

interface HtmlBodyProps {
    children: string;
    style?: CSSProperties;
}

const HtmlContent = styled('div')({
    '& img': {
        maxWidth: '100%',
        height: 'auto',
    },
});

/** Renders HTML inline using the relaxed tag, attribute, and protocol safelist. */
export const HtmlBody = ({ children, style }: HtmlBodyProps) => {
    return (
        <HtmlContent
            style={{
                border: '1px solid #dedede',
                boxSizing: 'border-box',
                width: '100%',
                minWidth: 0,
                ...style,
            }}
            dangerouslySetInnerHTML={{ __html: sanitizer.sanitize(children) }}
        />
    );
};
