// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import type { CellHandle, Plugin, RuntimeContext } from '@jupyter-kit/core';
import * as monaco from 'monaco-editor';

export type EditorMonacoOptions = {
    /** Per-language Monaco language ids. Keys are cell language identifiers. The key "*" is used as a fallback. */
    languages?: Record<string, string>;
    /** Render as read-only. Default false. */
    readOnly?: boolean;
    /** Show line numbers. Default false. */
    lineNumbers?: boolean;
    /** CSS font-family for editor content. */
    fontFamily?: string;
    /** CSS font-size for editor content. Defaults to 14. */
    fontSize?: number;
    /** Editor background color. */
    backgroundColor?: string;
    /** Show the run (▶) button. Default true; only visible when an executor is set. */
    runButton?: boolean;
    /** Tooltip for the run button. Default "Run (Shift+Enter)". */
    runLabel?: string;
    /** Monaco theme. Default 'vs'. */
    theme?: string;
};

// Icons drawn at 14px, currentColor so CSS can restyle.
const ICON_PLAY =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const ICON_DUPLICATE =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
const ICON_DELETE =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6"/></svg>';

const cellEditors = new WeakMap<
    HTMLElement,
    monaco.editor.IStandaloneCodeEditor
>();

export function createEditorPlugin(opts: EditorMonacoOptions = {}): Plugin {
    const languages = opts.languages ?? {};
    const showLineNumbers = opts.lineNumbers ?? false;

    return {
        name: 'editor-monaco',

        onCodeBlock(codeEl, language, ctx) {
            const pre = codeEl.parentElement;
            if (!pre || pre.tagName !== 'PRE') return;

            const source = codeEl.textContent ?? '';
            const monacoLanguage =
                languages[language] ?? languages['*'] ?? language;

            const host = document.createElement('div');
            host.className = 'monaco-editor-host';
            host.style.minHeight = '60px';
            pre.replaceWith(host);

            const editor = monaco.editor.create(host, {
                value: source,
                language: monacoLanguage,
                readOnly: opts.readOnly ?? false,
                lineNumbers: showLineNumbers ? 'on' : 'off',
                fontFamily: opts.fontFamily,
                fontSize: opts.fontSize ?? 14,
                theme: opts.theme ?? 'vs',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: 'on',
                renderLineHighlight: 'none',
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
                scrollbar: { alwaysConsumeMouseWheel: false },
            });

            // Auto-resize height to content
            const updateHeight = () => {
                const contentHeight = editor.getContentHeight();
                host.style.height = `${contentHeight}px`;
                editor.layout();
            };
            editor.onDidContentSizeChange(updateHeight);
            updateHeight();

            // Sync source back to cell handle on change
            editor.onDidChangeModelContent(() => {
                const handle = findHandle(host, ctx);
                if (!handle) return;
                handle.setSource(editor.getValue());
            });

            // Shift+Enter: run and advance
            editor.addCommand(
                monaco.KeyMod.Shift | monaco.KeyCode.Enter,
                () => {
                    if (!ctx.executor) return;
                    const handle = findHandle(host, ctx);
                    if (!handle) return;
                    void runAndAdvance(handle, ctx);
                }
            );

            cellEditors.set(host, editor);
        },

        cellToolbar(handle, ctx) {
            const buttons: HTMLElement[] = [];

            if (opts.runButton !== false && ctx.executor) {
                buttons.push(
                    makeIconButton(
                        'run',
                        opts.runLabel ?? 'Run (Shift+Enter)',
                        ICON_PLAY,
                        btn => {
                            btn.disabled = true;
                            runAndAdvance(handle, ctx).finally(() => {
                                btn.disabled = false;
                            });
                        }
                    )
                );
            }

            buttons.push(
                makeIconButton('add', 'Add cell below', ICON_DUPLICATE, () => {
                    // Insert an empty cell of the same type directly below. Copying
                    // the current cell's source would let a stray click throw away
                    // a partially-typed draft, so prefer a blank.
                    //
                    // Use the CURRENT notebook state (via `ctx.notebook()`) rather
                    // than the captured `handle.index` — every `build()` replaces
                    // every handle, so a long-lived closure over `handle` points at
                    // a stale index once the user inserts / deletes any sibling.
                    const cells = ctx.notebook().cells ?? [];
                    const liveIndex = cells.findIndex(c => c === handle.cell);
                    const insertAt =
                        liveIndex >= 0 ? liveIndex + 1 : cells.length;
                    ctx.insertCell(insertAt, {
                        cell_type: handle.cell.cell_type ?? 'code',
                        source: '',
                        outputs: [],
                        execution_count: null,
                    });
                }),
                makeIconButton('delete', 'Delete cell', ICON_DELETE, () => {
                    ctx.deleteCell(handle.index);
                })
            );

            return buttons;
        },

        teardown() {
            // Monaco editors are disposed with their DOM nodes via automaticLayout.
        },
    };
}

function makeIconButton(
    name: string,
    label: string,
    iconSvg: string,
    onClick: (btn: HTMLButtonElement) => void
): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `cell_toolbar_btn cell_toolbar_${name}`;
    btn.title = label;
    btn.setAttribute('aria-label', label);
    btn.innerHTML = iconSvg;
    btn.addEventListener('click', e => {
        e.stopPropagation();
        onClick(btn);
    });
    return btn;
}

function findHandle(node: Node, ctx: RuntimeContext): CellHandle | undefined {
    let el: Node | null = node;
    while (el && el !== ctx.root) {
        if (el instanceof HTMLElement && el.classList.contains('cell')) {
            return ctx.cells().find(h => h.el === el);
        }
        el = el.parentNode;
    }
    return undefined;
}

/**
 * Run a cell, then move focus to the next code cell that has an editor. If
 * rerun fails, focus advances anyway (matches Jupyter — error is already
 * visible in the cell's output).
 */
async function runAndAdvance(
    handle: CellHandle,
    ctx: RuntimeContext
): Promise<void> {
    try {
        await handle.rerun();
    } finally {
        focusNextEditor(handle, ctx);
    }
}

function focusNextEditor(handle: CellHandle, ctx: RuntimeContext): void {
    const all = ctx.cells();
    for (let i = handle.index + 1; i < all.length; i++) {
        const next = all[i];
        const host = next.el.querySelector(
            '.monaco-editor-host'
        ) as HTMLElement | null;
        if (!host) continue;
        const editor = cellEditors.get(host);
        if (editor) {
            next.el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            editor.focus();
            return;
        }
    }
}
