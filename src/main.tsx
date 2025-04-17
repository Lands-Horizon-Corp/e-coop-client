import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

import App from './app';

const isDevelopment =
    typeof import.meta.env !== 'undefined' &&
    import.meta.env.VITE_CLIENT_APP_ENV === 'development';

if (!isDevelopment) {
    disableReactDevTools();
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
