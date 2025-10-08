import { useState } from 'react';

import {
    QueryClient,
    QueryClientProvider,
    matchQuery,
} from '@tanstack/react-query';
import { MutationCache } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';

import { ThemeProvider } from '@/modules/settings/provider/theme-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import SpySvg from '../src/assets/spy.svg';
import PageContainer from './components/containers/page-container';
import Image from './components/image';
import LoadingSpinner from './components/spinners/loading-spinner';
import { APP_ENV } from './constants';
import { useIncognitoDetector } from './hooks/use-incognito-detector';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const App = () => {
    const [queryClient] = useState(
        new QueryClient({
            mutationCache: new MutationCache({
                onSuccess: (_data, _variables, _context, mutation) => {
                    if (
                        mutation.meta?.invalidates &&
                        mutation.meta?.invalidates.length > 0
                    ) {
                        queryClient.invalidateQueries({
                            predicate: (query) =>
                                // invalidate all matching tags at once
                                // or everything if no meta is provided
                                mutation.meta?.invalidates?.some((queryKey) =>
                                    matchQuery({ queryKey }, query)
                                ) ?? true,
                        });
                    }
                },
            }),
        })
    );
    const { isChecking, isAllowed } = useIncognitoDetector({
        onNotAllowed: () => {
            localStorage.clear();
            document.cookie = '';

            document
                .querySelectorAll('head script')
                .forEach((script) => script.remove());
        },
    });

    if ((!isAllowed || isChecking) && APP_ENV !== 'development')
        return (
            <PageContainer className="w-screen h-dvh items-center justify-center gap-y-4 text-muted-foreground/70">
                {isChecking ? (
                    <LoadingSpinner />
                ) : (
                    <>
                        <Image alt="Spy" className="size-36" src={SpySvg} />
                        <p className="text-4xl text-foreground/60">Forbidden</p>
                        <p>
                            We cannot allow you to use this app on
                            private/incognito mode
                        </p>
                    </>
                )}
            </PageContainer>
        );

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <RouterProvider router={router} />
            </ThemeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;
