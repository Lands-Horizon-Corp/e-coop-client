import { useState } from 'react'

import { cn } from '@/helpers/tw-utils'
import { useAuthUserWithOrg } from '@/modules/authentication/authgentication.store'
import BranchSettings from '@/modules/branch-settings/components/branch-settings'

import PageContainer from '@/components/containers/page-container'
import { BuildingGearIcon, GearIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import UserOrganizationSettings from '../../../user-organization/components/user-org-settings'

type TSettingPage = 'my-settings' | 'branch-settings'

interface SettingsNavItem {
    id: TSettingPage
    label: string
    icon: React.ComponentType<{ className?: string }>
    component: React.ComponentType
    requiredUserTypes?: string[]
}

const settingsNavItems: SettingsNavItem[] = [
    {
        id: 'my-settings',
        label: 'My Settings',
        icon: GearIcon,
        component: UserOrganizationSettings,
        requiredUserTypes: ['employee', 'admin', 'owner'],
    },
    {
        id: 'branch-settings',
        label: 'Branch Settings',
        icon: BuildingGearIcon,
        component: BranchSettings,
        requiredUserTypes: ['employee', 'admin', 'owner'],
    },
]

const MainSettingsPage = () => {
    const {
        currentAuth: {
            user_organization: { user_type },
        },
    } = useAuthUserWithOrg()
    const [page, setPage] = useState<TSettingPage>('my-settings')

    const currentPageItem = settingsNavItems.find((item) => item.id === page)
    const CurrentComponent = currentPageItem?.component

    const shouldShowPage = (item: SettingsNavItem) => {
        return (
            !item.requiredUserTypes ||
            item.requiredUserTypes.includes(user_type)
        )
    }

    return (
        <PageContainer className="relative flex-row items-start gap-x-4">
            <div className="space-y-0 p-1 sticky top-18 flex flex-col">
                {settingsNavItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <Button
                            className={cn(
                                'text-muted-foreground w-full justify-start',
                                page === item.id && 'text-primary'
                            )}
                            key={item.id}
                            onClick={() => setPage(item.id)}
                            size="sm"
                            variant="ghost"
                        >
                            <Icon className="inline mr-2" /> {item.label}
                        </Button>
                    )
                })}
            </div>
            {CurrentComponent && shouldShowPage(currentPageItem!) && (
                <CurrentComponent />
            )}
        </PageContainer>
    )
}

export default MainSettingsPage
