import { QueryClient } from '@tanstack/react-query';

import { createRouter } from '@tanstack/react-router';
import { createRootRouteWithContext } from '@tanstack/react-router';

// import AuthRoute from '@/pages/auth/route';
// import TestRoute from '@/pages/test/route';
// import AdminRoute from '@/pages/admin/route';
// import OwnerRoute from '@/pages/owner/route';
// import MemberRoute from '@/pages/member/route';
// import LandingRoute from '@/pages/landing/route';
// import EmployeeRoute from '@/pages/employee/route';

// import RootLayout from '@/pages/root-layout';
// import NotFoundPage from '@/components/not-found';
import practiceLandingRoute from './public/route';

export type TRouterContext = {
    queryClient: QueryClient;
};

export const rootRoute = createRootRouteWithContext<TRouterContext>()();

const routeTree = rootRoute.addChildren([
    // AuthRoute,
    // AdminRoute,
    // OwnerRoute,
    // MemberRoute,
    // LandingRoute,
    // EmployeeRoute,
    // TestRoute,
    practiceLandingRoute,
]);

const router = (queryClient: QueryClient) =>
    createRouter({
        routeTree,
        context: {
            queryClient,
        },
        defaultComponent: () => <></>,
        defaultNotFoundComponent: () => <></>,
    });

export default router;
