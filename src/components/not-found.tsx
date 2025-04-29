import { useRouter } from '@tanstack/react-router'

import { HiXMark } from 'react-icons/hi2'
import { IoMdArrowBack } from 'react-icons/io'

import { Button } from '@/components/ui/button'

const NotFoundPage = () => {
    const router = useRouter()

    return (
        <div className="flex min-h-screen w-full p-4">
            <div className="flex flex-1 flex-col items-center justify-center gap-8 gap-y-4 rounded-xl bg-background sm:flex-row">
                <HiXMark className="size-24" />
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold">Oops!</h1>
                    <p className="text-foreground/70">
                        Sorry, the page doesn't exist
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
        </div>
    )
}

export default NotFoundPage
