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
import { DownloadIcon, StarIcon, TrashIcon } from 'lucide-react'

import {
    DotsVerticalIcon,
    EmptyIcon,
    ExcelFileFillIcon,
    PDFFileFillIcon,
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
import { IGeneratedReport } from '../../generated-report.types'
import {
    DELAY_DOWNLOAD_TIME_DURATION,
    DELAY_DOWNLOAD_TIME_INTERVAL,
} from '../../generated-reports.constants'
import GeneratedReportCreateFormModal from '../forms/generate-create-modal'

type TGeneratedReportCardProps = {
    report: IGeneratedReport
    isFavorite: boolean
    refetch: () => void
}

export const GeneratedReportCard = ({
    report,
    isFavorite,
    refetch,
}: TGeneratedReportCardProps) => {
    const invalidate = useQueryClient()
    const openUpdateReport = useModalState()
    const [mediaProgess, setMediaProgress] = useState(0)

    const { mutate: updateReport } = useGenerateReportMarkAsFavorite({
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

    useSubscribe<IGeneratedReport>(
        `generated_report.update.${report.id}`,
        () => {}
    )

    useSubscribe<IMedia>(`media.update.${report.media_id}`, (media) => {
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
                'relative items-center bg-secondary justify-between gap-2 p-3 pt-4 mt-1 rounded-lg transition-transform hover:translate-y-[-2px] mb-2 shadow-sm',
                isExcel &&
                    'border-l-2 border-l-green-500 bg-gradient-to-tl dark:from-green-500/20 to-background',
                isPdf &&
                    'border-l-2 border-red-500 bg-gradient-to-tl dark:from-red-500/20 to-background',
                hasNoMedia &&
                    'border-l-2 border-muted bg-gradient-to-tl dark:from-muted/20 to-background'
            )}
        >
            {!hasNoMedia && (
                <Badge
                    className="font-normal border-primary py-[.5px] left-4 -top-2 absolute"
                    variant={'outline'}
                >
                    <ReportsIcon className="mr-1" />
                    {report.model}
                </Badge>
            )}
            <GeneratedReportCreateFormModal
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
            />
            <div
                className={cn(
                    'flex items-center gap-2.5 min-w-0 w-full',
                    hasNoMedia && 'opacity-50'
                )}
            >
                {hasNoMedia ? (
                    <div className="relative">
                        <ImageDisplay
                            className="size-8 border dark:border-white border-black "
                            fallback={
                                report.created_by?.full_name?.charAt(0) ??
                                undefined
                            }
                            src={
                                report.created_by?.media?.download_url ??
                                undefined
                            }
                        />
                        <EmptyIcon className="text-muted bg-white rounded-full absolute -bottom-1 right-0" />
                    </div>
                ) : (
                    <div className="relative">
                        <ImageDisplay
                            className={cn(
                                'size-8 border',
                                isExcel && 'border-green-500',
                                isPdf && 'border-red-500'
                            )}
                            fallback={
                                report.created_by?.full_name?.charAt(0) ??
                                undefined
                            }
                            src={
                                report.created_by?.media?.download_url ??
                                undefined
                            }
                        />
                        {isExcel && (
                            <ExcelFileFillIcon className="text-white bg-green-500 rounded-full p-0.5 absolute -bottom-1 right-0" />
                        )}
                        {isPdf && (
                            <PDFFileFillIcon className="text-red-500 bg-primary/80 rounded-full absolute -bottom-1 right-0" />
                        )}
                    </div>
                )}
                <div className="min-w-0 grow">
                    <div className="font-medium text-sm items-center truncate">
                        <span>{report.name}</span>
                        <Tooltip>
                            <TooltipTrigger>
                                <StarIcon
                                    className={cn(
                                        'inline-block -translate-y-1 ml-2 size-4 text-primary',
                                        report.is_favorite ? '' : 'opacity-0'
                                    )}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                {isFavorite
                                    ? 'Marked as Favorite'
                                    : 'Mark as Favorite'}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <div className="text-xs text-muted-foreground flex flex-col truncate">
                        <p className="">
                            {report.media?.file_size && (
                                <>
                                    {formatBytes(report.media?.file_size)} •{' '}
                                    {''}
                                </>
                            )}
                            {toReadableDate(report.created_at)} •{' '}
                            {dateAgo(report.created_at)}
                        </p>

                        <span>generated by {report.created_by?.full_name}</span>
                    </div>
                    {!isExcel && !isPdf && (
                        <p className="text-xs bg-destructive/50 p-0.5 rounded-sm">
                            {report.system_message}
                        </p>
                    )}
                </div>
                <div className="flex items-center translate-y-2 flex-col min-h-full ">
                    <div className="inline-flex ">
                        <Button
                            className="relative text-xs overflow-hidden hover:!bg-primary/30 cursor-pointer justify-center"
                            disabled={
                                isDownloading ||
                                isPending ||
                                hasNoMedia ||
                                cooldownCount > 0
                            }
                            onClick={handleDownloadClick}
                            size="sm"
                            title={
                                isDownloading
                                    ? `Processing: ${mediaProgess}%`
                                    : ''
                            }
                            variant={cooldownCount > 0 ? 'ghost' : 'outline'}
                        >
                            {cooldownCount > 0 ? (
                                `Please wait ${cooldownCount}s`
                            ) : (
                                <>
                                    <DownloadIcon
                                        className={cn(
                                            'size-4',
                                            isDownloading && 'animate-bounce'
                                        )}
                                    />
                                </>
                            )}
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger className=" cursor-pointer p-1 rounded-full">
                                <DotsVerticalIcon className=" size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {!isFavorite && (
                                    <DropdownMenuItem
                                        disabled={hasNoMedia}
                                        onClick={() => {
                                            updateReport(report.id)
                                        }}
                                    >
                                        <StarIcon className="mr-2 size-4" />
                                        Mark as Favorite
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onClick={() => {
                                        openUpdateReport.onOpenChange(true)
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
            <div className="flex justify-end pt-1">
                <div
                    className={cn(
                        'flex text-xs w-fit justify-end -space-x-2 bottom-2.5 right-4.5',
                        hasNoMedia && 'opacity-50'
                    )}
                >
                    {downloadUsers.map((item, index) => {
                        const src = item.user?.media?.download_url
                        if (index > 5) return null
                        return (
                            <Tooltip delayDuration={400}>
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
            {hasNoMedia && (
                <p className="absolute text-xs bottom-0 left-0 right-0 bg-destructive/30 w-fit rounded-sm px-1 text-red-400 ">
                    No media associated with this generated report.
                </p>
            )}
            {report.media?.progress && (
                <Progress
                    className={`h-0.5  -translate-x-3 px-.5 bottom-0 absolute ${mediaProgess === 0 ? 'hidden' : ''}`}
                    value={mediaProgess}
                />
            )}
        </div>
    )
}
