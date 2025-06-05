import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import WorkTimer from '@/components/worktimer'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { BriefCaseClockIcon, DotBigIcon } from '@/components/icons'

import { cn } from '@/lib/utils'
import { useCurrentTimesheet } from '@/hooks/use-timesheet'

const NavTimeInBar = () => {
    const { data: timesheet, isPending: isLoading } = useCurrentTimesheet({
        initialData: {
            id: '11111111-1111-1111-1111-111111111111',
            user_id: '22222222-2222-2222-2222-222222222222',
            user: {
                id: '22222222-2222-2222-2222-222222222222',
                user_name: 'Jake',
                first_name: 'Mock',
                last_name: 'User',
                email: 'mockuser@example.com',
                media: {
                    download_url:
                        'https://w0.peakpx.com/wallpaper/446/783/HD-wallpaper-jake-the-dog-adventure-time-cartoon.jpg',
                },
            },
            media_in_id: '33333333-3333-3333-3333-333333333333',
            media_in: {
                id: '33333333-3333-3333-3333-333333333333',
                download_url: '/mock-in.jpg',
                file_name: 'mock-in.jpg',
                size: 123456,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            media_out_id: '44444444-4444-4444-4444-444444444444',
            media_out: {
                id: '44444444-4444-4444-4444-444444444444',
                download_url: '/mock-out.jpg',
                file_name: 'mock-out.jpg',
                size: 123456,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            time_in: '2025-06-04T07:38:06.198Z',
            time_out: undefined,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        } as unknown as any,
    })

    // const quote = useMemo(() => {
    //     return !timesheet ? randomStartOfDayQuoute() : randomEndOfDayQuoute()
    // }, [timesheet])

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
                        {timesheet && (
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
