import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { TAccountType } from '@/types'
import UseCooldown from '@/hooks/use-cooldown'
import { useForgotPassword } from '@/hooks/api-hooks/use-auth'

type TSentTo = { key: string; accountType: TAccountType }

interface Props {
    duration: number
    interval: number
    onSuccess?: () => void
    onErrorMessage: (errorMessage: string) => void
    sentTo: TSentTo
}

const ResendPasswordResetLinkButton = ({
    sentTo,
    duration,
    interval,
    onSuccess,
    onErrorMessage,
}: Props) => {
    const { cooldownCount, startCooldown } = UseCooldown({
        cooldownDuration: duration,
        counterInterval: interval,
    })

    const { mutate: resendResetLink, isPending } = useForgotPassword({
        onSuccess: () => {
            startCooldown()
            onSuccess?.()
        },
        onError: onErrorMessage,
    })

    return (
        <Button
            disabled={isPending || cooldownCount > 0}
            variant={cooldownCount || isPending ? 'secondary' : 'default'}
            onClick={() => resendResetLink(sentTo)}
        >
            {isPending && <LoadingSpinner />}
            {!isPending && cooldownCount <= 0 && 'Resend'}
            {cooldownCount > 0 && `Resend again in ${cooldownCount}s`}
        </Button>
    )
}

export default ResendPasswordResetLinkButton
