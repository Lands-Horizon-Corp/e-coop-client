import { useRouter } from '@tanstack/react-router'

import { IoMdArrowBack } from 'react-icons/io'
import { HiXMark } from 'react-icons/hi2'

import { Button } from '@/components/ui/button'

const ErrorPage = () => {
    const router = useRouter()

    return (
        <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-8 gap-y-4 sm:flex-row">
            <HiXMark className="size-24" />
            <div className="space-y-4">
                <h1 className="text-4xl font-bold">Oops!</h1>
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
                    <IoMdArrowBack />
                    Go Back
                </Button>
            </div>
        </div>
    )
}

export default ErrorPage
