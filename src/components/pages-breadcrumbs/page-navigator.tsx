import { useRouter } from '@tanstack/react-router'

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import ActionTooltip from '../tooltips/action-tooltip'

const PageNavigator = () => {
    const router = useRouter()

    return (
        <div className="flex items-center justify-center gap-x-0.5 rounded-full bg-popover p-1">
            <ActionTooltip tooltipContent="Previous">
                <Button
                    className="size-fit rounded-full p-1"
                    onClick={() => router.history.back()}
                    size="icon"
                    variant="ghost"
                >
                    <ChevronLeftIcon className="size-3" />
                </Button>
            </ActionTooltip>
            <ActionTooltip tooltipContent="Forward">
                <Button
                    className="size-fit rounded-full p-1"
                    onClick={() => router.history.forward()}
                    size="icon"
                    variant="ghost"
                >
                    <ChevronRightIcon className="size-3" />
                </Button>
            </ActionTooltip>
        </div>
    )
}

export default PageNavigator
