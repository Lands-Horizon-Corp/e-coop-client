import { useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

import { BsRocketTakeoffIcon, XIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

const ErrorPage = () => {
    const router = useRouter()

    return (
        <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-8 gap-y-4 sm:flex-row">
            <XIcon className="size-24" />
            <div className="space-y-4">
                <div className="flex items-center gap-x-5">
                    <h1 className="text-4xl font-bold">Oops!</h1>
                    <BsRocketTakeoffIcon size={28} />
                </div>
                <p className="text-foreground/70">
                    Sorry, an unexpected error has occurred.
                </p>
                <p className="font-medium">
                    <i>{}</i>
                </p>
                <Button
                    className="gap-x-2 rounded-full"
                    onClick={() => router.history.back()}
                >
                    <ArrowLeftIcon />
                    Go Back
                </Button>
            </div>
        </div>
    )
}

export default ErrorPage
