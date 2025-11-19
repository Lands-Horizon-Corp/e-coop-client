import { cn } from '@/helpers/tw-utils'
import { useLiveMonitoringStore } from '@/store/live-monitoring-store'

import { DotBigIcon, PlayIcon, StopIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { IClassProps } from '@/types'

interface LiveToggleProps extends IClassProps {
    size?: 'sm' | 'default' | 'lg' | 'xs'
}

const LiveToggle = ({ className, size = 'sm' }: LiveToggleProps) => {
    const { isLiveEnabled, toggleLive } = useLiveMonitoringStore()

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        className={cn(
                            'rounded-lg transition-all relative border duration-300 hover:scale-105',
                            className
                        )}
                        hoverVariant="primary"
                        onClick={toggleLive}
                        size={size}
                        variant="outline-ghost"
                    >
                        {isLiveEnabled && (
                            <div className="absolute -right-1.5 -top-1.5">
                                <DotBigIcon className="absolute blur-sm" />
                                <DotBigIcon className="text-primary text-primar" />
                            </div>
                        )}
                        {isLiveEnabled ? (
                            <StopIcon className="size-4 transition-all duration-200" />
                        ) : (
                            <PlayIcon className="size-4 transition-all duration-200" />
                        )}
                        {isLiveEnabled ? 'Stop Live' : 'Live'}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        {isLiveEnabled
                            ? 'Stop monitoring - tables will no longer update in realtime'
                            : 'Start monitoring - all tables will be updated in realtime'}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default LiveToggle
