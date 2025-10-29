import { cn } from '@/helpers/tw-utils'
import { useCurrentTimesheet } from '@/modules/timesheet'
import WorkTimer from '@/modules/timesheet/components/worktimer'

import { BriefCaseClockIcon, DotBigIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

const NavTimeInBar = () => {
    const { data: timesheet, isPending: isLoading } = useCurrentTimesheet()

    return (
        <>
            <Popover modal>
                <PopoverTrigger asChild>
                    <Button
                        className={cn('group relative gap-x-2 rounded-full')}
                        disabled={isLoading && !timesheet}
                        hoverVariant="primary"
                        size="sm"
                        variant="secondary"
                    >
                        {!!timesheet && (
                            <div className="absolute -right-1 -top-1">
                                <DotBigIcon className="absolute mr-2 blur-sm" />
                                <DotBigIcon className="mr-2 text-primary text-primar" />
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
