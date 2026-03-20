// Scopes CSS selectors to a specific class, prefixing them while handling global selectors like 'html', 'body', and ':root'.
export const scopeCss = (css: string, scopeClass: string): string => {
    const scopePrefix = `.${scopeClass}`;
    return css.replace(
        /(^|})\s*([^@}{][^{]*)\{/g,
        (_match, boundary, selectors) => {
            const scopedSelectors = selectors
                .split(',')
                .map(selector => selector.trim())
                .filter(Boolean)
                .map(selector => {
                    if (selector.startsWith(scopePrefix)) return selector;
                    if (
                        selector === 'html' ||
                        selector === 'body' ||
                        selector === ':root'
                    )
                        return scopePrefix;
                    return `${scopePrefix} ${selector}`;
                })
                .join(', ');

            return `${boundary} ${scopedSelectors}{`;
        }
    );
};
