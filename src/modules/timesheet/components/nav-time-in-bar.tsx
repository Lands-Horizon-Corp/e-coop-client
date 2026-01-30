import { cn } from '@/helpers/tw-utils'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import { useCurrentTimesheet } from '@/modules/timesheet'
import WorkTimer from '@/modules/timesheet/components/worktimer'

import { ClockIcon, DotBigIcon } from '@/components/icons'
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
                        className={cn(
                            'group relative border gap-x-2 rounded-lg'
                        )}
                        disabled={
                            (isLoading && !timesheet) ||
                            !hasPermissionFromAuth({
                                action: ['Create', 'Read', 'Update'],
                                resourceType: 'TimeInOut',
                            })
                        }
                        hoverVariant="primary"
                        size="icon-sm"
                        variant="outline-ghost"
                    >
                        {!!timesheet && (
                            <div className="absolute -right-1.5 -top-1.5">
                                <DotBigIcon className="absolute blur-sm" />
                                <DotBigIcon className="text-primary text-primar" />
                            </div>
                        )}
                        {isLoading && !timesheet ? (
                            <LoadingSpinner className="size-4" />
                        ) : (
                            <ClockIcon />
                        )}
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
