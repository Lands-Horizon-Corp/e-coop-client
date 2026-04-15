import { useCallback, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import {
    dateAgo,
    toReadableDate,
    toReadableDateTime,
} from '@/helpers/date-utils'
import { IMedia, downloadMedia, formatBytes } from '@/modules/media'
import MediaResourceFileIcon from '@/modules/media/components/media-resource-file-icon'
import { DownloadIcon, StarIcon, TrashIcon } from 'lucide-react'

import {
    DotsVerticalIcon,
    EyeIcon,
    FileQuestionIcon,
    PencilFillIcon,
    ReportsIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import UseCooldown from '@/hooks/use-cooldown'
import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import {
    useDeleteGeneratedReportById,
    useDownloadReportByReportId,
    useGenerateReportMarkAsFavorite,
} from '../../generated-report.service'
import {
    IGeneratedReport,
    TGeneratedReportStatus,
} from '../../generated-report.types'
import {
    DELAY_DOWNLOAD_TIME_DURATION,
    DELAY_DOWNLOAD_TIME_INTERVAL,
} from '../../generated-reports.constants'
// import GeneratedCreateReportFormModal from '../forms/generate-report-create-update-modal'
import { ReportViewerModal } from '../generated-report-view/generated-report-view'
import GeneratedReportStatusBadge from './generated-report-status'

type TGeneratedReportCardProps = {
    report: IGeneratedReport
    isFavorite: boolean
    refetch: () => void
}

export const GeneratedReportCard = ({
    report: focusedReport,
    isFavorite,
    refetch,
}: TGeneratedReportCardProps) => {
    const invalidate = useQueryClient()
    const openUpdateReport = useModalState()
    const [mediaProgess, setMediaProgress] = useState(0)
    const [report, setReport] = useState(focusedReport)

    const { mutate: markAsFavoriteMutation } = useGenerateReportMarkAsFavorite({
        options: {
            onSuccess: (report) => {
                toast.success(`mark ${report.name} as favorite.`)
                invalidate.invalidateQueries({
                    queryKey: ['generated-report-paginated', report.model],
                })
                refetch()
            },
        },
    })

    const { cooldownCount, startCooldown } = UseCooldown({
        cooldownDuration: DELAY_DOWNLOAD_TIME_DURATION,
        counterInterval: DELAY_DOWNLOAD_TIME_INTERVAL,
    })

    const { mutate: downloadReport, isPending } = useDownloadReportByReportId({
        options: {
            onSuccess: (media) => {
                if (media && media.download_url) {
                    downloadMedia(media)
                    toast.success('Download initiated.')
                    startCooldown()
                } else {
                    toast.success('Report generation started.')
                }
            },
            onError: (error) => {
                toast.error(`${error?.message}`)
            },
        },
    })

    const { mutate: deleteReport } = useDeleteGeneratedReportById({
        options: {
            onSuccess: () => {
                toast.success(`Report deleted successfully.`)
                invalidate.invalidateQueries({
                    queryKey: ['generated-report-paginated', report.model],
                })
                refetch()
            },
            onError: (error) => {
                toast.error(`Error deleting report: ${error?.message}`)
            },
        },
    })

    const handleDownloadClick = useCallback(() => {
        downloadReport(report.id)
    }, [downloadReport, report.id])

    useSubscribe<IMedia>('media', `update.${report.media_id}`, (media) => {
        if (media.progress) {
            setMediaProgress(media.progress)
        }
    })

    const isDownloading = isPending || (mediaProgess > 0 && mediaProgess < 100)

    const downloadUsersLength = report.download_users?.length ?? 0
    const downloadUsers = report?.download_users ?? []

    const isExcel = report.generated_report_type === 'excel'
    const isPdf = report.generated_report_type === 'pdf'

    const hasNoMedia = report.media_id === null || !report.media

    return (
        <div
            className={cn(
                'relative group items-center bg-secondary/80 justify-between border border-muted-foreground/30 gap-2 p-3 pt-4 mt-1 rounded-lg shadow-sm',
                isExcel &&
                    'border-l-green-500 bg-gradient-to-tl dark:from-green-500/20 to-background',
                isPdf &&
                    'border-red-500 bg-gradient-to-tl dark:from-red-500/20 to-background',
                report.status === 'failed' &&
                    'bg-gradient-to-tl border-destructive/40 border from-50% dark:popover/80 to-destructive/20'
            )}
        >
            {/* <GeneratedCreateReportFormModal
                description="Update your generated report."
                formProps={{
                    disabledFields: ['url'],
                    reportId: report.id,
                    defaultValues: {
                        ...report,
                        generated_report_type: 'excel',
                        filter_search: '',
                    },
                    onSuccess: (report) => {
                        invalidate.invalidateQueries({
                            queryKey: [
                                'generated-report-paginated',
                                report.model,
                            ],
                        })
                        refetch()
                    },
                }}
                title="Update Generated Report"
                {...openUpdateReport}
            /> */}
            <div className={cn('flex items-start gap-1 min-w-0 w-full')}>
                {!report.media ? (
                    <div className="relative">
                        <FileQuestionIcon className="size-8 text-muted-foreground" />
                    </div>
                ) : (
                    <div className="relative">
                        <MediaResourceFileIcon
                            iconClassName="size-8"
                            media={report.media}
                        />
                    </div>
                )}
                <div className="min-w-0 grow">
                    <div className="min-w-0 flex justify-between w-full">
                        <div className="font-medium text-sm items-center truncate">
                            <span>{report.name}</span>
                            <Tooltip>
                                <TooltipTrigger>
                                    <StarIcon
                                        className={cn(
                                            'inline-block -translate-y-1 ml-2 size-4 text-primary',
                                            report.is_favorite
                                                ? ''
                                                : 'opacity-20'
                                        )}
                                        onClick={() => {
                                            markAsFavoriteMutation(report.id)
                                        }}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    {isFavorite
                                        ? 'Marked as Favorite'
                                        : 'Mark as Favorite'}
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div
                            className={cn(
                                'flex items-center group-hover:opacity-100 duration-300 opacity-0 flex-col'
                            )}
                        >
                            <div className="flex space-x-1">
                                <ReportViewerModal
                                    reportViewerProps={{
                                        reportId: report.id,
                                        defaultReport: report,
                                    }}
                                    trigger={
                                        <Button
                                            className="cursor-pointer"
                                            size="icon-sm"
                                            variant="outline"
                                        >
                                            <EyeIcon />
                                        </Button>
                                    }
                                />
                                <Button
                                    className="relative text-xs overflow-hidden cursor-pointer justify-center"
                                    disabled={
                                        isDownloading ||
                                        isPending ||
                                        report?.status === 'failed' ||
                                        cooldownCount > 0
                                    }
                                    onClick={handleDownloadClick}
                                    size="icon-sm"
                                    title={
                                        isDownloading
                                            ? `Processing: ${mediaProgess}%`
                                            : ''
                                    }
                                    variant={
                                        cooldownCount > 0 ? 'ghost' : 'outline'
                                    }
                                >
                                    {cooldownCount > 0 ? (
                                        `${cooldownCount}s`
                                    ) : (
                                        <>
                                            <DownloadIcon
                                                className={cn(
                                                    '',
                                                    isDownloading &&
                                                        'animate-bounce'
                                                )}
                                            />
                                        </>
                                    )}
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            className="cursor-pointer"
                                            size="icon-sm"
                                            variant="outline"
                                        >
                                            <DotsVerticalIcon className=" size-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        {!isFavorite && (
                                            <DropdownMenuItem
                                                disabled={hasNoMedia}
                                                onClick={() => {
                                                    markAsFavoriteMutation(
                                                        report.id
                                                    )
                                                }}
                                            >
                                                <StarIcon className="mr-2 size-4" />
                                                Mark as Favorite
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                            onClick={() => {
                                                openUpdateReport.onOpenChange(
                                                    true
                                                )
                                            }}
                                        >
                                            <PencilFillIcon className="mr-2 size-4" />
                                            Edit
                                        </DropdownMenuItem>
                                        {hasNoMedia && (
                                            <DropdownMenuItem
                                                className="bg-destructive focus:bg-destructive/80 hover:bg-destructive/80 focus:text-primary"
                                                onClick={() => {
                                                    deleteReport(report.id)
                                                }}
                                            >
                                                <TrashIcon className="mr-2 size-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground flex flex-col truncate">
                            <p className="">
                                {report.media?.file_size && (
                                    <>
                                        {formatBytes(report.media?.file_size)}{' '}
                                        ·{' '}
                                    </>
                                )}
                                {toReadableDate(report.created_at)} ·{' '}
                                {dateAgo(report.created_at)}
                            </p>
                            <span>By {report.created_by?.full_name}</span>
                        </div>
                        <GeneratedReportStatusBadge
                            size={'sm'}
                            status={report.status}
                        />
                    </div>
                    {report.expiration_days && (
                        <p className={`text-xs mt-1 text-muted-foreground`}>
                            {report.expiration_days} Day before expires
                        </p>
                    )}
                    {report.model && (
                        <Badge
                            className="font-normal py-[.5px]"
                            variant={'outline'}
                        >
                            <ReportsIcon className="mr-1" />
                            {report.model}
                        </Badge>
                    )}
                </div>
            </div>
            <div className="flex justify-end px-4 pt-1">
                <div
                    className={cn(
                        'flex text-xs w-fit justify-end -space-x-2 bottom-2.5 right-4.5'
                    )}
                >
                    {downloadUsers.map((item, index) => {
                        const src = item.user?.media?.download_url
                        if (index > 5) return null
                        return (
                            <Tooltip
                                delayDuration={400}
                                key={item.user.id ?? index}
                            >
                                <TooltipTrigger>
                                    <ImageDisplay
                                        className={`size-4 hover:scale-105 border rounded-full relative`}
                                        fallback={
                                            item.user?.full_name?.charAt(0) ??
                                            undefined
                                        }
                                        key={item.id}
                                        src={src}
                                        style={{
                                            zIndex:
                                                downloadUsers.length - index,
                                        }}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className=" ">
                                    downloaded by {item.user?.full_name}
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <p className="text-muted-foreground ml-2 cursor-pointer">
                                {downloadUsersLength > 4
                                    ? `+${downloadUsersLength - 4} more`
                                    : ''}
                            </p>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="overflow-y-auto max-h-64 ecoop-scroll min-w-xs max-w-[15rem]">
                            <div className="flex items-center justify-between px-2">
                                <h1 className="text-xs text-muted-foreground">
                                    Downloaded By
                                </h1>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-primary text-sm px-1">
                                        •
                                    </span>
                                    {downloadUsersLength} user
                                    <span>
                                        {downloadUsersLength > 1 ? 's' : ''}
                                    </span>
                                </p>
                            </div>
                            {downloadUsers?.map((downloadUser) => {
                                return (
                                    <>
                                        <DropdownMenuItem
                                            className="hover:!bg-transparent min-w-0 max-w-full"
                                            key={downloadUser.id}
                                        >
                                            <ImageDisplay
                                                className="mr-2"
                                                src={
                                                    downloadUser.user?.media
                                                        ?.download_url
                                                }
                                            />
                                            <div>
                                                <p className="text-muted-foreground  truncate">
                                                    {
                                                        downloadUser.user
                                                            ?.full_name
                                                    }
                                                    <br />
                                                    <span className="text-muted-foreground text-xs">
                                                        {toReadableDateTime(
                                                            downloadUser.created_at
                                                        )}
                                                        {' - '}
                                                        <span className="text-primary">
                                                            {dateAgo(
                                                                downloadUser.created_at
                                                            )}
                                                        </span>
                                                    </span>
                                                </p>
                                            </div>
                                        </DropdownMenuItem>
                                    </>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {report &&
                !(['failed', 'completed'] as TGeneratedReportStatus[]).includes(
                    report?.status
                ) && (
                    <GeneratedReportCardProgress
                        label="Generating Report..."
                        onReportUpdate={setReport}
                        report={report}
                    />
                )}
        </div>
    )
}

export const GeneratedReportCardProgress = ({
    label,
    report,
    onReportUpdate,
}: {
    label?: string
    report: IGeneratedReport
    onReportUpdate: (
        value:
            | IGeneratedReport
            | ((prevState: IGeneratedReport) => IGeneratedReport)
    ) => void
}) => {
    const eventName =
        report && report.status !== 'completed'
            ? `live.${report?.id ?? 'undefined'}`
            : undefined

    useSubscribe('generated_report', eventName, (data: IGeneratedReport) => {
        onReportUpdate(() => {
            if (report.status !== data.status) onReportUpdate?.(data)
            return data
        })
    })

    return (
        <div className="w-full mt-3">
            {label && (
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-1.5">
                    <span>{label}</span>
                    <span className="font-medium ">{report.progress}%</span>
                </div>
            )}
            <Progress
                className="h-1"
                indicatorClassName="bg-primary"
                value={report.progress}
            />
        </div>
    )
}
