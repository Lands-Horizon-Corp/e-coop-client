import { useParams } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'

import { useHotkeys } from 'react-hotkeys-hook'

import PageContainer from '@/components/containers/page-container'

import MemberProfileSettings from '../components/member-profile-settings'

function MemberProfileSettingsPage() {
    const { navigate, history } = useRouter()
    const { memberId, settings: tab } = useParams({
        from: '/org/$orgname/branch/$branchname/(maintenance)/(members)/member-profile/$memberId/$settings/',
    })

    useHotkeys('escape', () => history.back())

    return (
        <PageContainer>
            <MemberProfileSettings
                activeTab={tab}
                memberProfileId={memberId}
                onTabChange={(settingsTab) =>
                    navigate({ to: '../' + settingsTab })
                }
            />
        </PageContainer>
    )
}

export default MemberProfileSettingsPage
