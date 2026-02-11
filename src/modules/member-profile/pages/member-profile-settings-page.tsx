import { useParams } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'

import PermissionGuard from '@/modules/permission/components/permission-guard'
import { useHotkeys } from 'react-hotkeys-hook'

import PageContainer from '@/components/containers/page-container'

import MemberProfileSettings from '../components/member-profile-settings'
import { useGetMemberProfileById } from '../member-profile.service'

function MemberProfileSettingsPage() {
    const { navigate, history } = useRouter()
    const { memberId, settings: tab } = useParams({
        from: '/org/$orgname/branch/$branchname/(members)/member-profile/$memberId/$settings/',
    })

    useHotkeys('escape', () => history.back())

    const { data: memberProfile } = useGetMemberProfileById({
        id: memberId,
        options: {
            refetchOnWindowFocus: false,
        },
    })

    return (
        <PageContainer>
            <PermissionGuard
                action={['Update', 'OwnUpdate']}
                resource={memberProfile}
                resourceType="MemberProfile"
            >
                <MemberProfileSettings
                    activeTab={tab}
                    memberProfileId={memberId}
                    onTabChange={(settingsTab) =>
                        navigate({ to: '../' + settingsTab })
                    }
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default MemberProfileSettingsPage
