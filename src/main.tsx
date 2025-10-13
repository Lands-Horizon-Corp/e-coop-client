import { StrictMode } from 'react';

import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import App from './app';
import { APP_ENV } from './constants';
import './index.css';

// Enhanced PWA registration with update notification
const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('New content available. Reload to update?')) {
            updateSW(true);
        }
    },
    onOfflineReady() {
        // e-coop-suite is ready to work offline
    },
    onRegistered(r: ServiceWorkerRegistration | undefined) {
        if (APP_ENV === 'development') {
            console.warn('SW Registered: ', r);
        }
    },
    onRegisterError(error: unknown) {
        console.error('SW registration error', error);
    },
    immediate: true,
});

if (APP_ENV !== 'development') {
    disableReactDevTools();
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
