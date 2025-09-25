import { cn } from '@/helpers/tw-utils'
import { useLiveMonitoringStore } from '@/store/live-monitoring-store'

import { PlayIcon, StopIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { IClassProps } from '@/types'

interface LiveToggleProps extends IClassProps {
    size?: 'sm' | 'default' | 'lg'
}

const LiveToggle = ({ className, size = 'sm' }: LiveToggleProps) => {
    const { isLiveEnabled, toggleLive } = useLiveMonitoringStore()

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={isLiveEnabled ? 'default' : 'secondary'}
                        size={size}
                        className={cn(
                            'rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
                            isLiveEnabled
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                            className
                        )}
                        onClick={toggleLive}
                    >
                        {isLiveEnabled ? (
                            <StopIcon className="h-4 w-4 mr-1 transition-all duration-200" />
                        ) : (
                            <PlayIcon className="h-4 w-4 mr-1 transition-all duration-200" />
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
