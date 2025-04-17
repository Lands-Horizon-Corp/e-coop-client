import { ErrorComponentProps, useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, ReloadIcon } from '@/components/icons'
import { allErrorMessageExtractor } from '@/helpers'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { useEffect } from 'react'

const ErrorPage = ({ error }: ErrorComponentProps) => {
    const router = useRouter()

    const errorMessage = allErrorMessageExtractor({ error })

    const queryErrorResetBoundary = useQueryErrorResetBoundary()

    useEffect(() => {
        queryErrorResetBoundary.reset()
    }, [queryErrorResetBoundary])

    return (
        <div className="flex h-[80dvh] w-full flex-col items-center justify-center gap-y-4 p-4">
            <h1 className="text-4xl font-medium">Oops!</h1>
            <p className="text-foreground/70">{errorMessage}</p>
            <div className="flex items-center justify-center gap-x-2">
                <Button
                    variant="secondary"
                    className="gap-x-2 rounded-full"
                    onClick={() => router.history.back()}
                >
                    <ArrowLeftIcon />
                    Go Back
                </Button>
                <Button
                    variant="secondary"
                    className="gap-x-2 rounded-full"
                    onClick={() => router.invalidate()}
                >
                    <ReloadIcon />
                    Retry
                </Button>
            </div>
        </div>
    )
}

export default ErrorPage
