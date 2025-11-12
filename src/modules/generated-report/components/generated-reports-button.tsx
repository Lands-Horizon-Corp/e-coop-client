import { useCallback, useEffect, useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import Fuse from 'fuse.js'
import { toast } from 'sonner'

import { PAGINATION_INITIAL_INDEX } from '@/constants'
import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { IMedia, downloadMedia } from '@/modules/media'
import MediaResourceFileIcon from '@/modules/media/components/media-resource-file-icon'
import { PaginationState } from '@tanstack/react-table'
import { FilterIcon } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import RefreshButton from '@/components/buttons/refresh-button'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import {
    DatabaseIcon,
    DotMediumIcon,
    DotsVerticalIcon,
    DownloadIcon,
    ExcelFileFillIcon,
    FinanceReportsIcon,
    PDFFileFillIcon,
    PencilFillIcon,
    ReportsIcon,
    StarIcon,
    UserIcon,
} from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import GenericSearchInput from '@/components/search/generic-search-input'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import EmptyState from '@/components/ui/empty-state'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'

import useFilterState from '@/hooks/use-filter-state'
import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { highlightMatch } from '../../approvals/components/kanbans/journal-voucher/journal-voucher-kanban-main'
import {
    useDownloadReportByReportId,
    useGenerateReportMarkAsFavorite,
    useGetFilteredPaginatedGeneratedReport,
    useGetGeneratedReportAvailableModels,
} from '../generated-report.service'
import {
    IGeneratedReport,
    IGeneratedReportAvailableModalResponse,
    TModeGeneratedReport,
    TModelName,
} from '../generated-report.types'
import GeneratedReportCreateFormModal from './forms/generate-create-modal'
import GeneratedReportStatusBadge from './generated-report-status'

const GeneratedReportTabOptions: {
    value: TModeGeneratedReport
    label: string
    icon?: React.ReactNode
}[] = [
    { value: 'search', label: 'All', icon: <ReportsIcon className="size-4" /> },
    { value: 'me-search', label: 'Me', icon: <UserIcon /> },
    { value: 'pdf', label: 'PDF', icon: <PDFFileFillIcon /> },
    {
        value: 'excel',
        label: 'Excel',
        icon: <ExcelFileFillIcon />,
    },
    {
        value: 'favorites',
        label: 'Favorites',
        icon: <StarIcon />,
    },
    { value: 'me-pdf', label: 'My PDF' },
    { value: 'me-excel', label: 'My Excel' },
    { value: 'me-favorites', label: 'My Favorites' },
]

const DEFAULT_MODEL: TModelName = 'none'

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
    const [downloadUrl, setDownloadUrl] = useState(
        report.media?.download_url ? report.media : null
    )
    const [status, setStatus] = useState(report.status)

    useEffect(() => {
        setStatus(report.status)
        if (report.media?.download_url) {
            setDownloadUrl(report.media)
        }
    }, [report.status, report.media])

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

    const { mutate: downloadReport, isPending } = useDownloadReportByReportId({
        options: {
            onSuccess: (media) => {
                if (media && media.download_url) {
                    downloadMedia(media)
                    toast.success('Download initiated.')
                } else {
                    toast.success('Report generation started.')
                }
            },
            onError: (error) => {
                toast.error(`${error?.message}`)
            },
        },
    })

    const handleDownloadClick = useCallback(() => {
        downloadReport(report.id)
    }, [downloadReport, report.id, downloadUrl])

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

    return (
        <div className="flex relative items-center bg-secondary justify-between gap-2 p-3 rounded-lg transition-transform hover:translate-y-[-2px] mb-2 shadow-sm">
            <GeneratedReportCreateFormModal
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
                {...openUpdateReport}
            />
            <div className="flex items-center gap-2 min-w-0">
                {report.media?.file_name && (
                    <MediaResourceFileIcon
                        className="flex-1"
                        iconClassName="size-5 "
                        media={report.media}
                    />
                )}
                <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                        {report.name}
                        <GeneratedReportStatusBadge
                            className="text-xs py-0.3 ml-1 -translate-y-0.5 "
                            status={status || report.status}
                        />
                    </div>
                    <p className="text-xs flex items-center truncate">
                        {toReadableDate(report.created_at)} (
                        {dateAgo(report.created_at)})
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-xs font-mono tracking-wider">
                    {report.generated_reports_type?.toUpperCase()}
                </span>
                <div className="flex items-center ">
                    <div>
                        <Button
                            className="relative overflow-hidden cursor-pointer w-24 justify-center"
                            disabled={isDownloading || isPending}
                            onClick={handleDownloadClick}
                            size="sm"
                            title={
                                isDownloading
                                    ? `Processing: ${mediaProgess}%`
                                    : ''
                            }
                            variant={isDownloading ? 'secondary' : 'outline'}
                        >
                            <DownloadIcon
                                className={cn(
                                    'size-4',
                                    isDownloading && 'animate-bounce'
                                )}
                            />
                            {isDownloading && (
                                <span className="ml-1 text-xs font-medium">
                                    {isDownloading
                                        ? `${mediaProgess}%`
                                        : 'Download'}
                                </span>
                            )}
                            {!isDownloading && (
                                <span className="ml-1 text-xs font-medium">
                                    download
                                </span>
                            )}
                        </Button>
                        {isDownloading && (
                            <Progress
                                className="w-24 h-1 bg-gray-300"
                                value={mediaProgess}
                            />
                        )}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className=" cursor-pointer p-1 rounded-full">
                            <DotsVerticalIcon className=" size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {!isFavorite && (
                                <DropdownMenuItem
                                    onClick={() => {
                                        updateReport(report.id)
                                    }}
                                >
                                    <StarIcon className="mr-2 size-4" />
                                    Mark as Favorites
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
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {report.media?.progress && report.media.progress !== 100 && (
                <Progress
                    className="h-0.5 -translate-x-3 px-.5 bottom-0 absolute"
                    value={mediaProgess || report.media.progress}
                />
            )}
        </div>
    )
}

