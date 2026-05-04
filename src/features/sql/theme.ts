const S = (c: string) => `.${c}`;

/*
 * Platform palette (from themeProvider.ts):
 *   primary:    #E0701B (orange)  dark:#9c3b15  light:#ec934f
 *   secondary:  light=#062D4B (navy)   dark=#6EA3CB (blue)
 *   bg.default: light=#f5f5f6          dark=#363D40
 *   bg.paper:   light=#FFF             dark=#2B3033
 *   borderRadius: 5px
 *
 * Architecture: TRINO_DARK_VARS / TRINO_LIGHT_VARS set only CSS custom
 * properties. TRINO_COMPONENTS (shared) renders all component rules via
 * var(), eliminating the ~500-line duplication that existed previously.
 */

/* ═══════════════════════════════════════════════════════════════════
   DARK MODE — CSS custom properties only
   ═══════════════════════════════════════════════════════════════════ */
export const TRINO_DARK_VARS = (sc: string) => `
${S(sc)} {
  /* ── Trino built-in tokens (consumed by the bundled trino CSS) ── */
  --bg-color: #2B3033;
  --text-color: #dcdcdc;
  --separator-border: #4a5054;
  --text-link-decoration: none;
  --subtle-darker-accent-color: #2B3033;
  --subtle-lighter-accent-color: #2B3033;
  --lighter-accent-color: #363D40;
  --dark-gray: #3a4145;
  --medium-gray: #6a7175;
  --light-gray: #8a8f93;
  --very-dark-gray: #242a2d;
  --dark-accent: #363D40;
  --highlight-blue: #E0701B;
  --brand-gradient: linear-gradient(135deg,#E0701B 0%,#9c3b15 100%);
  --border-color: #4a5054;
  --muted-text-color: #8a8f93;
  --white: #dcdcdc;
  --link-color: #6EA3CB;
  --link-hover-color: #ec934f;
  --success-color: rgba(46,160,67,.35);
  --error-color-subtle: #8a8f93;
  --bytes-color: #1C364D;
  --rows-color: #0C61A6;
  --splits-color: #564682;
  --vscode-editor-background: #2B3033;
  --vscode-editorWidget-background: #2B3033;
  --vscode-scrollbar-shadow: transparent;
  --vscode-scrollbarSlider-background: rgba(255,255,255,.12);
  --vscode-scrollbarSlider-hoverBackground: rgba(255,255,255,.2);
  --vscode-scrollbarSlider-activeBackground: rgba(255,255,255,.3);
  --vscode-multiDiffEditor-border: transparent;
  /* ── Component design tokens (consumed by TRINO_COMPONENTS) ── */
  --surface: #363D40;
  --surface-hover: #4a5054;
  --surface-glass: rgba(54,61,64,.85);
  --tab-bg: #363D40;
  --input-bg: #363D40;
  --collapse-bg: #363D40;
  --title-color: #dcdcdc;
  --schema-color: #6EA3CB;
  --schema-hover-bg: rgba(110,163,203,.08);
  --splits-text: #a78bdb;
  --shadow: rgba(0,0,0,.4);
  --error-bg: rgba(180,40,40,.15);
  --error-border: #cc444488;
  --error-text: #ff6b6b;
  --danger-color: #ff6b6b;
  --close-color: #6a7175;
  --tab-hover-bg: rgba(255,255,255,.04);
  --editor-margin-bg: #2B3033;
  --current-line-bg: rgba(255,255,255,.05);
  --subtle-border: rgba(255,255,255,.06);
  --row-hover-bg: rgba(224,112,27,.06);
  --item-hover-bg: rgba(224,112,27,.12);
  --scrollbar-thumb: rgba(255,255,255,.15);
  --scrollbar-thumb-hover: rgba(255,255,255,.25);
  --selection-bg: rgba(224,112,27,.25);
  color: var(--text-color);
  background: var(--bg-color);
  font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
}
`;

/* ═══════════════════════════════════════════════════════════════════
   LIGHT MODE — CSS custom properties only
   ═══════════════════════════════════════════════════════════════════ */
