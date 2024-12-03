import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';

// set title
document.title =
    (globalThis as any).VITE_APP_NAME ||
    import.meta.env.VITE_APP_NAME ||
    'DigitalHub';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
