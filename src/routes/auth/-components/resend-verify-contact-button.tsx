import { cn } from '@/helpers/tw-utils'
import { useSendOTPVerification } from '@/modules/authentication'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import UseCooldown from '@/hooks/use-cooldown'

interface Props {
    verifyMode: 'email' | 'mobile'
    duration: number
    interval: number
}

const ResendVerifyContactButton = ({
    verifyMode,
    duration,
    interval,
}: Props) => {
    const { cooldownCount, startCooldown } = UseCooldown({
        cooldownDuration: duration,
        counterInterval: interval,
    })

    const { mutate: resendOtpVerification, isPending: isResending } =
        useSendOTPVerification({
            verifyMode,
            options: {
                onSuccess: () => {
                    startCooldown()
                },
            },
        })

    return (
        <Button
            className={cn('underline', cooldownCount > 0 && 'no-underline')}
            disabled={isResending || cooldownCount > 0}
            onClick={(e) => {
                e.preventDefault()
                resendOtpVerification()
            }}
            size="sm"
            variant="ghost"
        >
            {isResending && <LoadingSpinner />}
            {!isResending && cooldownCount <= 0 && 'Resend Code'}
            {cooldownCount > 0 && `Resend again in ${cooldownCount}s`}
        </Button>
    )
}

export default ResendVerifyContactButton