export const TRINO_LIGHT_VARS = (sc: string) => `
${S(sc)} {
  /* ── Trino built-in tokens ── */
  --bg-color: #ffffff;
  --text-color: #333;
  --separator-border: #e0e0e0;
  --text-link-decoration: none;
  --subtle-darker-accent-color: #f5f5f6;
  --subtle-lighter-accent-color: #fafafa;
  --lighter-accent-color: #f5f5f6;
  --dark-gray: #e0e0e0;
  --medium-gray: #bbb;
  --light-gray: #999;
  --very-dark-gray: #f0f0f0;
  --dark-accent: #f5f5f6;
  --highlight-blue: #E0701B;
  --brand-gradient: linear-gradient(135deg,#E0701B 0%,#ec934f 100%);
  --border-color: #e0e0e0;
  --muted-text-color: #666;
  --white: #333;
  --link-color: #E0701B;
  --link-hover-color: #9c3b15;
  --success-color: rgba(46,160,67,.15);
  --error-color-subtle: #999;
  --bytes-color: #e8d4c4;
  --rows-color: #d4c4e8;
  --splits-color: #c4d4e8;
  --vscode-editor-background: #ffffff;
  --vscode-editorWidget-background: #ffffff;
  --vscode-scrollbar-shadow: transparent;
  --vscode-scrollbarSlider-background: rgba(0,0,0,.08);
  --vscode-scrollbarSlider-hoverBackground: rgba(0,0,0,.14);
  --vscode-scrollbarSlider-activeBackground: rgba(0,0,0,.2);
  --vscode-multiDiffEditor-border: transparent;
  /* ── Component design tokens ── */
  --surface: #f5f5f6;
  --surface-hover: #f0f0f0;
  --surface-glass: rgba(255,255,255,.9);
  --tab-bg: #ffffff;
  --input-bg: #ffffff;
  --collapse-bg: #ffffff;
  --title-color: #062D4B;
  --schema-color: #062D4B;
  --schema-hover-bg: rgba(6,45,75,.04);
  --splits-text: #7c5db8;
  --shadow: rgba(0,0,0,.1);
  --error-bg: #fef2f2;
  --error-border: #fca5a5;
  --error-text: #dc2626;
  --danger-color: #ff4444;
  --close-color: #ccc;
  --tab-hover-bg: rgba(0,0,0,.02);
  --editor-margin-bg: #fafafa;
  --current-line-bg: rgba(0,0,0,.04);
  --subtle-border: #f0f0f0;
  --row-hover-bg: rgba(224,112,27,.04);
  --item-hover-bg: rgba(224,112,27,.08);
  --scrollbar-thumb: rgba(0,0,0,.1);
  --scrollbar-thumb-hover: rgba(0,0,0,.18);
  --selection-bg: rgba(224,112,27,.15);
  color: var(--text-color);
  background: var(--bg-color);
  font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
}
`;

/* ═══════════════════════════════════════════════════════════════════
   COMPONENTS — shared rules for both themes, driven by var()
   ═══════════════════════════════════════════════════════════════════ */
