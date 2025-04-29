import { useState } from 'react';
import SpySvg from '../src/assets/spy.svg';
import { RouterProvider } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import createRouter from '@/root-route';
import { useIncognitoDetector } from './hooks/use-incognito-detector';

declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof createRouter>;
    }
}

const App = () => {
    const [queryClient] = useState(new QueryClient());
    const { isChecking, isAllowed } = useIncognitoDetector({
        onNotAllowed: () => {
            localStorage.clear();
            document.cookie = '';

            document
                .querySelectorAll('head script')
                .forEach((script) => script.remove());
        },
    });

    if (!isAllowed || isChecking)
        return (
            <div className="w-dvh h-dvh items-center justify-center gap-y-4 text-muted-foreground/70">
                {isChecking ? (
                    <p>Checking</p>
                ) : (
                    <>
                        <img src={SpySvg} alt="Spy" className="size-36" />
                        <p className="text-4xl text-foreground/60">Forbidden</p>
                        <p>
                            We cannot allow you to use this app on
                            private/incognito mode
                        </p>
                    </>
                )}
            </div>
        );

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={createRouter(queryClient)} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;
