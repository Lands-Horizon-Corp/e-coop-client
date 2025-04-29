import {
    redirect,
    createRoute,
    lazyRouteComponent,
} from '@tanstack/react-router'

import { employeeUserRoute } from '../route'

export const employeeUserEmployeesRoute = createRoute({
    getParentRoute: () => employeeUserRoute,
    path: 'employees',
})

export const employeeEmployeesIndexRoute = createRoute({
    path: '/',
    getParentRoute: () => employeeUserEmployeesRoute,
    beforeLoad: () => {
        throw redirect({
            to: '/employee/users/employees/view-employees',
        })
    },
})

export const employeeEmployeesView = createRoute({
    getParentRoute: () => employeeUserEmployeesRoute,
    path: 'view-employees',
    component: lazyRouteComponent(() => import('./view-employees-page')),
})

const ownerEmployeesFootstepsRoute = createRoute({
    getParentRoute: () => employeeUserEmployeesRoute,
    path: 'employee-footsteps',
    component: lazyRouteComponent(() => import('./employee-footsteps-page')),
})

const EmployeeUserEmployeesRoute = employeeUserEmployeesRoute.addChildren([
    employeeEmployeesView,
    employeeEmployeesIndexRoute,
    ownerEmployeesFootstepsRoute,
])

export default EmployeeUserEmployeesRoute
