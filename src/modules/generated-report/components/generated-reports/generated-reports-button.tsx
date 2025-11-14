import { useCallback, useMemo, useState } from 'react'

import Fuse from 'fuse.js'

import { PAGINATION_INITIAL_INDEX } from '@/constants'
import { cn } from '@/helpers'
import { PaginationState } from '@tanstack/react-table'
import { useHotkeys } from 'react-hotkeys-hook'

import RefreshButton from '@/components/buttons/refresh-button'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import {
    DownloadIcon,
    ExcelFileFillIcon,
    FinanceReportsIcon,
    PDFFileFillIcon,
    ReportsIcon,
    ReportsSearchIcon,
    StarIcon,
    UserIcon,
} from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
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

import useFilterState from '@/hooks/use-filter-state'
import { useModalState } from '@/hooks/use-modal-state'

import { useGetFilteredPaginatedGeneratedReport } from '../../generated-report.service'
import {
    IGeneratedReport,
    TModeGeneratedReport,
    TModelName,
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

export const DEFAULT_MODEL: TModelName = 'none'

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

const GeneratedReportActions = () => {
    const [activeTab, setActiveTab] = useState<TModeGeneratedReport>('search')
    const [selectedModelAccount, setSelectedModel] =
        useState<TModelName>(DEFAULT_MODEL)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: 5,
    })
    const [isAll, setIsAll] = useState(false)

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
        model: (selectedModelAccount || DEFAULT_MODEL) as TModelName,
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
    const AllVariant = isAll ? 'default' : 'outline'
    const MEvariant = !isAll ? 'default' : 'outline'
    return (
        <div className="flex flex-col p-1 h-full">
            <h2 className="text-xl flex items-center font-bold text-foreground mb-2">
                <FinanceReportsIcon className="mr-2" />
                Generated Reports
            </h2>
            <div className="grid gap-y-2 py-2">
                <div className="inline-flex justify-between items-center ">
                    <ButtonGroup className="justify-start w-full">
                        <Button
                            onClick={() => {
                                setIsAll(false)
                                handleTabChange('me-search')
                            }}
                            size={'sm'}
                            variant={MEvariant}
                        >
                            <UserIcon className="size-4" />
                            Me
                        </Button>
                        <Button
                            onClick={() => {
                                setIsAll(true)
                                handleTabChange('search')
                            }}
                            size={'sm'}
                            variant={AllVariant}
                        >
                            <ReportsSearchIcon className="size-4" />
                            All
                        </Button>
                    </ButtonGroup>
                    <RefreshButton
                        isLoading={isLoading || isFetching}
                        onClick={() => {
                            refetch()
                        }}
                    />
                    <ReportFilter
                        onModelChange={(selectedModel) => {
                            setSelectedModel(selectedModel)
                        }}
                        selectedModel={selectedModelAccount}
                        setFilter={setFilter}
                        setSortingState={setSortingState}
                    />
                </div>
                <div className="flex items-center justify-between w-full ">
                    {!isAll ? (
                        <ButtonGroup className="w-full">
                            {GeneralReport.map((opt) => (
                                <Button
                                    className="gap-2 px-3 py-2 w-[25%] text-sm font-medium"
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
                    ) : (
                        <ButtonGroup className="w-full">
                            {PersonalReport.map((opt) => (
                                <Button
                                    className="gap-2 px-3 py-2 w-[25%] text-sm font-medium"
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
                    )}
                </div>
            </div>
            <Separator className="my-2" />
            <Card className="flex-1 bg-transparent  shadow-none overflow-y-auto ecoop-scroll border-0 ">
                <CardContent className="p-0 py-2 pr-2 max-h-fit min-h-[90%]">
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
                            <GeneratedReportActions />
                        </CardContent>
                    </Card>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default GeneratedReportsButton
