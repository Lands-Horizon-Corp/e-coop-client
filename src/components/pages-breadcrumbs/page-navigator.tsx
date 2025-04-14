import { useRouter } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import ActionTooltip from '@/components/action-tooltip'
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'

const PageNavigator = () => {
    const router = useRouter()

    return (
        <div className="flex items-center justify-center gap-x-0.5 rounded-full bg-popover p-1">
            <ActionTooltip tooltipContent="Previous">
                <Button
                    onClick={() => router.history.back()}
                    className="size-fit rounded-full p-1"
                    variant="ghost"
                >
                    <ChevronLeftIcon className="size-3" />
                </Button>
            </ActionTooltip>
            <ActionTooltip tooltipContent="Forward">
                <Button
                    onClick={() => router.history.forward()}
                    className="size-fit rounded-full p-1"
                    variant="ghost"
                >
                    <ChevronRightIcon className="size-3" />
                </Button>
            </ActionTooltip>
        </div>
    )
}

export default PageNavigator
