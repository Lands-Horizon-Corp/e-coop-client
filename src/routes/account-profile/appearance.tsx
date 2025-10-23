import { createFileRoute } from '@tanstack/react-router'

import { useAuthUser } from '@/modules/authentication/authgentication.store'
import AppearanceSettings from '@/modules/settings/components/appearance-settings'
import { IUserBase } from '@/modules/user'

import PageContainer from '@/components/containers/page-container'

import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute('/account-profile/appearance')({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        currentAuth: { user },
        updateCurrentAuth,
    } = useAuthUser()

    useSubscribe<IUserBase>(`user.update.${user.id}`, (newUserData) => {
        updateCurrentAuth({ user: newUserData })
    })

    return (
        <PageContainer className="max-w-4xl bg-secondary/40 text-secondary-foreground rounded-3xl mx-auto p-4">
            <AppearanceSettings />
        </PageContainer>
    )
}
