import { BriefCaseClockIcon, DotBigIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import WorkTimer from '@/components/worktimer'

import { cn } from '@/lib/utils'

import { useCurrentTimesheet } from '@/hooks/api-hooks/use-timesheet'

const NavTimeInBar = () => {
    const { data: timesheet, isPending: isLoading } = useCurrentTimesheet()

    return (
        <>
            <Popover modal>
                <PopoverTrigger asChild>
                    <Button
                        size="sm"
                        variant="secondary"
                        disabled={isLoading && !timesheet}
                        hoverVariant="primary"
                        className={cn(
                            'group relative gap-x-2 rounded-full text-foreground/70'
                        )}
                    >
                        {!!timesheet && (
                            <div className="absolute -right-1 -top-1">
                                <DotBigIcon className="absolute mr-2 text-primary blur-sm" />
                                <DotBigIcon className="mr-2 text-primary" />
                            </div>
                        )}
                        {isLoading && !timesheet ? (
                            <LoadingSpinner className="size-4" />
                        ) : (
                            <BriefCaseClockIcon />
                        )}
                        Work Time
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    align="end"
                    className="h-fit w-fit border-none bg-transparent p-0 shadow-none"
                >
                    <WorkTimer />
                </PopoverContent>
            </Popover>
        </>
    )
}

export default NavTimeInBar
