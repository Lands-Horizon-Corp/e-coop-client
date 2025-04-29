import {
    createRoute,
    redirect,
    lazyRouteComponent,
} from '@tanstack/react-router'
import { zodSearchValidator } from '@tanstack/router-zod-adapter'

import { rootRoute } from '@/root-route'
import {
    ForgotPasswordPageSearchSchema,
    SignInPageSearchSchema,
} from '@/pages/auth/validations/page-search'

const authRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: 'auth',
    component: lazyRouteComponent(() => import('./layout')),
    beforeLoad: ({ location }) => {
        if (location.pathname === '/auth' || location.pathname === '/auth/')
            throw redirect({ to: '/auth/sign-in' })
    },
    notFoundComponent: lazyRouteComponent(
        () => import('@/pages/auth/not-found')
    ),
})

const signUpRoute = createRoute({
    getParentRoute: () => authRoute,
    path: 'sign-up',
    component: lazyRouteComponent(() => import('@/pages/auth/pages/sign-up')),
})

const signInRoute = createRoute({
    getParentRoute: () => authRoute,
    path: 'sign-in',
    component: lazyRouteComponent(() => import('@/pages/auth/pages/sign-in')),
    validateSearch: zodSearchValidator(SignInPageSearchSchema),
})

const verifyRoute = createRoute({
    getParentRoute: () => authRoute,
    path: 'verify',
    component: lazyRouteComponent(() => import('@/pages/auth/pages/verify')),
})

const forgotPasswordRoute = createRoute({
    getParentRoute: () => authRoute,
    path: 'forgot-password',
    component: lazyRouteComponent(() => import('./pages/forgot-password')),
    validateSearch: zodSearchValidator(ForgotPasswordPageSearchSchema),
})

const passwordResetRoute = createRoute({
    getParentRoute: () => authRoute,
    path: 'password-reset/$resetId',
    component: lazyRouteComponent(() => import('./pages/password-reset')),
})

const AuthRoute = authRoute.addChildren([
    signUpRoute,
    signInRoute,
    verifyRoute,
    forgotPasswordRoute,
    passwordResetRoute,
])

export default AuthRoute
