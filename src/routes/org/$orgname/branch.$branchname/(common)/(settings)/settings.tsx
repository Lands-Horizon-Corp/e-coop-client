import { useState } from 'react'

import { cn } from '@/helpers/tw-utils'
import { useAuthUserWithOrg } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { BuildingGearIcon, GearIcon, PaintBrushIcon } from '@/components/icons'
import AppearanceSettings from '@/components/settings/appearance-settings'
import BranchSettings from '@/components/settings/branch-settings'
import UserOrganizationSettings from '@/components/settings/user-org-settings'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(common)/(settings)/settings'
)({
    component: RouteComponent,
})

type TSettingPage = 'appearance' | 'my-settings' | 'branch-settings'

function RouteComponent() {
    const {
        currentAuth: {
            user_organization: { user_type },
        },
    } = useAuthUserWithOrg()
    const [page, setPage] = useState<TSettingPage>('appearance')

    return (
        <PageContainer className="relative flex-row items-start gap-x-4">
            <div className="space-y-0 p-1 flex flex-col">
                <Button
                    onClick={() => setPage('appearance')}
                    className={cn(
                        'text-muted-foreground w-full justify-start',
                        page === 'appearance' && 'text-primary'
                    )}
                    variant="ghost"
                    size="sm"
                >
                    <PaintBrushIcon className="inline mr-2" /> Appearance
                </Button>
                <Button
                    onClick={() => setPage('my-settings')}
                    className={cn(
                        'text-muted-foreground w-full justify-start',
                        page === 'my-settings' && 'text-primary'
                    )}
                    variant="ghost"
                    size="sm"
                >
                    <GearIcon className="inline mr-2" /> My Settings
                </Button>
                <Button
                    onClick={() => setPage('branch-settings')}
                    className={cn(
                        'text-muted-foreground w-full justify-start',
                        page === 'branch-settings' && 'text-primary'
                    )}
                    variant="ghost"
                    size="sm"
                >
                    <BuildingGearIcon className="inline mr-2" /> Branch Settings
                </Button>
            </div>
            {page === 'appearance' && <AppearanceSettings />}
            {page === 'my-settings' &&
                ['employee', 'admin', 'owner'].includes(user_type) && (
                    <UserOrganizationSettings />
                )}
            {page === 'branch-settings' &&
                ['employee', 'admin', 'owner'].includes(user_type) && (
                    <BranchSettings />
                )}
        </PageContainer>
    )
}
