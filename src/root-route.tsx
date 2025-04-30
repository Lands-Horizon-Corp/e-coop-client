import { QueryClient } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import { createRootRouteWithContext } from '@tanstack/react-router';

import AuthRoute from '@/pages/auth/route';
import TestRoute from '@/pages/test-pages/route';
import LandingRoute from '@/pages/landing/route';

import RootLayout from '@/pages/root-layout';
import NotFoundPage from '@/components/not-found';
import practiceLandingRoute from './public/route';

export type TRouterContext = {
    queryClient: QueryClient;
};

export const rootRoute = createRootRouteWithContext<TRouterContext>()();

const routeTree = rootRoute.addChildren([
    TestRoute,
    AuthRoute,
    LandingRoute,
    practiceLandingRoute,
]);

const router = (queryClient: QueryClient) =>
    createRouter({
        routeTree,
        context: {
            queryClient,
        },
        defaultComponent: RootLayout,
        defaultNotFoundComponent: NotFoundPage,
    });

export default router;
