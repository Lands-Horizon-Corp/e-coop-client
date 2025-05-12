import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/users/member/member-type'
)({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>
            Hello
            "/org/$orgname/branch/$branchname/(maintenance)/user/member/member-type"!
        </div>
    )
}