export const TRINO_COMPONENTS = (sc: string) => `

/* ── Global background reset ── */
${S(sc)} .page, ${S(sc)} .tab-content, ${S(sc)} .tab-list, ${S(sc)} .cards, ${S(sc)} .card {
  background-color: var(--bg-color); color: var(--text-color);
}

/* ── Card header ── */
${S(sc)} .card-header {
  background: var(--surface); border-bottom: 1px solid var(--border-color); padding: 6px 12px;
}
${S(sc)} .card-header-grid { gap: 8px }
${S(sc)} .query-title { color: var(--title-color); font-weight: 600; font-size: 14px; background-color: transparent }

/* ── Run button ── */
${S(sc)} .query-run-button {
  background: #E0701B!important; color: #fff!important;
  border: none!important; border-radius: 5px!important;
  padding: 6px 14px; font-weight: 600; font-size: 13px;
  cursor: pointer; transition: background .15s, box-shadow .15s;
  box-shadow: 0 1px 3px var(--shadow);
}
${S(sc)} .query-run-button:hover { background: var(--link-hover-color)!important; box-shadow: 0 2px 8px rgba(224,112,27,.3) }
${S(sc)} .query-run-button svg { color: #fff!important; fill: #fff!important }

/* ── Toolbar / action buttons ── */
${S(sc)} .small-rounded-button {
  background: transparent!important; color: var(--muted-text-color)!important;
  border: 1px solid var(--border-color)!important; border-radius: 5px!important;
  padding: 4px 8px; cursor: pointer; transition: all .15s;
}
${S(sc)} .small-rounded-button:hover { background: var(--surface-hover)!important; color: var(--text-color)!important; border-color: var(--medium-gray)!important }
${S(sc)} .small-rounded-button svg { color: var(--muted-text-color); transition: color .15s }
${S(sc)} .small-rounded-button:hover svg { color: var(--text-color) }
${S(sc)} .small-rounded-dark-grey-button {
  background: var(--surface)!important; color: var(--muted-text-color)!important;
  border: 1px solid var(--border-color)!important; border-radius: 5px!important; cursor: pointer; transition: all .15s;
}
${S(sc)} .small-rounded-dark-grey-button:hover { background: var(--surface-hover)!important; color: var(--text-color)!important }
${S(sc)} .editor-button { color: var(--muted-text-color)!important; background: transparent!important; border: none; transition: color .15s }
${S(sc)} .editor-button:hover { color: #E0701B!important }
${S(sc)} .editor-button[disabled] { opacity: .4 }
${S(sc)} .toolbar-button { color: var(--muted-text-color); background: transparent; transition: color .15s }
${S(sc)} .toolbar-button:hover { color: var(--text-color) }
${S(sc)} .result-action-button {
  background: var(--surface-glass)!important; color: var(--text-color)!important;
  border-radius: 5px; transition: all .15s; padding: 6px 12px;
  border: 1px solid var(--border-color); backdrop-filter: blur(4px);
}
${S(sc)} .result-action-button:hover { background: var(--surface-hover)!important; color: var(--text-color)!important }
${S(sc)} .query-control-button {
  background: transparent!important; color: var(--muted-text-color)!important;
  border: 1px solid var(--border-color)!important; border-radius: 5px!important; cursor: pointer; transition: all .15s;
}
${S(sc)} .query-control-button:hover { color: #E0701B!important; border-color: #E0701B!important }
${S(sc)} .generate-query-button {
  background: transparent; color: var(--schema-color);
  border: 1px solid var(--border-color); border-radius: 5px; transition: all .15s;
}
${S(sc)} .generate-query-button:hover { border-color: var(--schema-color); background: var(--schema-hover-bg) }
${S(sc)} .action-bar { background: transparent }
${S(sc)} .action-icon { color: var(--muted-text-color) }
${S(sc)} .action-icon:hover { color: #E0701B }
${S(sc)} .editor-toolbar { background: transparent!important; border: none!important }

/* ── Tabs ── */
${S(sc)} .tab-container { background: var(--tab-bg)!important; border-bottom: 1px solid var(--border-color); border-top: none }
${S(sc)} .tabs-container { background: var(--tab-bg)!important }
${S(sc)} .tab-item, ${S(sc)} .tab-item-selected {
  background: transparent!important; border: none!important;
  padding: 8px 14px; font-size: 13px;
  cursor: pointer; transition: all .15s; border-radius: 0; border-bottom: 2px solid transparent!important;
}
${S(sc)} .tab-item { color: var(--muted-text-color) }
${S(sc)} .tab-item:hover { color: var(--text-color); background: var(--tab-hover-bg)!important }
${S(sc)} .tab-item-selected { color: var(--text-color); font-weight: 500; border-bottom-color: #E0701B!important }
${S(sc)} .tab-item-selected:hover { background: var(--tab-hover-bg)!important }
${S(sc)} .close-button { color: var(--close-color); transition: color .15s }
${S(sc)} .close-button:hover { color: var(--danger-color) }
${S(sc)} .add-query-button { color: var(--close-color); transition: color .15s; background: transparent!important }
${S(sc)} .add-query-button:hover { color: #E0701B }
${S(sc)} .add-query-button hr { display: none!important }
${S(sc)} .tab-list-button-and-menu { border-color: var(--border-color); background: transparent!important }
${S(sc)} .tab-buttons { border-color: var(--border-color); background: transparent!important }
${S(sc)} .tab-button { color: var(--muted-text-color); transition: color .15s }
${S(sc)} .tab-button:hover { color: var(--text-color) }
${S(sc)} .tab-list { border-color: transparent; border-top: none; background: var(--bg-color) }

/* ── Tabs overflow / ellipsis menu ── */
${S(sc)} .ellipses-button {
  background: transparent!important; color: var(--muted-text-color)!important;
  border: 1px solid var(--border-color)!important; border-radius: 5px!important;
  width: auto; height: auto; padding: 4px 8px;
}
${S(sc)} .ellipses-button:hover { background: var(--surface-hover)!important; color: var(--text-color)!important }
${S(sc)} .controltab {
  background: transparent!important; color: var(--muted-text-color)!important;
  border: 1px solid var(--border-color)!important; border-radius: 5px!important;
  padding: 6px 12px; font-size: small; transition: all .15s;
}
${S(sc)} .controltab:hover { background: var(--surface-hover)!important; color: var(--text-color)!important }
${S(sc)} .tabs-ellipses-menu { background: transparent!important; color: var(--muted-text-color) }
${S(sc)} .tabs-ellipses-menu:hover { background: var(--surface-hover)!important; color: var(--text-color) }
${S(sc)} .tabs-ellipses-menu-content {
  background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 5px;
  box-shadow: 0 8px 24px var(--shadow);
}
${S(sc)} .tabs-ellipses-menu-content input {
  background: var(--surface); border: 1px solid var(--border-color); color: var(--text-color); border-radius: 5px;
}
${S(sc)} .tabs-ellipses-menu-content .tab-item { border-radius: 4px }
${S(sc)} .tabs-ellipses-menu-content .tab-item:hover { background: var(--surface) }

/* ── Monaco editor ── */
${S(sc)} .editor, ${S(sc)} .editorContainer, ${S(sc)} .editorParent,
${S(sc)} .overflow-guard, ${S(sc)} .lines-content, ${S(sc)} .monaco-editor,
${S(sc)} .monaco-editor-background, ${S(sc)} .inputarea,
${S(sc)} .split-view-container, ${S(sc)} .split-view-view, ${S(sc)} .view-overlays {
  background-color: var(--bg-color)!important;
}
${S(sc)} .monaco-editor .margin, ${S(sc)} .monaco-editor .margin-view-overlays, ${S(sc)} .monaco-editor .glyph-margin {
  background-color: var(--editor-margin-bg)!important;
}
${S(sc)} .monaco-editor .line-numbers { color: var(--medium-gray)!important }
${S(sc)} .monaco-editor .current-line-margin { border-color: var(--subtle-border) }
${S(sc)} .minimap { background: var(--bg-color)!important }
${S(sc)} .monaco-scrollable-element { background: var(--bg-color)!important }
${S(sc)} .monaco-editor .cursors-layer .cursor { background-color: #E0701B!important }
${S(sc)} .monaco-editor .current-line { background-color: var(--current-line-bg)!important; border: none!important }
${S(sc)} .monaco-editor .wordHighlight,
${S(sc)} .monaco-editor .wordHighlightStrong,
${S(sc)} .monaco-editor .selectionHighlight { background-color: rgba(224,112,27,.15)!important; border: none!important }
${S(sc)} .monaco-editor .bracket-match { background-color: var(--current-line-bg)!important; border: 1px solid var(--border-color)!important }

/* ── Results ── */
${S(sc)} .result-set, ${S(sc)} .result-table-container { background: var(--bg-color) }
${S(sc)} .result-table { border-collapse: collapse; width: 100%; font-size: 13px }
${S(sc)} .result-table th {
  background: var(--surface); color: var(--text-color); font-weight: 500;
  padding: 8px 12px; text-align: left;
  border-bottom: 2px solid var(--border-color);
  position: sticky; top: 0; z-index: 1;
}
${S(sc)} .result-table td { padding: 6px 12px; border-bottom: 1px solid var(--subtle-border); color: var(--text-color) }
${S(sc)} .result-table tr:hover td { background: var(--row-hover-bg) }
${S(sc)} .result-cell-null { color: var(--medium-gray); font-style: italic }
${S(sc)} .clear-result-table { color: var(--muted-text-color); transition: color .15s }
${S(sc)} .clear-result-table:hover { color: var(--danger-color) }

/* ── Status bar ── */
${S(sc)} .status-bar {
  background: var(--surface); color: var(--muted-text-color); font-size: 12px;
  padding: 4px 12px; border-top: 1px solid var(--border-color);
}
${S(sc)} .status-text, ${S(sc)} .status-stage-default { color: var(--muted-text-color) }
${S(sc)} .status-stage-bytes { color: var(--schema-color) }
${S(sc)} .status-stage-rows { color: #E0701B }
${S(sc)} .status-stage-splits { color: var(--splits-text) }

/* ── Progress bar ── */
${S(sc)} .progress-bar { background: var(--surface); border: 1px solid var(--border-color); border-radius: 5px; overflow: hidden }
${S(sc)} .progress-bar-fill { background: linear-gradient(90deg,#E0701B,#ec934f); transition: width .3s ease }
${S(sc)} .progress-bar-grid { background: var(--surface) }
${S(sc)} .progress-percent { color: var(--text-color); font-size: 12px }
${S(sc)} .progress-bar-running-state { color: #E0701B }
${S(sc)} .progress-bar-timer { color: var(--muted-text-color) }

/* ── Error box ── */
${S(sc)} .error-box {
  background: var(--error-bg)!important; border: 1px solid var(--error-border);
  border-radius: 5px; margin: 8px; padding: 12px;
}
${S(sc)} .error-box-header { color: var(--error-text); font-weight: 600; margin-bottom: 4px }
${S(sc)} .error-box-body, ${S(sc)} .error-box-message { color: var(--text-color) }
${S(sc)} .error-box-message { font-size: 13px }
${S(sc)} .error-box-context { color: var(--muted-text-color); font-size: 12px }
${S(sc)} .error-box-close { color: var(--muted-text-color); cursor: pointer; transition: color .15s }
${S(sc)} .error-box-close:hover { color: var(--error-text) }

/* ── Context menu ── */
${S(sc)} .context-menu {
  background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 5px;
  box-shadow: 0 8px 24px var(--shadow); overflow: hidden;
}
${S(sc)} .menu-item { padding: 8px 16px; color: var(--text-color); cursor: pointer; transition: background .1s }
${S(sc)} .menu-item:hover { background: var(--item-hover-bg) }
${S(sc)} .menu-divider { border-color: var(--subtle-border); margin: 4px 0 }

/* ── Filter / search inputs ── */
${S(sc)} .filter-input {
  background: var(--input-bg); border: 1px solid var(--border-color); color: var(--text-color);
  border-radius: 5px; padding: 6px 10px; font-size: 13px; transition: border-color .15s;
}
${S(sc)} .filter-input:focus { border-color: #E0701B; outline: none }
${S(sc)} .filter-input::placeholder { color: var(--medium-gray) }
${S(sc)} .search-container input { background: var(--input-bg); border: 1px solid var(--border-color); color: var(--text-color); border-radius: 5px }
${S(sc)} .clear-search { color: var(--muted-text-color) }
${S(sc)} .clear-search:hover { color: var(--text-color) }

/* ── Catalog panel ── */
${S(sc)} .catalog-content, ${S(sc)} .catalog-viewer, ${S(sc)} .catalog-wrapper, ${S(sc)} .catalog-container {
  background: var(--bg-color);
}
${S(sc)} .catalog-viewer-header {
  background: var(--surface); color: var(--title-color); font-weight: 500;
  padding: 8px 12px; border-bottom: 1px solid var(--border-color);
}
${S(sc)} .catalog-name { color: #E0701B; font-weight: 500 }
${S(sc)} .catalog-setting, ${S(sc)} .schema-setting { color: var(--muted-text-color); background: transparent }
${S(sc)} .schema-name { color: var(--schema-color) }
${S(sc)} .table-name { color: var(--text-color) }
${S(sc)} .column-name { color: var(--muted-text-color); font-family: "Roboto Mono", monospace; font-size: 12px }
${S(sc)} .columnType { color: var(--medium-gray); font-size: 11px }
${S(sc)} .qualifiedName { color: var(--muted-text-color) }

/* ── Catalog tree ── */
${S(sc)} .viewer_catalog { color: var(--text-color); font-weight: 600 }
${S(sc)} .viewer_catalog:hover { background: var(--item-hover-bg); color: #E0701B }
${S(sc)} .viewer_catalog_body { margin-left: 10px; border-left: 1px solid var(--border-color) }
${S(sc)} .viewer_schema { color: var(--muted-text-color); border-left: 1px solid var(--border-color) }
${S(sc)} .viewer_schema:hover { background: var(--schema-hover-bg); color: var(--schema-color) }
${S(sc)} .viewer_table { color: var(--muted-text-color); border-left: 1px solid var(--border-color); transition: all .1s; cursor: pointer }
${S(sc)} .viewer_table:hover { color: #E0701B; background: var(--row-hover-bg) }
${S(sc)} .viewer_table_body, ${S(sc)} .viewer_column { border-left: 1px solid var(--border-color) }
${S(sc)} .viewer-schema-body { background: transparent }

/* ── Collapse button ── */
${S(sc)} .collapse-button {
  background: var(--collapse-bg)!important; color: #E0701B!important;
  border: 1px solid var(--border-color); border-radius: 5px;
  font-weight: 500; padding: 6px 16px; cursor: pointer; transition: all .15s; font-size: 13px;
}
${S(sc)} .collapse-button:hover { background: var(--surface-hover)!important; border-color: #E0701B }

/* ── Loading ── */
${S(sc)} .loading-message { color: var(--muted-text-color) }
${S(sc)} .spinner { border-color: var(--border-color); border-top-color: #E0701B }

/* ── Query status ── */
${S(sc)} .query-status-table { font-size: 13px; color: var(--text-color); background: transparent }
${S(sc)} .query-status-table td { padding: 4px 8px; border-bottom: 1px solid var(--subtle-border) }

/* ── Links ── */
${S(sc)} a { color: var(--link-color); text-decoration: none; transition: color .15s }
${S(sc)} a:hover { color: var(--link-hover-color) }
${S(sc)} .link-to-query { color: var(--link-color) }
${S(sc)} .copy-link { color: var(--muted-text-color); transition: color .15s }
${S(sc)} .copy-link:hover { color: #E0701B }
${S(sc)} .breadcrumb-item { color: var(--muted-text-color) }
${S(sc)} .breadcrumb-item:hover { color: #E0701B }

/* ── Separator ── */
${S(sc)} .separator-border { background: var(--border-color) }

/* ── Scrollbars ── */
${S(sc)} ::-webkit-scrollbar { width: 8px; height: 8px }
${S(sc)} ::-webkit-scrollbar-track { background: transparent }
${S(sc)} ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 4px }
${S(sc)} ::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-thumb-hover) }

/* ── Selection ── */
${S(sc)} *::selection { background: var(--selection-bg) }
`;

