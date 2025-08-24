import { useParams } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'

import MemberProfileSettings from '../components/member-profile-settings'

function MemberProfileSettingsPage() {
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

export default MemberProfileSettingsPage
