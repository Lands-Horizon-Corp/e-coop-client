import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(employees)/employees/roles-management'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>
            Hello
            "/org/$orgname/branch/$branchname/(maintenance)/(employees)/employees/roles-management"!
        </div>
    )
}
