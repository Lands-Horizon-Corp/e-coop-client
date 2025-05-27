import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(net-surplus-handling)/net-surplus-grouping-positive'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>
            Hello
            "/org/$orgname/branch/$branchname/(maintenance)/maintenance/(net-surplus-handling)/net-surplus-grouping-positive"!
        </div>
    )
}
