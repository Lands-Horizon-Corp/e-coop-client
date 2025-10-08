import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import UseCooldown from '@/hooks/use-cooldown'

import { useForgotPassword } from '../../authentication.service'

type TSentTo = { key: string }

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
        options: {
            onSuccess: () => {
                startCooldown()
                onSuccess?.()
            },
            onError: (error) => {
                const errorMessage = serverRequestErrExtractor({
                    error,
                }) as string
                onErrorMessage(errorMessage)
            },
        },
    })

    return (
        <Button
            disabled={isPending || cooldownCount > 0}
            onClick={() => resendResetLink(sentTo)}
            variant={cooldownCount || isPending ? 'secondary' : 'default'}
        >
            {isPending && <LoadingSpinner />}
            {!isPending && cooldownCount <= 0 && 'Resend'}
            {cooldownCount > 0 && `Resend again in ${cooldownCount}s`}
        </Button>
    )
}

export default ResendPasswordResetLinkButton
