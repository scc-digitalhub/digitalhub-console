import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// Monaco ships ~80 basic-language grammars. We only keep the ones explicitly
// listed here. All others are stubbed so they don't appear in the dist.
// The custom 'trinosql' language (from trino-query-ui) is registered at runtime
// via monaco.languages.register() and is unaffected by this stub.
const MONACO_LANGUAGES_KEEP = new Set([
    'sql',      // generic SQL (used by Monaco's built-in SQL mode)
    'json',     // JSON editing (schema editor etc.)
    'yaml',     // YAML editing
]);

// Stub the monaco.contribution.js files for Monaco language services this app
// does not use (TypeScript, CSS, HTML). `editor.main.js` statically imports
// these; each one lazily loads a *Mode.js that in turn creates a worker via
//   new Worker(new URL('ts.worker.js', import.meta.url))
// Stubbing the contribution file before Vite traverses it prevents the entire
// chain — Mode file, workerManager, and the 7 MB+ worker bundle — from being
// emitted. The JSON language service is kept for JSON-schema editing support.
const monacoUnusedWorkersStub: Plugin = {
    name: 'monaco-unused-workers-stub',
    load(id: string) {
        if (
            id.includes('/monaco-editor/esm/vs/language/') &&
            id.endsWith('/monaco.contribution.js') &&
            !id.includes('/language/json/')
        ) {
            return ''; // empty — language never registered, worker never created
        }
    },
};

const monacoBasicLanguagesStub: Plugin = {
    name: 'monaco-basic-languages-stub',
    load(id: string) {
        // Don't touch the shared contribution helper (exports registerLanguage)
        if (id.includes('/basic-languages/_.contribution')) return;

        // Stub *.contribution.js files for languages not in the keep list.
        // Each contribution file contains a dynamic import() for the grammar file
        // (e.g. loader: () => import('./ruby.js')). Stubbing it prevents Vite
        // from ever seeing that import, so the grammar chunk is never bundled.
        if (
            id.includes('/monaco-editor/esm/vs/basic-languages/') &&
            id.endsWith('.contribution.js')
        ) {
            const lang = id.split('/basic-languages/')[1]?.split('/')[0];
            if (lang && !MONACO_LANGUAGES_KEEP.has(lang)) {
                return ''; // empty module — no registerLanguage, no lazy import
            }
        }
    },
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), splitVendorChunkPlugin(), tailwindcss(), monacoUnusedWorkersStub, monacoBasicLanguagesStub],
    define: {
        'process.env': process.env,
    },
    server: {
        host: true,
    },
    base: './',
    build: {
        manifest: true,
    },
    optimizeDeps: {
        include: ['@mui/material/Tooltip'],
        exclude: ['js-big-decimal']
    },
});
