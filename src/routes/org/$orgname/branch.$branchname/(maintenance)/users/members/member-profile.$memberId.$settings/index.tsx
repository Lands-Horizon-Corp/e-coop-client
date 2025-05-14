import PageContainer from '@/components/containers/page-container'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/users/members/member-profile/$memberId/$settings/'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { memberId: _id, settings: _set } = useParams({
        from: '/org/$orgname/branch/$branchname/(maintenance)/users/members/member-profile/$memberId/$settings/',
    })

    return <PageContainer></PageContainer>
}