type useFilterGeneratedReportProps = {
    report: IGeneratedReport[]
    selectedModel: string
}

export const useFilterGeneratedReports = ({
    report,
    selectedModel,
}: useFilterGeneratedReportProps) => {
    const fuse = useMemo(
        () =>
            new Fuse<IGeneratedReport>(report ?? [], {
                keys: [{ name: 'model', weight: 0.2 }],
                includeScore: true,
                threshold: 0.2,
                includeMatches: true,
                findAllMatches: true,
            }),
        [report]
    )

    const filteredReports = useMemo(() => {
        let filtered: IGeneratedReport[] = Array.from(report ?? [])
        filtered = fuse.search(selectedModel).map((r) => r.item)

        return filtered
    }, [selectedModel, fuse])

    return {
        filteredReports,
    }
}

type GeneratedReportActionsProps = {
    selectedModel: TModelName
    setSelectedModel: (model: TModelName) => void
}

const GeneratedReportActions = ({
    selectedModel,
    setSelectedModel,
}: GeneratedReportActionsProps) => {
    const [activeTab, setActiveTab] = useState<TModeGeneratedReport>('search')

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: 20,
    })

    const { sortingStateBase64 } = useDataTableSorting()

    const handleFilterChange = useCallback(() => {
        setPagination((prev) => ({
            ...prev,
            pageIndex: PAGINATION_INITIAL_INDEX,
        }))
    }, [])

    const { finalFilterPayloadBase64 } = useFilterState({
        defaultFilterMode: 'OR',
        debounceFinalFilterMs: 0,
        onFilterChange: handleFilterChange,
    })

    const {
        data: GeneratedReports,
        isLoading,
        error,
        isFetching,
        refetch,
    } = useGetFilteredPaginatedGeneratedReport({
        mode: activeTab,
        model: (selectedModel || DEFAULT_MODEL) as TModelName,
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: finalFilterPayloadBase64,
        },
    })

    const filteredReports = GeneratedReports?.data ?? []

    const { PersonalAndAll, GeneralReport, PersonalReport } = useMemo(
        () => ({
            PersonalAndAll: GeneratedReportTabOptions.slice(0, 2),
            GeneralReport: GeneratedReportTabOptions.slice(2, 5),
            PersonalReport: GeneratedReportTabOptions.slice(5, 8),
        }),
        []
    )

    const handleTabChange = useCallback((tab: TModeGeneratedReport) => {
        setActiveTab(tab)
        setPagination((prev) => ({
            ...prev,
            pageIndex: PAGINATION_INITIAL_INDEX,
        }))
    }, [])

    const handleModelChange = useCallback(
        (model: TModelName) => {
            setSelectedModel(model)
        },
        [setSelectedModel]
    )

    const isFavorite = activeTab === 'me-favorites' || activeTab === 'favorites'

    return (
        <div className="flex flex-col p-1 h-full">
            <h2 className="text-xl flex items-center font-bold text-foreground mb-2">
                <FinanceReportsIcon className="mr-2" />
                Generated Reports
            </h2>
            <div className="grid gap-y-2  py-2">
                <div className="inline-flex justify-between items-center ">
                    <ButtonGroup className="flex-3">
                        {GeneralReport.map((opt) => (
                            <Button
                                className="gap-2 px-3 py-2 text-sm font-medium"
                                key={opt.value}
                                onClick={() => handleTabChange(opt.value)}
                                size="sm"
                                variant={
                                    activeTab === opt.value
                                        ? 'default'
                                        : 'outline'
                                }
                            >
                                {opt.icon && (
                                    <span className="">{opt.icon}</span>
                                )}
                                {opt.label}
                            </Button>
                        ))}
                    </ButtonGroup>
                    <RefreshButton
                        isLoading={isLoading || isFetching}
                        onClick={() => {
                            refetch()
                        }}
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                className="gap-2 ml-2 px-3 py-2 text-sm font-medium"
                                variant="outline"
                            >
                                <FilterIcon className="size-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="start"
                            className="w-80 p-0 border-0"
                            side="right"
                        >
                            <ReportModelFilter
                                onModelChange={handleModelChange}
                                selectedModel={selectedModel}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex items-center justify-between w-full ">
                    <ButtonGroup className="">
                        {PersonalAndAll.map((opt) => (
                            <Button
                                className="gap-2 px-3 py-2 text-sm font-medium"
                                key={opt.value}
                                onClick={() => handleTabChange(opt.value)}
                                size="sm"
                                variant={
                                    activeTab === opt.value
                                        ? 'default'
                                        : 'outline'
                                }
                            >
                                {opt.icon && (
                                    <span className="">{opt.icon}</span>
                                )}
                                {opt.label}
                            </Button>
                        ))}
                    </ButtonGroup>
                    <ButtonGroup className="">
                        {PersonalReport.map((opt) => (
                            <Button
                                className="gap-2 px-3 py-2 text-sm font-medium"
                                key={opt.value}
                                onClick={() => handleTabChange(opt.value)}
                                size="sm"
                                variant={
                                    activeTab === opt.value
                                        ? 'default'
                                        : 'outline'
                                }
                            >
                                {opt.icon && (
                                    <span className="">{opt.icon}</span>
                                )}
                                {opt.label}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>
            </div>
            <Card className="flex-1 bg-transparent overflow-y-auto ecoop-scroll border-0 ">
                <CardContent className="p-0 py-2 pr-2 max-h-fit min-h-full">
                    {isLoading && (
                        <div className="p-3 flex flex-col space-y-7">
                            {Array.from({ length: 5 }).map((_, index) => {
                                return (
                                    <div
                                        className="w-full max-h-8 space-y-2 items-center inline-flex"
                                        key={index}
                                    >
                                        <div className="w-full flex-2 space-y-2">
                                            <Skeleton className="h-3.5 w-3/4" />
                                            <Skeleton className="h-3.5 w-1/2" />
                                        </div>
                                        <Skeleton className="size-6" />
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    {error && (
                        <p className="text-center text-destructive">
                            Error loading reports.
                        </p>
                    )}
                    {!isLoading && filteredReports?.length === 0 && (
                        <EmptyState
                            className="border-muted border-1 !h-[50vh]"
                            icon={<ReportsIcon />}
                            title="No Reports Available"
                        />
                    )}
                    {!isLoading && (
                        <div className="grid grid-cols-1 gap-3">
                            {filteredReports.map((report: IGeneratedReport) => (
                                <GeneratedReportCard
                                    isFavorite={isFavorite}
                                    key={report.id}
                                    refetch={() => {
                                        refetch()
                                    }}
                                    report={report}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="p-0 sticky bottom-0 bg-sidebar">
                    <MiniPaginationBar
                        className="w-full border-0"
                        disablePageMove={isFetching}
                        onNext={({ pageIndex }) =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex,
                            }))
                        }
                        onPrev={({ pageIndex }) =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex,
                            }))
                        }
                        pagination={{
                            pageIndex: pagination.pageIndex,
                            pageSize: pagination.pageSize,
                            totalPage: GeneratedReports?.totalPage || 0,
                            totalSize: GeneratedReports?.totalSize || 0,
                        }}
                    />
                </CardFooter>
            </Card>
        </div>
    )
}

const GeneratedReportsButton = ({ className }: { className?: string }) => {
    const { open, onOpenChange } = useModalState()

    const [selectedModelAccount, setSelectedModel] =
        useState<TModelName>(DEFAULT_MODEL)

    useHotkeys(
        'control+J',
        (e) => {
            onOpenChange(!open)
            e.preventDefault()
        },
        {
            keydown: true,
        }
    )

    return (
        <div className={cn('w-fit', className)}>
            <Sheet onOpenChange={onOpenChange} open={open}>
                <SheetTitle className="hidden">Generated Reports</SheetTitle>
                <SheetDescription className="hidden">
                    Generated Reports Description
                </SheetDescription>
                <SheetTrigger asChild>
                    <Button
                        className="hover:!bg-transparent text-muted-foreground/70 h-9 rounded-full bg-card p-1"
                        onClick={() => onOpenChange(!open)}
                        size="sm"
                        variant="outline"
                    >
                        <DownloadIcon className="size-5 text-foreground" />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    className="bg-transparent shadow-none min-w-xl border-0 flex flex-row p-4 gap-4"
                    closeClassName="top-7 right-7"
                >
                    <Card className="h-full  w-full bg-card rounded-xl shadow-xl flex-shrink-0">
                        <CardContent className="h-full p-4">
                            <GeneratedReportActions
                                selectedModel={selectedModelAccount}
                                setSelectedModel={setSelectedModel}
                            />
                        </CardContent>
                    </Card>
                </SheetContent>
            </Sheet>
        </div>
    )
}

const ReportModelFilter = ({
    onModelChange,
    selectedModel,
}: {
    onModelChange: (model: TModelName) => void
    selectedModel: TModelName
}) => {
    const [searchTermLocal, setSearchTermLocal] = useState('')
    const { data: AccountModels } = useGetGeneratedReportAvailableModels({
        options: {},
    })

    const fuse = useMemo(
        () =>
            new Fuse<any>(AccountModels ?? [], {
                keys: [{ name: 'model', weight: 0.2 }],
                threshold: 0.2,
            }),
        [AccountModels]
    )

    const filteredAccountModalName = useMemo(() => {
        let filtered: IGeneratedReportAvailableModalResponse[] = Array.from(
            AccountModels ?? []
        )
        if (searchTermLocal.trim()) {
            filtered = fuse.search(searchTermLocal).map((r) => r.item)
        }
        return filtered
    }, [searchTermLocal, fuse])

    return (
        <Card className="h-full bg-card rounded-sm shadow-xl flex flex-col">
            <CardContent className="flex flex-col h-full p-0">
                <div className="!h-fit max-h-fit rounded-t-sm border-b sticky top-0 bg-sidebar/50 z-10 p-2">
                    <GenericSearchInput
                        className="!h-fit"
                        placeholder="search account model"
                        setSearchTerm={(s) => {
                            setSearchTermLocal(s)
                        }}
                    />
                </div>
                <div className="flex flex-col px-3 gap-4 flex-1 overflow-y-auto py-2 ecoop-scroll pr-2">
                    <div className="space-y-2">
                        {filteredAccountModalName.length === 0 && (
                            <EmptyState
                                icon={<DatabaseIcon />}
                                title="No Model to Show."
                            />
                        )}
                        <RadioGroup
                            className="flex flex-col gap-y-2"
                            name="report-model-select"
                            onValueChange={onModelChange}
                            value={selectedModel}
                        >
                            <div
                                className="shadow-xs relative min-w-fit flex w-full h-10 items-center  gap-2 rounded-sm border  px-2 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                key={DEFAULT_MODEL}
                            >
                                <RadioGroupItem
                                    className="order-1 cursor-pointer has-[:checked]:text-primary after:absolute after:inset-0"
                                    id={`other-info-${DEFAULT_MODEL}`}
                                    value={DEFAULT_MODEL}
                                />
                                <div className="flex grow items-center gap-3">
                                    <div className="grid gap-2">
                                        <Label className="truncate text-xs">
                                            none
                                        </Label>
                                    </div>
                                </div>
                            </div>
                            {filteredAccountModalName.map((item) => (
                                <div
                                    className="shadow-xs relative min-w-fit flex w-full h-10 items-center  gap-2 rounded-sm border  px-2 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                    key={item.model}
                                >
                                    <RadioGroupItem
                                        className="order-1 cursor-pointer has-[:checked]:text-primary after:absolute after:inset-0"
                                        id={`other-info-${item.model}`}
                                        value={item.model as TModelName}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="grid gap-2">
                                            <Label
                                                className="truncate text-xs inline-flex"
                                                htmlFor={`other-info-${item.model}`}
                                                key={item.model}
                                            >
                                                {highlightMatch(
                                                    item.model,
                                                    searchTermLocal
                                                )}
                                                <span className="text-xs flex items-center text-muted-foreground">
                                                    <DotMediumIcon className="text-primary" />
                                                    {item.count}
                                                </span>
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default GeneratedReportsButton
