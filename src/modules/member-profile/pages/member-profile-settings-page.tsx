import { useParams } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'

import { useSimpleShortcut } from '@/hooks/use-simple-shortcut'

import MemberProfileSettings from '../components/member-profile-settings'

function MemberProfileSettingsPage() {
    const { navigate, history } = useRouter()
    const { memberId, settings: tab } = useParams({
        from: '/org/$orgname/branch/$branchname/(maintenance)/(members)/member-profile/$memberId/$settings/',
    })

    useSimpleShortcut(['Escape'], () => history.back())

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
