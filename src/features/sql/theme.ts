const S = (c: string) => `.${c}`;

/*
 * Platform palette (from themeProvider.ts):
 *   primary:    #E0701B (orange)  dark:#9c3b15  light:#ec934f
 *   secondary:  light=#062D4B (navy)   dark=#6EA3CB (blue)
 *   bg.default: light=#f5f5f6          dark=#363D40
 *   bg.paper:   light=#FFF             dark=#2B3033
 *   borderRadius: 5px
 *
 * These overrides are concatenated AFTER the scoped trino CSS so they
 * win at equal specificity.  !important is used only where the bundled
 * CSS also uses it or where extra safety is needed.
 */

/* ═══════════════════════════════════════════════════════════════════
   DARK MODE
   ═══════════════════════════════════════════════════════════════════ */
export const TRINO_DARK_VARS = (sc: string) => `

/* ── CSS custom properties ── */
${S(sc)} {
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
  color: var(--text-color);
  background: var(--bg-color);
  font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* ── Global: override ALL hardcoded dark backgrounds from trino CSS ── */
${S(sc)} .page,
${S(sc)} .tab-content,
${S(sc)} .tab-list,
${S(sc)} .cards,
${S(sc)} .card {
  background-color: #2B3033;
  color: #dcdcdc;
}

/* ── Card header ── */
${S(sc)} .card-header {
  background: #363D40; border-bottom: 1px solid #4a5054;
  padding: 6px 12px;
}
${S(sc)} .card-header-grid { gap: 8px }
${S(sc)} .query-title {
  color: #dcdcdc; font-weight: 600; font-size: 14px;
  background-color: transparent;
}

/* ── Run button (primary action) ── */
${S(sc)} .query-run-button {
  background: #E0701B!important; color: #fff!important;
  border: none!important; border-radius: 5px!important;
  padding: 6px 14px; font-weight: 600; font-size: 13px;
  cursor: pointer; transition: background .15s, box-shadow .15s;
  box-shadow: 0 1px 3px rgba(0,0,0,.2);
}
${S(sc)} .query-run-button:hover {
  background: #ec934f!important;
  box-shadow: 0 2px 8px rgba(224,112,27,.35);
}
${S(sc)} .query-run-button svg { color: #fff!important; fill: #fff!important }

/* ── Toolbar / action buttons ── */
${S(sc)} .small-rounded-button {
  background: transparent!important; color: #8a8f93!important;
  border: 1px solid #4a5054!important; border-radius: 5px!important;
  padding: 4px 8px; cursor: pointer; transition: all .15s;
}
${S(sc)} .small-rounded-button:hover {
  background: #4a5054!important; color: #dcdcdc!important; border-color: #6a7175!important;
}
${S(sc)} .small-rounded-button svg { color: #8a8f93; transition: color .15s }
${S(sc)} .small-rounded-button:hover svg { color: #dcdcdc }
${S(sc)} .small-rounded-dark-grey-button {
  background: #363D40!important; color: #8a8f93!important;
  border: 1px solid #4a5054!important; border-radius: 5px!important;
  cursor: pointer; transition: all .15s;
}
${S(
    sc
)} .small-rounded-dark-grey-button:hover { background: #4a5054!important; color: #dcdcdc!important }
${S(sc)} .editor-button {
  color: #8a8f93!important; background: transparent!important;
  border: none; transition: color .15s;
}
${S(sc)} .editor-button:hover { color: #E0701B!important }
${S(sc)} .editor-button[disabled] { opacity: .4 }
${S(sc)} .toolbar-button {
  color: #8a8f93; background: transparent; transition: color .15s;
}
${S(sc)} .toolbar-button:hover { color: #dcdcdc }
${S(sc)} .result-action-button {
  background: rgba(54,61,64,.85)!important; color: #dcdcdc!important; border-radius: 5px;
  transition: all .15s; padding: 6px 12px;
  border: 1px solid #4a5054; backdrop-filter: blur(4px);
}
${S(
    sc
)} .result-action-button:hover { background: #4a5054!important; color: #fff!important }
${S(sc)} .query-control-button {
  background: transparent!important; color: #8a8f93!important;
  border: 1px solid #4a5054!important; border-radius: 5px!important;
  cursor: pointer; transition: all .15s;
}
${S(
    sc
)} .query-control-button:hover { color: #E0701B!important; border-color: #E0701B!important }
${S(sc)} .generate-query-button {
  background: transparent; color: #6EA3CB;
  border: 1px solid #4a5054; border-radius: 5px; transition: all .15s;
}
${S(
    sc
)} .generate-query-button:hover { border-color: #6EA3CB; background: rgba(110,163,203,.08) }
${S(sc)} .action-bar { background: transparent }
${S(sc)} .action-icon { color: #8a8f93 }
${S(sc)} .action-icon:hover { color: #E0701B }

/* ── Editor toolbar overlay ── */
${S(sc)} .editor-toolbar {
  background: transparent!important; border: none!important;
}

/* ── Tabs ── */
${S(sc)} .tab-container {
  background: #363D40!important; border-bottom: 1px solid #4a5054;
  border-top: none;
}
${S(sc)} .tabs-container {
  background: #363D40!important;
}
${S(sc)} .tab-item,
${S(sc)} .tab-item-selected {
  background: transparent!important; border: none!important;
  padding: 8px 14px; font-size: 13px;
  cursor: pointer; transition: all .15s; border-radius: 0;
  border-bottom: 2px solid transparent!important;
}
${S(sc)} .tab-item { color: #8a8f93 }
${S(
    sc
)} .tab-item:hover { color: #dcdcdc; background: rgba(255,255,255,.04)!important }
${S(sc)} .tab-item-selected {
  color: #dcdcdc; font-weight: 500;
  border-bottom-color: #E0701B!important;
}
${S(
    sc
)} .tab-item-selected:hover { background: rgba(255,255,255,.04)!important }
${S(sc)} .close-button { color: #6a7175; transition: color .15s }
${S(sc)} .close-button:hover { color: #ff6b6b }
${S(
    sc
)} .add-query-button { color: #6a7175; transition: color .15s; background: transparent!important }
${S(sc)} .add-query-button:hover { color: #E0701B }
${S(sc)} .add-query-button hr { display: none!important }
${S(
    sc
)} .tab-list-button-and-menu { border-color: #4a5054; background: transparent!important }
${S(
    sc
)} .tab-buttons { border-color: #4a5054; background: transparent!important }
${S(sc)} .tab-button { color: #8a8f93; transition: color .15s }
${S(sc)} .tab-button:hover { color: #dcdcdc }
${S(
    sc
)} .tab-list { border-color: transparent; border-top: none; background: #2B3033 }

/* ── Tabs overflow / ellipsis menu ── */
${S(sc)} .ellipses-button {
  background: transparent!important; color: #8a8f93!important;
  border: 1px solid #4a5054!important; border-radius: 5px!important;
  width: auto; height: auto; padding: 4px 8px;
}
${S(
    sc
)} .ellipses-button:hover { background: #4a5054!important; color: #dcdcdc!important }
${S(sc)} .controltab {
  background: transparent!important; color: #8a8f93!important;
  border: 1px solid #4a5054!important; border-radius: 5px!important;
  padding: 6px 12px; font-size: small; transition: all .15s;
}
${S(
    sc
)} .controltab:hover { background: #4a5054!important; color: #dcdcdc!important }
${S(
    sc
)} .tabs-ellipses-menu { background: transparent!important; color: #8a8f93 }
${S(
    sc
)} .tabs-ellipses-menu:hover { background: #4a5054!important; color: #dcdcdc }
${S(sc)} .tabs-ellipses-menu-content {
  background: #2B3033; border: 1px solid #4a5054; border-radius: 5px;
  box-shadow: 0 8px 24px rgba(0,0,0,.4);
}
${S(sc)} .tabs-ellipses-menu-content input {
  background: #363D40; border: 1px solid #4a5054; color: #dcdcdc; border-radius: 5px;
}
${S(sc)} .tabs-ellipses-menu-content .tab-item { border-radius: 4px }
${S(sc)} .tabs-ellipses-menu-content .tab-item:hover { background: #3a4145 }

/* ── Editor ── */
${S(sc)} .editor,
${S(sc)} .editorContainer,
${S(sc)} .editorParent,
${S(sc)} .overflow-guard,
${S(sc)} .lines-content,
${S(sc)} .monaco-editor,
${S(sc)} .monaco-editor-background,
${S(sc)} .inputarea,
${S(sc)} .split-view-container,
${S(sc)} .split-view-view,
${S(sc)} .view-overlays {
  background-color: #2B3033!important;
}
${S(sc)} .monaco-editor .margin,
${S(sc)} .monaco-editor .margin-view-overlays,
${S(sc)} .monaco-editor .glyph-margin {
  background-color: #2B3033!important;
}
${S(sc)} .monaco-editor .line-numbers {
  color: #6a7175!important;
}
${S(sc)} .monaco-editor .current-line-margin {
  border-color: rgba(255,255,255,.06);
}
${S(sc)} .scroll-decoration { box-shadow: none!important }
${S(sc)} .minimap { background: #2B3033!important }
${S(sc)} .minimap canvas { opacity: .7 }
${S(sc)} .monaco-scrollable-element { background: #2B3033!important }
${S(
    sc
)} .monaco-editor .cursors-layer .cursor { background-color: #E0701B!important }

/* ── Results ── */
${S(sc)} .result-set { background: #2B3033 }
${S(sc)} .result-table-container { background: #2B3033 }
${S(
    sc
)} .result-table { border-collapse: collapse; width: 100%; font-size: 13px }
${S(sc)} .result-table th {
  background: #363D40; color: #dcdcdc; font-weight: 500;
  padding: 8px 12px; text-align: left;
  border-bottom: 2px solid #4a5054;
  position: sticky; top: 0; z-index: 1;
}
${S(sc)} .result-table td {
  padding: 6px 12px; border-bottom: 1px solid rgba(255,255,255,.06);
  color: #dcdcdc;
}
${S(sc)} .result-table tr:hover td { background: rgba(224,112,27,.06) }
${S(sc)} .result-cell-null { color: #6a7175; font-style: italic }
${S(sc)} .clear-result-table { color: #8a8f93; transition: color .15s }
${S(sc)} .clear-result-table:hover { color: #ff6b6b }

/* ── Status bar ── */
${S(sc)} .status-bar {
  background: #363D40; color: #8a8f93; font-size: 12px;
  padding: 4px 12px; border-top: 1px solid #4a5054;
}
${S(sc)} .status-text { color: #8a8f93 }
${S(sc)} .status-stage-default { color: #8a8f93 }
${S(sc)} .status-stage-bytes { color: #6EA3CB }
${S(sc)} .status-stage-rows { color: #E0701B }
${S(sc)} .status-stage-splits { color: #a78bdb }

/* ── Progress bar ── */
${S(sc)} .progress-bar {
  background: #363D40; border: 1px solid #4a5054; border-radius: 5px;
  overflow: hidden;
}
${S(
    sc
)} .progress-bar-fill { background: linear-gradient(90deg,#E0701B,#ec934f); transition: width .3s ease }
${S(sc)} .progress-bar-grid { background: #363D40 }
${S(sc)} .progress-percent { color: #dcdcdc; font-size: 12px }
${S(sc)} .progress-bar-running-state { color: #E0701B }
${S(sc)} .progress-bar-timer { color: #8a8f93 }

/* ── Error box ── */
${S(sc)} .error-box {
  background: rgba(180,40,40,.15)!important; border: 1px solid #cc444488;
  border-radius: 5px; margin: 8px; padding: 12px;
}
${S(
    sc
)} .error-box-header { color: #ff6b6b; font-weight: 600; margin-bottom: 4px }
${S(sc)} .error-box-body { color: #dcdcdc }
${S(sc)} .error-box-message { color: #dcdcdc; font-size: 13px }
${S(sc)} .error-box-context { color: #8a8f93; font-size: 12px }
${S(
    sc
)} .error-box-close { color: #8a8f93; cursor: pointer; transition: color .15s }
${S(sc)} .error-box-close:hover { color: #ff6b6b }

/* ── Context menu ── */
${S(sc)} .context-menu {
  background: #2B3033; border: 1px solid #4a5054; border-radius: 5px;
  box-shadow: 0 8px 24px rgba(0,0,0,.4); overflow: hidden;
}
${S(sc)} .menu-item {
  padding: 8px 16px; color: #dcdcdc; cursor: pointer; transition: background .1s;
}
${S(sc)} .menu-item:hover { background: rgba(224,112,27,.12) }
${S(sc)} .menu-divider { border-color: #4a5054; margin: 4px 0 }

/* ── Filter / search ── */
${S(sc)} .filter-input {
  background: #363D40; border: 1px solid #4a5054; color: #dcdcdc;
  border-radius: 5px; padding: 6px 10px; font-size: 13px;
  transition: border-color .15s;
}
${S(sc)} .filter-input:focus { border-color: #E0701B; outline: none }
${S(sc)} .filter-input::placeholder { color: #6a7175 }
${S(sc)} .search-container input {
  background: #363D40; border: 1px solid #4a5054; color: #dcdcdc;
  border-radius: 5px;
}
${S(sc)} .clear-search { color: #8a8f93 }
${S(sc)} .clear-search:hover { color: #dcdcdc }

/* ── Catalog panel ── */
${S(sc)} .catalog-content { background: #2B3033 }
${S(sc)} .catalog-viewer { background: #2B3033 }
${S(sc)} .catalog-wrapper { background: #2B3033 }
${S(sc)} .catalog-container { background: #2B3033 }
${S(sc)} .catalog-viewer-header {
  background: #363D40; color: #dcdcdc; font-weight: 500;
  padding: 8px 12px; border-bottom: 1px solid #4a5054;
}
${S(sc)} .catalog-name { color: #E0701B; font-weight: 500 }
${S(sc)} .catalog-setting { color: #8a8f93; background: transparent }
${S(sc)} .schema-name { color: #6EA3CB }
${S(sc)} .schema-setting { color: #8a8f93; background: transparent }
${S(sc)} .table-name { color: #dcdcdc }
${S(
    sc
)} .column-name { color: #8a8f93; font-family: "Roboto Mono", monospace; font-size: 12px }
${S(sc)} .columnType { color: #6a7175; font-size: 11px }
${S(sc)} .qualifiedName { color: #8a8f93 }

/* ── Catalog tree ── */
${S(sc)} .viewer_catalog {
  color: #dcdcdc; font-weight: 600;
}
${S(
    sc
)} .viewer_catalog:hover { background: rgba(224,112,27,.12); color: #E0701B }
${S(sc)} .viewer_catalog_body {
  margin-left: 10px; border-left: 1px solid #4a5054;
}
${S(sc)} .viewer_schema {
  color: #8a8f93; border-left: 1px solid #4a5054;
}
${S(
    sc
)} .viewer_schema:hover { background: rgba(110,163,203,.1); color: #6EA3CB }
${S(sc)} .viewer_table {
  color: #8a8f93; border-left: 1px solid #4a5054;
  transition: all .1s; cursor: pointer;
}
${S(
    sc
)} .viewer_table:hover { color: #E0701B; background: rgba(224,112,27,.06) }
${S(sc)} .viewer_table_body { border-left: 1px solid #4a5054 }
${S(sc)} .viewer_column { border-left: 1px solid #4a5054 }
${S(sc)} .viewer-schema-body { background: transparent }

/* ── Collapse (Catalogs) button ── */
${S(sc)} .collapse-button {
  background: #363D40!important; color: #E0701B!important;
  border: 1px solid #4a5054; border-radius: 5px;
  font-weight: 500; padding: 6px 16px; cursor: pointer;
  transition: all .15s; font-size: 13px;
}
${S(
    sc
)} .collapse-button:hover { background: #4a5054!important; border-color: #E0701B }

/* ── Loading ── */
${S(sc)} .loading-message { color: #8a8f93 }
${S(sc)} .spinner { border-color: #4a5054; border-top-color: #E0701B }

/* ── Query status ── */
${S(
    sc
)} .query-status-table { font-size: 13px; color: #dcdcdc; background: transparent }
${S(
    sc
)} .query-status-table td { padding: 4px 8px; border-bottom: 1px solid rgba(255,255,255,.06) }

/* ── Links ── */
${S(sc)} a { color: #6EA3CB; text-decoration: none; transition: color .15s }
${S(sc)} a:hover { color: #ec934f }
${S(sc)} .link-to-query { color: #6EA3CB }
${S(sc)} .copy-link { color: #8a8f93; transition: color .15s }
${S(sc)} .copy-link:hover { color: #E0701B }
${S(sc)} .breadcrumb-item { color: #8a8f93 }
${S(sc)} .breadcrumb-item:hover { color: #E0701B }

/* ── Borders ── */
${S(sc)} .separator-border { background: #4a5054 }

/* ── Scrollbars ── */
${S(sc)} ::-webkit-scrollbar { width: 8px; height: 8px }
${S(sc)} ::-webkit-scrollbar-track { background: transparent }
${S(
    sc
)} ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.15); border-radius: 4px }
${S(sc)} ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.25) }

/* ── Selection ── */
${S(sc)} *::selection { background: rgba(224,112,27,.25) }
`;

