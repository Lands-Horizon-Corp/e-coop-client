import { useEffect, useState } from 'react'

import { cn } from '@/helpers'
import { toReadableDateTime } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import PdfViewer from '@/modules/pdf/components/pdf-viewer/pdf-viewer'
import { format } from 'date-fns'

import Modal, { IModalProps } from '@/components/modals/modal'
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
    ReportViewerHeader,
} from './generated-report-components'
import { useReportViewerStore } from './global-generate-report-viewer.store'

export interface GenerateReportViewerProps extends IClassProps {
    reportId: TEntityId
    defaultReport?: IGeneratedReport

    onReportStatusChange?: (status: TGeneratedReportStatus) => void
    onReportDownload?: (report: IGeneratedReport) => void
    onReportPrint?: (report: IGeneratedReport) => void
}

export function ReportViewer({
    reportId,
    className,
    defaultReport,
    onReportStatusChange,
    onReportDownload,
    onReportPrint,
}: GenerateReportViewerProps) {
    const [report, setReport] = useState<IGeneratedReport | undefined>()
    const [isUnlocked, setIsUnlocked] = useState(false)

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
            initialData: defaultReport,
            refetchInterval: report?.status === 'pending' ? 10_000 : false,
            refetchOnWindowFocus: false,
        },
    })

    useEffect(() => {
        setReport(data)
    }, [data, status])

    useEffect(() => {
        setIsUnlocked(false)
    }, [report?.id])

    const canDownload = report && (!report?.has_password || isUnlocked)

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
            <ReportViewerHeader
                isComplete={isComplete}
                isLocked={canDownload}
                isPending={isPending}
                isRefetching={isRefetching}
                onReportDownload={onReportDownload}
                onReportPrint={onReportPrint}
                refetch={refetch}
                report={report}
            />

            <div className="px-4">
                {isPending && (
                    <div className="w-full min-w-0 h-[500px] rounded-2xl border border-dashed bg-muted/20 flex flex-col items-center justify-center">
                        <div className="h-8 w-8 rounded-full border-4 border-muted border-t-primary animate-spin" />
                    </div>
                )}

                {!isPending && report && isProcessing && !isFailed && (
                    <div className="w-full min-w-0 h-[500px] rounded-2xl border border-dashed bg-muted/20 flex flex-col items-center justify-center">
                        <ReportLoadingState status={report.status} />
                    </div>
                )}

                {!isPending && isFailed ? (
                    <div className="w-full min-w-0 h-[500px] rounded-2xl border border-dashed bg-muted/20 flex flex-col items-center justify-center">
                        <ReportErrorState
                            message={report?.system_message ?? error}
                        />
                    </div>
                ) : !isPending && (!report || error) ? (
                    <div className="w-full min-w-0 h-[500px] rounded-2xl border border-dashed bg-muted/20 flex flex-col items-center justify-center">
                        <p className="text-sm text-destructive">
                            {error ?? 'Report not found.'}
                        </p>
                    </div>
                ) : null}

                {!isPending &&
                    isComplete &&
                    report?.media?.file_type?.includes('pdf') && (
                        <PdfViewer
                            className="w-full h-[75vh]"
                            file={report.media?.download_url}
                            hideHeader
                            onPasswordValid={() => {
                                setIsUnlocked(true)
                            }}
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
                            {report.created_at
                                ? format(
                                      new Date(report.created_at),
                                      'MMM d, yyyy'
                                  )
                                : 'unknown date'}
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
