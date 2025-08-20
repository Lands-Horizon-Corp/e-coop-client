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
        <div className="space-y-4">
            <p className="text-xl">Your QR Code</p>
            <p className="!mt-1 text-sm text-muted-foreground">
                You can download and use these QR Codes
            </p>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-center">
                    <AccountQr
                        className="!h-64 !w-64"
                        accountQrPayload={JSON.stringify(user.qr_code)}
                    />
                    <p>Account QR</p>
                </div>
            </div>
        </div>
    )
}
