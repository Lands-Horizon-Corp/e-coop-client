import './index.css';
import { StrictMode } from 'react';

// import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { createRoot } from 'react-dom/client';

import App from './app';

// const isDevelopment =
//     typeof import.meta.env !== "undefined" &&
//     import.meta.env.APP_ENV === "development";

// if (!isDevelopment) {
//     disableReactDevTools();
// }

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
