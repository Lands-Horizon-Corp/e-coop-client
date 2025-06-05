import { IoMdArrowBack } from 'react-icons/io'
import { ErrorComponentProps, useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { BracketErrorIcon } from '@/components/icons'
import { FlickeringGrid } from '../backgrounds/flickering-grid'

import { cn } from '@/lib'

import { IBaseProps } from '@/types'

interface Props extends IBaseProps, ErrorComponentProps {}

const ErrorPage = ({ className, error }: Props) => {
    const router = useRouter()

    return (
        <div
            className={cn(
                'relative flex min-h-screen w-full flex-col items-center justify-center gap-y-4 p-4',
                className
            )}
        >
            <FlickeringGrid
                gridGap={1}
                squareSize={60}
                color="#02BEAA"
                maxOpacity={0.5}
                flickerChance={0.05}
                className="absolute inset-0 z-0 opacity-60 [mask-image:radial-gradient(80vh_circle_at_center,white,transparent)] dark:opacity-20"
            />
            <div className="z-10 flex h-full w-full flex-col items-center justify-center gap-y-4">
                <BracketErrorIcon className="size-24 text-muted-foreground" />
                <p className="text-foreground">Something went wrong</p>
                <p className="text-muted-foreground">
                    {error instanceof String ? error : error.message}
                </p>
                <Button
                    variant="secondary"
                    hoverVariant="primary"
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
