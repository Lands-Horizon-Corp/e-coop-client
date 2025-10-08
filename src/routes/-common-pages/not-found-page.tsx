import { NotFoundRouteProps, useRouter } from '@tanstack/react-router'

import { cn } from '@/helpers/tw-utils'

import { FlickeringGrid } from '@/components/backgrounds/flickering-grid'
import { ArrowLeftIcon, SignPostIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import { IBaseProps } from '@/types'

interface Props extends IBaseProps, NotFoundRouteProps {}

const NotFoundPage = ({ className }: Props) => {
    const router = useRouter()

    return (
        <div
            className={cn(
                'relative flex min-h-screen w-full flex-col items-center justify-center gap-y-4 p-4',
                className
            )}
        >
            <FlickeringGrid
                className="absolute inset-0 z-0 opacity-60 [mask-image:radial-gradient(80vh_circle_at_center,white,transparent)] dark:opacity-20"
                flickerChance={0.05}
                gridGap={1}
                maxOpacity={0.5}
                squareSize={60}
            />
            <div className="z-10 flex h-full w-full flex-col items-center justify-center gap-y-4">
                <SignPostIcon className="size-24 text-muted-foreground" />
                <p className="text-foreground/70">
                    Sorry, the page doesn't exist
                </p>
                <Button
                    className="gap-x-2 rounded-full"
                    hoverVariant="primary"
                    onClick={() => router.history.back()}
                    variant="secondary"
                >
                    <ArrowLeftIcon />
                    Go Back
                </Button>
            </div>
        </div>
    )
}

export default NotFoundPage
