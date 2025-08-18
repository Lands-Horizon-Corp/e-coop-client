import { createFileRoute, useParams, useRouter } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import MemberProfileSettings from '@/components/member-profile-settings'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/member-profile/$memberId/$settings/'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { navigate } = useRouter()
    const { memberId, settings: tab } = useParams({
        from: '/org/$orgname/branch/$branchname/(maintenance)/(members)/member-profile/$memberId/$settings/',
    })

    return (
        <PageContainer>
            <MemberProfileSettings
                memberProfileId={memberId}
                activeTab={tab}
                onTabChange={(settingsTab) =>
                    navigate({ to: '../' + settingsTab })
                }
            />
        </PageContainer>
    )
}