/* ═══════════════════════════════════════════════════════════════════
   LAYOUT (shared by both themes)
   ═══════════════════════════════════════════════════════════════════ */
export const TRINO_LAYOUT = (sc: string) => `

/* ── Hide standalone branding bar ── */
${S(sc)} .branding-header,
${S(sc)} .branding-padder { display:none!important }

/* ── Root layout: fill container ── */
${S(sc)} .query-editor {
  display:flex; flex-direction:column;
  height:100%; width:100%; overflow:hidden;
}

/* ── Grid: catalog left, editor right ── */
${S(sc)} .pagegrid {
  display:grid!important;
  width:100%!important; height:100%!important;
  max-width:100%!important;
  box-sizing:border-box!important;
  overflow:hidden!important;
  transition:grid-template-columns .2s ease!important;
  grid-template-columns:0% 100%!important;
}
${S(sc)} .pagegrid.catalog-expanded {
  grid-template-columns:20% 80%!important;
}

/* ── Cards layout ── */
${S(sc)} .cards {
  display:flex; flex-direction:column;
  flex:1; min-height:0; overflow:hidden;
}
${S(sc)} .card {
  display:flex; flex-direction:column;
  flex:1; min-height:0; overflow:hidden;
  border-radius:5px;
}
${S(sc)} .card-header     { flex-shrink:0; overflow:visible; height:auto!important; z-index:3 }
${S(sc)} .tab-container   { flex-shrink:0; overflow:visible!important }

/* ── Editor area ── */
${S(sc)} .monaco-split-view2 { flex:1; min-height:0; border-bottom:none!important }
${S(sc)} .editor              { flex:1; min-height:0 }
${S(sc)} .editorParent { border-bottom:none!important }

/* ── Monaco split panes (maximize/restore) ── */
${S(sc)} .split-view-container { background:inherit!important }
${S(sc)} .split-view-view { background:inherit!important }
${S(sc)} .monaco-scrollable-element { background:inherit!important }

/* ── Minimap: hide to save space ── */
${S(sc)} .minimap { opacity:0!important; pointer-events:none!important }

/* ── Monaco scrollbar gutter ── */
${S(sc)} .decorationsOverviewRuler { display:none!important }

/* ── Result area ── */
${S(sc)} .result-set {
  display:flex; flex-direction:column;
  overflow:hidden; min-height:0;
}
${S(sc)} .result-table-container {
  overflow:auto; flex:1; min-height:0;
}
${S(sc)} .status-bar { flex-shrink:0 }

/* ── Catalog panel ── */
${S(sc)} .catalog-container {
  height:100%!important; overflow:hidden;
  border-right:1px solid var(--border-color);
}
${S(sc)} .catalog-wrapper {
  height:100%!important;
  overflow-y:auto; overflow-x:hidden;
}
${S(sc)} .catalog-viewer {
  overflow-y:auto; height:100%;
}

/* ── Collapse button ── */
${S(sc)} .collapse-button {
  position:absolute!important;
  bottom:0!important; left:0!important;
  z-index:1000;
}

/* ── Tabs overflow menu ── */
${S(sc)} .tabs-ellipses-menu-content {
  position:fixed!important; z-index:9999!important;
  right:20px!important; top:auto!important;
  max-height:60vh; overflow-y:auto;
}
${S(sc)} .tab-list-button-and-menu {
  position:absolute; right:0; top:0; z-index:1000;
}

/* ── Tab container: allow visible overflow for menu ── */
${S(sc)} .tabs-container {
  overflow-x:auto; overflow-y:visible!important;
  position:relative;
}
${S(sc)} .tab-container {
  overflow:visible!important; position:relative; z-index:2;
}

/* ── Card header: prevent horizontal overflow ── */
${S(sc)} .card-header-grid {
  max-width:100%; overflow:hidden;
  align-items:center;
}

/* ── Add-query (+) button ── */
${S(sc)} .add-query-button {
  background:transparent!important; border:none;
  font-size:18px; line-height:1;
}

/* ── Monaco: prevent dark gaps on scroll ── */
${S(sc)} .monaco-editor .view-lines { background:transparent }
${S(sc)} .monaco-editor .view-line { background:transparent }
${S(sc)} .monaco-editor .decorations-layer { background:transparent }

/* ── Monaco scroll-decoration: remove the black line shown when scrolling ── */
${S(sc)} .scroll-decoration,
${S(sc)} .monaco-editor .scroll-decoration,
${S(sc)} .monaco-editor .overflow-guard > .scroll-decoration,
${S(sc)} .monaco-scrollable-element > .scroll-decoration {
  box-shadow: none!important;
  background: transparent!important;
  border: none!important;
  pointer-events: none!important;
}

/* ── Monaco sash (resize handle between panes): transparent, not black ── */
${S(sc)} .monaco-sash {
  background: transparent!important;
  border-color: transparent!important;
}
${S(sc)} .monaco-sash:hover,
${S(sc)} .monaco-sash.active {
  background: var(--border-color)!important;
  transition: background .1s;
}

/* ── Tooltips ── */
${S(sc)} .editor-button[data-tooltip]:hover:after {
  background:rgba(0,0,0,.8)!important; color:#fff!important;
  border-radius:4px; font-size:11px; padding:4px 8px;
}
`;