/* ═══════════════════════════════════════════════════════════════════
   LIGHT MODE
   ═══════════════════════════════════════════════════════════════════ */
export const TRINO_LIGHT_VARS = (sc: string) => `

/* ── CSS custom properties ── */
${S(sc)} {
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
  color: var(--text-color);
  background: var(--bg-color);
  font-family: Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* ── Global: override ALL hardcoded dark backgrounds from trino CSS ── */
${S(sc)} .page,
${S(sc)} .tab-content,
${S(sc)} .tab-list,
${S(sc)} .cards,
${S(sc)} .card {
  background-color: #fff;
  color: #333;
}

/* ── Card header ── */
${S(sc)} .card-header {
  background: #f5f5f6; border-bottom: 1px solid #e0e0e0;
  padding: 6px 12px;
}
${S(sc)} .card-header-grid { gap: 8px }
${S(sc)} .query-title {
  color: #062D4B; font-weight: 600; font-size: 14px;
  background-color: transparent;
}

/* ── Run button (primary action) ── */
${S(sc)} .query-run-button {
  background: #E0701B!important; color: #fff!important;
  border: none!important; border-radius: 5px!important;
  padding: 6px 14px; font-weight: 600; font-size: 13px;
  cursor: pointer; transition: background .15s, box-shadow .15s;
  box-shadow: 0 1px 3px rgba(0,0,0,.12);
}
${S(sc)} .query-run-button:hover {
  background: #9c3b15!important;
  box-shadow: 0 2px 8px rgba(224,112,27,.25);
}
${S(sc)} .query-run-button svg { color: #fff!important; fill: #fff!important }

/* ── Toolbar / action buttons ── */
${S(sc)} .small-rounded-button {
  background: transparent!important; color: #555!important;
  border: 1px solid #d0d0d0!important; border-radius: 5px!important;
  padding: 4px 8px; cursor: pointer; transition: all .15s;
}
${S(sc)} .small-rounded-button:hover {
  background: #f0f0f0!important; color: #333!important; border-color: #bbb!important;
}
${S(sc)} .small-rounded-button svg { color: #555; transition: color .15s }
${S(sc)} .small-rounded-button:hover svg { color: #333 }
${S(sc)} .small-rounded-dark-grey-button {
  background: #f5f5f6!important; color: #666!important;
  border: 1px solid #d0d0d0!important; border-radius: 5px!important;
  cursor: pointer; transition: all .15s;
}
${S(
    sc
)} .small-rounded-dark-grey-button:hover { background: #eaeaea!important; color: #333!important }
${S(sc)} .editor-button {
  color: #777!important; background: transparent!important;
  border: none; transition: color .15s;
}
${S(sc)} .editor-button:hover { color: #E0701B!important }
${S(sc)} .editor-button[disabled] { opacity: .4 }
${S(sc)} .toolbar-button {
  color: #777; background: transparent; transition: color .15s;
}
${S(sc)} .toolbar-button:hover { color: #333 }
${S(sc)} .result-action-button {
  background: rgba(255,255,255,.9)!important; color: #555!important; border-radius: 5px;
  transition: all .15s; padding: 6px 12px;
  border: 1px solid #d0d0d0; backdrop-filter: blur(4px);
}
${S(
    sc
)} .result-action-button:hover { background: #f0f0f0!important; color: #333!important }
${S(sc)} .query-control-button {
  background: transparent!important; color: #555!important;
  border: 1px solid #d0d0d0!important; border-radius: 5px!important;
  cursor: pointer; transition: all .15s;
}
${S(
    sc
)} .query-control-button:hover { color: #E0701B!important; border-color: #E0701B!important }
${S(sc)} .generate-query-button {
  background: transparent; color: #062D4B;
  border: 1px solid #d0d0d0; border-radius: 5px; transition: all .15s;
}
${S(
    sc
)} .generate-query-button:hover { border-color: #062D4B; background: rgba(6,45,75,.04) }
${S(sc)} .action-bar { background: transparent }
${S(sc)} .action-icon { color: #999 }
${S(sc)} .action-icon:hover { color: #E0701B }

/* ── Editor toolbar overlay ── */
${S(sc)} .editor-toolbar {
  background: transparent!important; border: none!important;
}

/* ── Tabs ── */
${S(sc)} .tab-container {
  background: #fff!important; border-bottom: 1px solid #e0e0e0;
  border-top: none;
}
${S(sc)} .tabs-container {
  background: #fff!important;
}
${S(sc)} .tab-item,
${S(sc)} .tab-item-selected {
  background: transparent!important; border: none!important;
  padding: 8px 14px; font-size: 13px;
  cursor: pointer; transition: all .15s; border-radius: 0;
  border-bottom: 2px solid transparent!important;
}
${S(sc)} .tab-item { color: #666 }
${S(sc)} .tab-item:hover { color: #333; background: rgba(0,0,0,.02)!important }
${S(sc)} .tab-item-selected {
  color: #333; font-weight: 500;
  border-bottom-color: #E0701B!important;
}
${S(sc)} .tab-item-selected:hover { background: rgba(0,0,0,.02)!important }
${S(sc)} .close-button { color: #ccc; transition: color .15s }
${S(sc)} .close-button:hover { color: #ff4444 }
${S(
    sc
)} .add-query-button { color: #ccc; transition: color .15s; background: transparent!important }
${S(sc)} .add-query-button:hover { color: #E0701B }
${S(sc)} .add-query-button hr { display: none!important }
${S(
    sc
)} .tab-list-button-and-menu { border-color: #e0e0e0; background: transparent!important }
${S(
    sc
)} .tab-buttons { border-color: #e0e0e0; background: transparent!important }
${S(sc)} .tab-button { color: #999; transition: color .15s }
${S(sc)} .tab-button:hover { color: #333 }
${S(
    sc
)} .tab-list { border-color: transparent; border-top: none; background: #fff }

/* ── Tabs overflow / ellipsis menu ── */
${S(sc)} .ellipses-button {
  background: transparent!important; color: #777!important;
  border: 1px solid #d0d0d0!important; border-radius: 5px!important;
  width: auto; height: auto; padding: 4px 8px;
}
${S(
    sc
)} .ellipses-button:hover { background: #f0f0f0!important; color: #333!important }
${S(sc)} .controltab {
  background: transparent!important; color: #555!important;
  border: 1px solid #d0d0d0!important; border-radius: 5px!important;
  padding: 6px 12px; font-size: small; transition: all .15s;
}
${S(
    sc
)} .controltab:hover { background: #f0f0f0!important; color: #333!important }
${S(sc)} .tabs-ellipses-menu { background: transparent!important; color: #666 }
${S(
    sc
)} .tabs-ellipses-menu:hover { background: #f0f0f0!important; color: #333 }
${S(sc)} .tabs-ellipses-menu-content {
  background: #fff; border: 1px solid #e0e0e0; border-radius: 5px;
  box-shadow: 0 8px 24px rgba(0,0,0,.1);
}
${S(sc)} .tabs-ellipses-menu-content input {
  background: #f5f5f6; border: 1px solid #e0e0e0; color: #333; border-radius: 5px;
}
${S(sc)} .tabs-ellipses-menu-content .tab-item { border-radius: 4px }
${S(sc)} .tabs-ellipses-menu-content .tab-item:hover { background: #f5f5f6 }

/* ── Editor ── */
${S(sc)} .editor,
${S(sc)} .editorContainer,
${S(sc)} .editorParent,
${S(sc)} .overflow-guard,
${S(sc)} .lines-content,
${S(sc)} .monaco-editor,
${S(sc)} .monaco-editor-background,
${S(sc)} .inputarea,
${S(sc)} .split-view-container,
${S(sc)} .split-view-view,
${S(sc)} .view-overlays {
  background-color: #fff!important;
}
${S(sc)} .monaco-editor .margin,
${S(sc)} .monaco-editor .margin-view-overlays,
${S(sc)} .monaco-editor .glyph-margin {
  background-color: #fafafa!important;
}
${S(sc)} .monaco-editor .line-numbers {
  color: #bbb!important;
}
${S(sc)} .monaco-editor .current-line-margin {
  border-color: rgba(0,0,0,.06);
}
${S(sc)} .scroll-decoration { box-shadow: none!important }
${S(sc)} .minimap { background: #fff!important }
${S(sc)} .minimap canvas { opacity: .6 }
${S(sc)} .monaco-scrollable-element { background: #fff!important }
${S(
    sc
)} .monaco-editor .cursors-layer .cursor { background-color: #E0701B!important }

/* ── Results ── */
${S(sc)} .result-set { background: #fff }
${S(sc)} .result-table-container { background: #fff }
${S(
    sc
)} .result-table { border-collapse: collapse; width: 100%; font-size: 13px }
${S(sc)} .result-table th {
  background: #f5f5f6; color: #333; font-weight: 600;
  padding: 8px 12px; text-align: left;
  border-bottom: 2px solid #e0e0e0;
  position: sticky; top: 0; z-index: 1;
}
${S(sc)} .result-table td {
  padding: 6px 12px; border-bottom: 1px solid #f0f0f0;
  color: #333;
}
${S(sc)} .result-table tr:hover td { background: rgba(224,112,27,.04) }
${S(sc)} .result-cell-null { color: #bbb; font-style: italic }
${S(sc)} .clear-result-table { color: #999; transition: color .15s }
${S(sc)} .clear-result-table:hover { color: #ff4444 }

/* ── Status bar ── */
${S(sc)} .status-bar {
  background: #f5f5f6; color: #666; font-size: 12px;
  padding: 4px 12px; border-top: 1px solid #e0e0e0;
}
${S(sc)} .status-text { color: #666 }
${S(sc)} .status-stage-default { color: #666 }
${S(sc)} .status-stage-bytes { color: #062D4B }
${S(sc)} .status-stage-rows { color: #E0701B }
${S(sc)} .status-stage-splits { color: #7c5db8 }

/* ── Progress bar ── */
${S(sc)} .progress-bar {
  background: #f5f5f6; border: 1px solid #e0e0e0; border-radius: 5px;
  overflow: hidden;
}
${S(
    sc
)} .progress-bar-fill { background: linear-gradient(90deg,#E0701B,#ec934f); transition: width .3s ease }
${S(sc)} .progress-bar-grid { background: #f5f5f6 }
${S(sc)} .progress-percent { color: #333; font-size: 12px }
${S(sc)} .progress-bar-running-state { color: #E0701B }
${S(sc)} .progress-bar-timer { color: #666 }

/* ── Error box ── */
${S(sc)} .error-box {
  background: #fef2f2!important; border: 1px solid #fca5a5;
  border-radius: 5px; margin: 8px; padding: 12px;
}
${S(
    sc
)} .error-box-header { color: #dc2626; font-weight: 600; margin-bottom: 4px }
${S(sc)} .error-box-body { color: #555 }
${S(sc)} .error-box-message { color: #555; font-size: 13px }
${S(sc)} .error-box-context { color: #999; font-size: 12px }
${S(
    sc
)} .error-box-close { color: #999; cursor: pointer; transition: color .15s }
${S(sc)} .error-box-close:hover { color: #dc2626 }

/* ── Context menu ── */
${S(sc)} .context-menu {
  background: #fff; border: 1px solid #e0e0e0; border-radius: 5px;
  box-shadow: 0 8px 24px rgba(0,0,0,.1); overflow: hidden;
}
${S(sc)} .menu-item {
  padding: 8px 16px; color: #333; cursor: pointer; transition: background .1s;
}
${S(sc)} .menu-item:hover { background: rgba(224,112,27,.06) }
${S(sc)} .menu-divider { border-color: #f0f0f0; margin: 4px 0 }

/* ── Filter / search ── */
${S(sc)} .filter-input {
  background: #fff; border: 1px solid #e0e0e0; color: #333;
  border-radius: 5px; padding: 6px 10px; font-size: 13px;
  transition: border-color .15s;
}
${S(sc)} .filter-input:focus { border-color: #E0701B; outline: none }
${S(sc)} .filter-input::placeholder { color: #bbb }
${S(sc)} .search-container input {
  background: #fff; border: 1px solid #e0e0e0; color: #333;
  border-radius: 5px;
}
${S(sc)} .clear-search { color: #999 }
${S(sc)} .clear-search:hover { color: #333 }

/* ── Catalog panel ── */
${S(sc)} .catalog-content { background: #fff }
${S(sc)} .catalog-viewer { background: #fff }
${S(sc)} .catalog-wrapper { background: #fff }
${S(sc)} .catalog-container { background: #fff }
${S(sc)} .catalog-viewer-header {
  background: #f5f5f6; color: #062D4B; font-weight: 500;
  padding: 8px 12px; border-bottom: 1px solid #e0e0e0;
}
${S(sc)} .catalog-name { color: #E0701B; font-weight: 500 }
${S(sc)} .catalog-setting { color: #999; background: transparent }
${S(sc)} .schema-name { color: #062D4B }
${S(sc)} .schema-setting { color: #999; background: transparent }
${S(sc)} .table-name { color: #333 }
${S(
    sc
)} .column-name { color: #666; font-family: "Roboto Mono", monospace; font-size: 12px }
${S(sc)} .columnType { color: #999; font-size: 11px }
${S(sc)} .qualifiedName { color: #999 }

/* ── Catalog tree ── */
${S(sc)} .viewer_catalog {
  color: #333; font-weight: 600;
}
${S(
    sc
)} .viewer_catalog:hover { background: rgba(224,112,27,.08); color: #E0701B }
${S(sc)} .viewer_catalog_body {
  margin-left: 10px; border-left: 1px solid #e0e0e0;
}
${S(sc)} .viewer_schema {
  color: #555; border-left: 1px solid #e0e0e0;
}
${S(sc)} .viewer_schema:hover { background: rgba(6,45,75,.06); color: #062D4B }
${S(sc)} .viewer_table {
  color: #666; border-left: 1px solid #e0e0e0;
  transition: all .1s; cursor: pointer;
}
${S(
    sc
)} .viewer_table:hover { color: #E0701B; background: rgba(224,112,27,.04) }
${S(sc)} .viewer_table_body { border-left: 1px solid #e0e0e0 }
${S(sc)} .viewer_column { border-left: 1px solid #e0e0e0 }
${S(sc)} .viewer-schema-body { background: transparent }

/* ── Collapse (Catalogs) button ── */
${S(sc)} .collapse-button {
  background: #fff!important; color: #E0701B!important;
  border: 1px solid #e0e0e0; border-radius: 5px;
  font-weight: 500; padding: 6px 16px; cursor: pointer;
  transition: all .15s; font-size: 13px;
}
${S(
    sc
)} .collapse-button:hover { background: #f5f5f6!important; border-color: #E0701B }

/* ── Loading ── */
${S(sc)} .loading-message { color: #666 }
${S(sc)} .spinner { border-color: #e0e0e0; border-top-color: #E0701B }

/* ── Query status ── */
${S(
    sc
)} .query-status-table { font-size: 13px; color: #333; background: transparent }
${S(
    sc
)} .query-status-table td { padding: 4px 8px; border-bottom: 1px solid #f0f0f0 }

/* ── Links ── */
${S(sc)} a { color: #E0701B; text-decoration: none; transition: color .15s }
${S(sc)} a:hover { color: #9c3b15 }
${S(sc)} .link-to-query { color: #E0701B }
${S(sc)} .copy-link { color: #999; transition: color .15s }
${S(sc)} .copy-link:hover { color: #E0701B }
${S(sc)} .breadcrumb-item { color: #666 }
${S(sc)} .breadcrumb-item:hover { color: #E0701B }

/* ── Borders ── */
${S(sc)} .separator-border { background: #e0e0e0 }

/* ── Scrollbars ── */
${S(sc)} ::-webkit-scrollbar { width: 8px; height: 8px }
${S(sc)} ::-webkit-scrollbar-track { background: transparent }
${S(
    sc
)} ::-webkit-scrollbar-thumb { background: rgba(0,0,0,.1); border-radius: 4px }
${S(sc)} ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,.18) }

/* ── Selection ── */
${S(sc)} *::selection { background: rgba(224,112,27,.15) }
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
${S(
    sc
)} .card-header     { flex-shrink:0; overflow:visible; height:auto!important; z-index:3 }
${S(sc)} .tab-container   { flex-shrink:0; overflow:visible!important }

/* ── Editor area ── */
${S(
    sc
)} .monaco-split-view2 { flex:1; min-height:0; border-bottom:none!important }
${S(sc)} .editor              { flex:1; min-height:0 }
${S(sc)} .editorParent { border-bottom:none!important }

/* ── Monaco split panes (maximize/restore) ── */
${S(sc)} .split-view-container { background:inherit!important }
${S(sc)} .split-view-view { background:inherit!important }
${S(sc)} .monaco-scrollable-element { background:inherit!important }

/* ── Minimap: hide to save space, or match bg ── */
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

/* ── Tooltips ── */
${S(sc)} .editor-button[data-tooltip]:hover:after {
  background:rgba(0,0,0,.8)!important; color:#fff!important;
  border-radius:4px; font-size:11px; padding:4px 8px;
}
`;
