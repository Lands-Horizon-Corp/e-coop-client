import { createFileRoute } from '@tanstack/react-router'

import { useAuthUser } from '@/modules/authentication/authgentication.store'
import { IUserBase } from '@/modules/user'
import AccountQr from '@/modules/user-profile/components/account-qr'

import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute('/account-profile/qr')({
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
        <div className="space-y-4 max-w-4xl bg-secondary/50 rounded-3xl mx-auto p-4 ">
            <p className="text-xl">Your QR Code</p>
            <p className="!mt-1 text-sm text-muted-foreground">
                You can download and use these QR Codes. Coop can quickly scan
                and identify your account by scanning these code we provided.
            </p>
            <div className="flex items-center gap-4">
                <div className="space-y-1 text-center bg-accent/10 hover:bg-accent/30 ease-in-out duration-300 text-accent-foreground p-4 rounded-2xl">
                    <AccountQr
                        accountQrPayload={JSON.stringify(user.qr_code)}
                        className="!h-64 !w-64"
                    />
                    <p>Account QR</p>
                </div>
            </div>
        </div>
    )
}
