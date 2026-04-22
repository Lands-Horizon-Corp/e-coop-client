import { useCallback, useMemo, useState } from 'react'

import { PAGINATION_INITIAL_INDEX } from '@/constants'
import { cn } from '@/helpers'
import { PaginationState } from '@tanstack/react-table'
import { useHotkeys } from 'react-hotkeys-hook'

import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import {
    DownloadIcon,
    ExcelFileFillIcon,
    FileFillIcon,
    FunnelIcon,
    PDFFileFillIcon,
    RefreshIcon,
    ReportsIcon,
    ReportsSearchIcon,
    StarIcon,
    UserIcon,
} from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import EmptyState from '@/components/ui/empty-state'
import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import useFilterState from '@/hooks/use-filter-state'
import { useModalState } from '@/hooks/use-modal-state'

import { useGetFilteredPaginatedGeneratedReport } from '../../generated-report.service'
import {
    IGeneratedReport,
    TModeGeneratedReport,
    TReportName,
} from '../../generated-report.types'
import { GeneratedReportCard } from './generated-report-card'
import { ReportFilter } from './generated-reports-filter'

const GeneratedReportTabOptions: {
    value: TModeGeneratedReport
    label: string
    icon?: React.ReactNode
}[] = [
    { value: 'me-search', label: 'Me', icon: <UserIcon /> },
    { value: 'me-pdf', label: 'My PDF', icon: <PDFFileFillIcon /> },
    { value: 'me-excel', label: 'My Excel', icon: <ExcelFileFillIcon /> },
    { value: 'me-favorites', label: 'My Favorites', icon: <StarIcon /> },
    { value: 'search', label: 'All', icon: <ReportsIcon className="size-4" /> },
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
]

export const DEFAULT_MODEL: TReportName = 'none'

const GeneratedReportListContent = () => {
    const [activeTab, setActiveTab] = useState<TModeGeneratedReport>('search')
    const [selectedModelAccount, setSelectedModel] =
        useState<TReportName>(DEFAULT_MODEL)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: 50,
    })
    const [ownerFilter, setOwnerFilter] = useState<'me' | 'all'>('me')

    const { sortingStateBase64, setSortingState } = useDataTableSorting()

    const { setFilter, finalFilterPayloadBase64 } = useFilterState({
        defaultFilterMode: 'AND',
        debounceFinalFilterMs: 0,
        onFilterChange: () =>
            setPagination((prev) => ({
                ...prev,
                pageIndex: PAGINATION_INITIAL_INDEX,
            })),
    })

    const {
        data: GeneratedReports,
        isLoading,
        error,
        isFetching,
        refetch,
    } = useGetFilteredPaginatedGeneratedReport({
        mode: activeTab,
        model: (selectedModelAccount || DEFAULT_MODEL) as TReportName,
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: finalFilterPayloadBase64,
        },
    })

    const filteredReports = GeneratedReports?.data ?? []

    const { GeneralReport, PersonalReport } = useMemo(
        () => ({
            GeneralReport: GeneratedReportTabOptions.slice(0, 4),
            PersonalReport: GeneratedReportTabOptions.slice(4, 8),
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

    const isFavorite = activeTab === 'me-favorites' || activeTab === 'favorites'

    return (
        <div className="flex flex-col h-full">
            <h4 className="text-base px-4 py-2 flex items-center">
                <FileFillIcon className="mr-2" />
                Generated Reports
            </h4>
            <Separator className="" />
            <div className="space-y-1 p-4 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Tabs
                            onValueChange={(v) =>
                                setOwnerFilter(v as 'me' | 'all')
                            }
                            value={ownerFilter}
                        >
                            <TabsList className="h-8">
                                <TabsTrigger className="text-xs" value="me">
                                    <UserIcon className="size-4" />
                                    Me
                                </TabsTrigger>
                                <TabsTrigger className="text-xs" value="all">
                                    <ReportsSearchIcon className="size-4" />
                                    All
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="flex gap-1">
                        <Button
                            className="size-8"
                            disabled={isLoading || isFetching}
                            onClick={() => {
                                refetch()
                            }}
                            size="icon"
                            variant="ghost"
                        >
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <RefreshIcon className="size-4" />
                            )}
                        </Button>
                        <ReportFilter
                            onModelChange={(selectedModel) => {
                                setSelectedModel(selectedModel)
                            }}
                            selectedModel={selectedModelAccount}
                            setFilter={setFilter}
                            setSortingState={setSortingState}
                            trigger={
                                <Button
                                    className="size-8"
                                    disabled={isLoading}
                                    size="icon"
                                    variant="ghost"
                                >
                                    <FunnelIcon className="size-4" />
                                </Button>
                            }
                        />
                    </div>
                </div>{' '}
                <Tabs
                    defaultValue="all"
                    onValueChange={(value) =>
                        handleTabChange(
                            value as unknown as TModeGeneratedReport
                        )
                    }
                    value={activeTab}
                >
                    <TabsList>
                        {ownerFilter !== 'me'
                            ? GeneralReport.map((opt) => (
                                  <TabsTrigger
                                      key={opt.value}
                                      value={opt.value}
                                  >
                                      {opt.label}
                                  </TabsTrigger>
                              ))
                            : PersonalReport.map((opt) => (
                                  <TabsTrigger
                                      key={opt.value}
                                      value={opt.value}
                                  >
                                      {opt.label}
                                  </TabsTrigger>
                              ))}
                    </TabsList>
                </Tabs>
            </div>
            <div className="flex-1 bg-transparent  shadow-none overflow-y-auto ecoop-scroll border-0 ">
                <div className="p-4 py-2  max-h-fit min-h-[90%]">
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
                        <div className="grid grid-cols-1">
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
                </div>

                <div className="p-0 sticky bottom-0 bg-sidebar">
                    <Separator className="" />
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
                </div>
            </div>
        </div>
    )
}

const GeneratedReportsList = () => {
    return (
        <Card className="h-full w-full bg-popover overflow-clip rounded-xl ring-4 ring-muted/60 border-muted shadow-xl flex-shrink-0">
            <CardContent className="h-full p-0">
                <GeneratedReportListContent />
            </CardContent>
        </Card>
    )
}

const GeneratedReportsListSheet = ({ className }: { className?: string }) => {
    const { open, onOpenChange } = useModalState()

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
                        hoverVariant="primary"
                        onClick={() => onOpenChange(!open)}
                        size="icon-sm"
                        variant="outline-ghost"
                    >
                        <DownloadIcon className="size-5 text-foreground" />
                    </Button>
                </SheetTrigger>
                <SheetContent
                    className="bg-transparent shadow-none min-w-xl border-0 flex flex-row p-4 gap-4"
                    closeClassName="top-7 right-7"
                    forceMount={true}
                >
                    <GeneratedReportsList />
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default GeneratedReportsListSheet
