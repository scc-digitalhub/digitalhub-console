/**
 * Scopes CSS selectors under a wrapper class.
 * Handles @keyframes (left untouched), @media/@supports (selectors inside scoped),
 * and global selectors (html, body, :root → replaced with scope class).
 */
export const scopeCss = (css: string, scopeClass: string): string => {
    const pre = `.${scopeClass}`;
    const globals = new Set(['html', 'body', ':root']);

    const scope = (sel: string) => {
        sel = sel.trim();
        if (!sel || sel.startsWith(pre)) return sel;
        if (globals.has(sel)) return pre;
        return `${pre} ${sel}`;
    };

    const scopeAll = (raw: string) =>
        raw.split(',').map(scope).filter(Boolean).join(', ');

    const scopeBlock = (block: string): string => {
        let r = '',
            i = 0;
        const n = block.length;
        while (i < n) {
            while (i < n && /\s/.test(block[i])) r += block[i++];
            if (i >= n) break;
            if (block[i] === '}') {
                r += block[i++];
                continue;
            }
            const s = i;
            while (i < n && block[i] !== '{' && block[i] !== '}') i++;
            if (i >= n || block[i] === '}') {
                r += block.substring(s, i);
                continue;
            }
            const sel = block.substring(s, i);
            i++;
            let d = 1,
                b = '';
            while (i < n && d > 0) {
                if (block[i] === '{') d++;
                else if (block[i] === '}') d--;
                if (d > 0) b += block[i];
                i++;
            }
            r += scopeAll(sel) + '{' + b + '}';
        }
        return r;
    };

    let result = '',
        i = 0;
    const len = css.length;

    while (i < len) {
        while (i < len && /\s/.test(css[i])) result += css[i++];
        if (i >= len) break;

        if (css[i] === '@') {
            const a = i;
            while (i < len && css[i] !== '{' && css[i] !== ';') i++;
            const hdr = css.substring(a, i);
            if (i < len && css[i] === ';') {
                result += hdr + ';';
                i++;
                continue;
            }
            if (i >= len) {
                result += hdr;
                break;
            }
            i++;
            let d = 1,
                inner = '';
            while (i < len && d > 0) {
                if (css[i] === '{') d++;
                else if (css[i] === '}') d--;
                if (d > 0) inner += css[i];
                i++;
            }
            if (/^@keyframes\b/i.test(hdr)) {
                result += hdr + '{' + inner + '}';
            } else {
                result += hdr + '{' + scopeBlock(inner) + '}';
            }
            continue;
        }

        if (css[i] === '}') {
            result += css[i++];
            continue;
        }

        const s = i;
        while (i < len && css[i] !== '{' && css[i] !== '}') i++;
        if (i >= len || css[i] === '}') {
            result += css.substring(s, i);
            continue;
        }
        const sel = css.substring(s, i);
        i++;
        let d = 1,
            body = '';
        while (i < len && d > 0) {
            if (css[i] === '{') d++;
            else if (css[i] === '}') d--;
            if (d > 0) body += css[i];
            i++;
        }
        result += scopeAll(sel) + '{' + body + '}';
    }

    return result;
};
