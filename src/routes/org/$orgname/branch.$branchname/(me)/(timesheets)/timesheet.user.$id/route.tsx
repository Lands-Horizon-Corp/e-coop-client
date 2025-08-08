import z from 'zod'

import { createFileRoute, useParams } from '@tanstack/react-router'
import { zodSearchValidator } from '@tanstack/router-zod-adapter'

import PageContainer from '@/components/containers/page-container'
import TimesheetTable from '@/components/tables/timesheet-table'
import TimesheetTableAction from '@/components/tables/timesheet-table/action'

import { entityIdSchema } from '@/validations/common'

const pathSchema = z.object({
    id: entityIdSchema,
})

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(me)/(timesheets)/timesheet/user/$id'
)({
    component: RouteComponent,
    validateSearch: zodSearchValidator(pathSchema),
    params: {
        parse: (params) => {
            const data = pathSchema.parse(params)
            return data
        },
    },
})

function RouteComponent() {
    const { id } = useParams({
        from: '/org/$orgname/branch/$branchname/(me)/(timesheets)/timesheet/user/$id',
    })

    return (
        <PageContainer>
            <TimesheetTable
                mode="employee"
                userOrganizationId={id}
                actionComponent={TimesheetTableAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
