import { ErrorComponentProps, useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from '@/components/icons'
import { allErrorMessageExtractor } from '@/helpers'

const ErrorPage = ({ error }: ErrorComponentProps) => {
    const router = useRouter()

    const errorMessage = allErrorMessageExtractor({ error })

    return (
        <div className="flex h-[80dvh] w-full flex-col items-center justify-center gap-y-4 p-4">
            <h1 className="text-4xl font-medium">Oops!</h1>
            <p className="text-foreground/70">{errorMessage}</p>
            <Button
                variant="secondary"
                className="gap-x-2 rounded-full"
                onClick={() => router.history.back()}
            >
                <ArrowLeftIcon />
                Go Back
            </Button>
        </div>
    )
}

export default ErrorPage
