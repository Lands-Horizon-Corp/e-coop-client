import { cn } from '@/helpers/tw-utils'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { useSendOTPVerification } from '@/hooks/api-hooks/use-auth'
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
            onSuccess: () => {
                startCooldown()
            },
        })

    return (
        <Button
            size="sm"
            variant="ghost"
            className={cn('underline', cooldownCount > 0 && 'no-underline')}
            onClick={(e) => {
                e.preventDefault()
                resendOtpVerification()
            }}
            disabled={isResending || cooldownCount > 0}
        >
            {isResending && <LoadingSpinner />}
            {!isResending && cooldownCount <= 0 && 'Resend Code'}
            {cooldownCount > 0 && `Resend again in ${cooldownCount}s`}
        </Button>
    )
}

export default ResendVerifyContactButton
