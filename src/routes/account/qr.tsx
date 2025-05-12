import { createFileRoute } from '@tanstack/react-router'

import AccountQr from '@/components/account-settings/account-qr'

import { useAuthUser } from '@/store/user-auth-store'

export const Route = createFileRoute('/account/qr')({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        currentAuth: { user },
    } = useAuthUser()

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
                        accountQrPayload={user.qr_code.data}
                    />
                    <p>Account QR</p>
                </div>
            </div>
        </div>
    )
}
