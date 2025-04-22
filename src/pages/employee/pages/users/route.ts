import { createRoute, redirect } from '@tanstack/react-router'

import { employeeRoute } from '../../route'
import EmployeeUserMemberRoute from './members/route'
import EmployeeUserEmployeesRoute from './employees/route'
import EmployeeAccountingRoute from '../accounting/route'

export const employeeUserRoute = createRoute({
    getParentRoute: () => employeeRoute,
    path: 'users',
})

export const employeeUserIndexRoute = createRoute({
    path: '/',
    getParentRoute: () => employeeUserRoute,
    beforeLoad: () => {
        throw redirect({
            to: '/employee/users/members/view-members',
        })
    },
})

const OwnerUserRoute = employeeUserRoute.addChildren([
    employeeUserIndexRoute,
    EmployeeAccountingRoute,
    EmployeeUserMemberRoute,
    EmployeeUserEmployeesRoute,
])

export default OwnerUserRoute
