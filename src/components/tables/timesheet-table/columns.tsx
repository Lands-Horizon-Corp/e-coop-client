import { ReactNode } from 'react'

import { cn } from '@/lib'
import { useImagePreview } from '@/store/image-preview-store'
import { ITimesheet } from '@/types/coop-types/timesheet'
import { toReadableDateTime } from '@/utils'
import { ColumnDef, Row } from '@tanstack/react-table'

import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { IGlobalSearchTargets } from '@/components/data-table/data-table-filters/data-table-global-search'
import DateFilter from '@/components/data-table/data-table-filters/date-filter'
import TextFilter from '@/components/data-table/data-table-filters/text-filter'
import HeaderToggleSelect from '@/components/data-table/data-table-row-actions/header-toggle-select'
import ImageNameDisplay from '@/components/elements/image-name-display'
import { ClockIcon, PlayIcon, PushPinSlashIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { getTimeDifference } from '@/components/worktimer/utils'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IMedia } from '@/types'

export const timesheetGlobalSearchTargets: IGlobalSearchTargets<ITimesheet>[] =
    [
        { field: 'user.user_name', displayText: 'User' },
        { field: 'time_in', displayText: 'Time In' },
        { field: 'time_out', displayText: 'Time Out' },
    ]

export interface ITimesheetTableActionComponentProp {
    row: Row<ITimesheet>
}

export interface ITimesheetTableColumnProps {
    hideSelect?: boolean
    actionComponent?: (props: ITimesheetTableActionComponentProp) => ReactNode
}

const TimesheetTableColumns = (
    opts?: ITimesheetTableColumnProps
): ColumnDef<ITimesheet>[] => {
    const columns: ColumnDef<ITimesheet>[] = [
        {
            id: 'user.user_name',
            accessorKey: 'user.user_name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="User">
                    <ColumnActions {...props}>
                        <TextFilter<ITimesheet>
                            displayText="User"
                            field="user.user_name"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { user },
                },
            }) => (
                <>
                    <ImageNameDisplay
                        src={user?.media?.download_url}
                        name={user?.full_name ?? user?.user_name}
                    />
                </>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 160,
            minSize: 120,
        },
        {
            id: 'time_in',
            accessorKey: 'time_in',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Time In">
                    <ColumnActions {...props}>
                        <DateFilter<ITimesheet>
                            displayText="Time In"
                            field="time_in"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) => (
                <span className="text-sm">
                    {toReadableDateTime(row.original.time_in)}
                </span>
            ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 120,
        },
        {
            id: 'time_out',
            accessorKey: 'time_out',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Time Out">
                    <ColumnActions {...props}>
                        <DateFilter<ITimesheet>
                            displayText="Time Out"
                            field="time_out"
                        />
                    </ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({ row }) =>
                row.original.time_out ? (
                    <span className="text-sm">
                        {toReadableDateTime(row.original.time_out)}
                    </span>
                ) : (
                    <span className="italic text-muted-foreground">-</span>
                ),
            enableMultiSort: true,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 120,
        },
        {
            id: 'photos',
            accessorKey: 'photos',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Photos" />
            ),
            cell: ({
                row: {
                    original: { media_in, media_out },
                },
            }) => <TimeInOutPhotos mediaIn={media_in} mediaOut={media_out} />,
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 120,
        },
        {
            id: 'infos',
            header: (props) => <DataTableColumnHeader {...props} title="" />,
            cell: ({
                row: {
                    original: { time_in, time_out },
                },
            }) => {
                const { hours, minutes, seconds } = getTimeDifference(
                    time_in,
                    time_out ?? new Date()
                )

                return (
                    <DurationBadge
                        hours={hours}
                        minutes={minutes}
                        seconds={seconds}
                        isOngoing={!time_out}
                    />
                )
            },
            enableResizing: true,
            enableHiding: false,
            size: 180,
            minSize: 120,
        },
    ]

    if (!opts?.hideSelect) {
        columns.unshift({
            id: 'select',
            header: ({ table, column }) => (
                <div className={'flex w-fit items-center gap-x-1 px-2'}>
                    <HeaderToggleSelect table={table} />
                    {!column.getIsPinned() && (
                        <PushPinSlashIcon
                            onClick={() => column.pin('left')}
                            className="mr-2 size-3.5 cursor-pointer"
                        />
                    )}
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex w-fit items-center gap-x-1 px-0">
                    {opts?.actionComponent?.({ row })}
                    <Checkbox
                        aria-label="Select row"
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                    />
                </div>
            ),
            enableSorting: false,
            enableResizing: false,
            enableHiding: false,
            size: 80,
            minSize: 80,
        })
    }

    return columns
}

const TimeInOutPhotos = ({
    mediaIn,
    mediaOut,
}: {
    mediaIn?: IMedia
    mediaOut?: IMedia
}) => {
    const { onOpen } = useImagePreview()

    return (
        <div className="flex items-center gap-x-4">
            <button
                onClick={() => {
                    if (!mediaIn) return

                    onOpen({
                        Images: [mediaIn],
                    })
                }}
            >
                <PreviewMediaWrapper media={mediaIn}>
                    <ImageDisplay
                        src={mediaIn?.download_url}
                        className="size-8 rounded-sm"
                    />
                </PreviewMediaWrapper>
            </button>
            <button
                onClick={() => {
                    if (!mediaOut) return

                    onOpen({
                        Images: [mediaOut],
                    })
                }}
            >
                <PreviewMediaWrapper media={mediaOut}>
                    <ImageDisplay
                        src={mediaOut?.download_url}
                        className="size-8 rounded-sm"
                    />
                </PreviewMediaWrapper>
            </button>
        </div>
    )
}

interface DurationBadgeProps {
    hours: number
    minutes: number
    seconds: number
    isOngoing?: boolean
    variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline'
    className?: string
}

const DurationBadge = ({
    hours,
    minutes,
    seconds,
    isOngoing = false,
    variant = 'default',
    className,
}: DurationBadgeProps) => {
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    return (
        <Badge
            variant={isOngoing ? 'outline' : variant}
            className={cn(
                'flex h-6 w-fit items-center gap-1 px-2 py-0.5 font-mono text-xs',
                isOngoing &&
                    'border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-100 dark:border-amber-800/50 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/40',
                !isOngoing &&
                    variant === 'default' &&
                    'border-green-200 bg-green-100 text-green-800 hover:bg-green-100 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40',
                className
            )}
        >
            {isOngoing ? (
                <>
                    <PlayIcon className="h-3 w-3" />
                    <span>Ongoing</span>
                </>
            ) : (
                <>
                    <ClockIcon className="h-3 w-3" />
                    <span>{formattedTime}</span>
                </>
            )}
        </Badge>
    )
}

export default TimesheetTableColumns
