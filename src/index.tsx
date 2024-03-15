import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';


// set title
document.title = import.meta.env.VITE_APP_NAME || 'DigitalHub';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
