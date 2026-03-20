import { useEffect, useState } from 'react'

import { cn } from '@/helpers'
import { toReadableDateTime } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import PdfViewer from '@/modules/pdf/components/pdf-viewer/pdf-viewer'
import { format } from 'date-fns'
import { Download, FileText, Printer } from 'lucide-react'

import { RefreshIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps, TEntityId } from '@/types'

import { useGetGeneratedReportById } from '../../generated-report.service'
import {
    IGeneratedReport,
    TGeneratedReportStatus,
} from '../../generated-report.types'
import {
    ReportErrorState,
    ReportLoadingState,
    statusBadgeVariant,
    statusLabel,
} from './generated-report-components'
import { useReportViewerStore } from './global-generate-report-viewer.store'

export interface GenerateReportViewerProps extends IClassProps {
    reportId: TEntityId

    onReportStatusChange?: (status: TGeneratedReportStatus) => void
    onReportDownload?: (report: IGeneratedReport) => void
    onReportPrint?: (report: IGeneratedReport) => void
}

export function ReportViewer({
    reportId,
    className,
    onReportStatusChange,
    onReportDownload,
    onReportPrint,
}: GenerateReportViewerProps) {
    const [report, setReport] = useState<IGeneratedReport | undefined>()

    const {
        data,
        isPending,
        refetch,
        isRefetching,
        error: fetchError,
        status,
    } = useGetGeneratedReportById({
        id: reportId,
        options: {
            refetchInterval: report?.status === 'pending' ? 10_000 : false,
        },
    })

    useEffect(() => {
        setReport(data)
    }, [data, status])

    const error = serverRequestErrExtractor({ error: fetchError })

    const eventName =
        report && report.status !== 'completed'
            ? `live.${report?.id ?? 'undefined'}`
            : undefined

    useSubscribe('generated_report', eventName, (data: IGeneratedReport) => {
        setReport((prev) => {
            if (prev?.status !== data.status)
                onReportStatusChange?.(data.status)
            return data
        })
    })

    const isComplete = report?.status === 'completed'
    const isFailed = report?.status === 'failed'
    const isProcessing = report && !isComplete

    return (
        <div
            className={cn(
                'w-full bg-popover min-w-4xl max-w-full mx-auto ring-4 rounded-2xl ring-secondary',
                className
            )}
        >
            <div className="flex p-4 flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <FileText className="size-4 mt-0.5 shrink-0 text-muted-foreground" />

                        <h2 className="text-sm text-foreground truncate min-w-0">
                            {report?.name ?? 'Loading report...'}
                        </h2>

                        {report?.status && (
                            <Badge variant={statusBadgeVariant(report.status)}>
                                {statusLabel(report.status)}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {report?.media?.file_type?.includes('pdf') && (
                        <Button
                            disabled={!isComplete}
                            onClick={() => onReportPrint?.(report)}
                            size="sm"
                            variant="outline"
                        >
                            <Printer className="h-4 w-4" />
                            Print
                        </Button>
                    )}

                    {report && (
                        <Button
                            disabled={!isComplete}
                            onClick={() => onReportDownload?.(report)}
                            size="sm"
                            variant="outline"
                        >
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                    )}
                    <Button
                        className="rounded-full"
                        disabled={isPending || isRefetching}
                        onClick={() => refetch()}
                        size="icon-sm"
                        variant="outline"
                    >
                        {isPending || isRefetching ? (
                            <LoadingSpinner />
                        ) : (
                            <RefreshIcon />
                        )}
                    </Button>
                </div>
            </div>

            <div className="px-4">
                {isPending && (
                    <div className="w-full min-w-0 h-[500px] rounded-2xl border border-dashed bg-muted/20 flex flex-col items-center justify-center">
                        <div className="h-8 w-8 rounded-full border-4 border-muted border-t-primary animate-spin" />
                    </div>
                )}

                {!isPending && (error || !report) && (
                    <div className="w-full min-w-0 h-[500px] rounded-2xl border border-dashed bg-muted/20 flex flex-col items-center justify-center">
                        <p className="text-sm text-destructive">
                            {error ?? 'Report not found.'}
                        </p>
                    </div>
                )}

                {!isPending && report && isProcessing && !isFailed && (
                    <div className="w-full min-w-0 h-[500px] rounded-2xl border border-dashed bg-muted/20 flex flex-col items-center justify-center">
                        <ReportLoadingState status={report.status} />
                    </div>
                )}

                {!isPending && isFailed && (
                    <div className="w-full min-w-0 h-[500px] rounded-2xl border border-dashed bg-muted/20 flex flex-col items-center justify-center">
                        <ReportErrorState message={report?.system_message} />
                    </div>
                )}

                {!isPending &&
                    isComplete &&
                    report?.media?.file_type?.includes('pdf') && (
                        <PdfViewer
                            className="w-full h-[75vh]"
                            file={report.media?.download_url}
                            // hideHeader
                            // className="flex-1 h-[500px] w-full flex"
                            pageWidth={800}
                        />
                    )}
            </div>

            <div className="flex flex-wrap items-center gap-3 px-4 py-4">
                {report ? (
                    <>
                        {report.paper_size && (
                            <>
                                <span className="text-xs text-muted-foreground font-medium">
                                    {report.paper_size}
                                </span>
                                <Separator
                                    className="h-4"
                                    orientation="vertical"
                                />
                            </>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {report.width}
                            {report.unit} x {report.height}
                            {report.unit}
                        </p>
                    </>
                ) : (
                    <p className="text-xs text-muted-foreground">
                        Unknown Size
                    </p>
                )}

                <div className="flex items-center ml-auto gap-x-4">
                    {isProcessing && !isFailed && (
                        <div className="flex items-center gap-2 flex-1 min-w-[160px] max-w-[220px]">
                            <span
                                className={cn(
                                    'text-xs text-muted-foreground',
                                    isFailed && 'text-destructive'
                                )}
                            >
                                {report?.progress || 0}%
                            </span>

                            {report?.status && !isComplete && (
                                <Progress
                                    indicatorClassName={cn(
                                        isFailed && 'bg-destructive'
                                    )}
                                    value={report?.progress || 0}
                                />
                            )}
                        </div>
                    )}
                    {report && (
                        <p className="text-xs text-muted-foreground">
                            Created{' '}
                            {format(new Date(report.created_at), 'MMM d, yyyy')}
                            {report.updated_at !== report.created_at &&
                                report.updated_at && (
                                    <>
                                        {' '}
                                        · Updated{' '}
                                        {toReadableDateTime(report.updated_at)}
                                    </>
                                )}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export const ReportViewerModal = ({
    reportViewerProps,
    ...modalProps
}: IModalProps & {
    reportViewerProps: GenerateReportViewerProps
}) => {
    return (
        <Modal
            {...modalProps}
            className="bg-transparent w-fit px-1 py-0.5 !max-w-none border-none shadow-none"
            closeButtonClassName="hidden"
        >
            <ReportViewer
                className="w-full max-w-5xl my-1"
                {...reportViewerProps}
            />
        </Modal>
    )
}

export function GlobalReportViewer() {
    const { isOpen, close, reportProps } = useReportViewerStore()

    if (!reportProps?.reportId) return

    return (
        <ReportViewerModal
            onOpenChange={(open) => !open && close()}
            open={isOpen}
            reportViewerProps={{
                ...reportProps,
            }}
        />
    )
}
