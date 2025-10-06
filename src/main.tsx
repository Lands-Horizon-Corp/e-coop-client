import { StrictMode } from 'react';

import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { createRoot } from 'react-dom/client';

import App from './app';
import { APP_ENV } from './constants';
import './index.css';

if (APP_ENV !== 'development') {
    disableReactDevTools();
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
