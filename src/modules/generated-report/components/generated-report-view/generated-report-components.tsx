import React, { useCallback } from 'react'

import { toast } from 'sonner'

import { downloadFileService } from '@/helpers/file-download'
import { IGeneratedReport } from '@/modules/generated-report/generated-report.types'
import { printPDF } from '@/modules/pdf/pdf-utils'
import { Download, FileText, Printer } from 'lucide-react'

import { RefreshIcon, XIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { TGeneratedReportStatus } from '../../generated-report.types'

const STATUS_LABEL: Partial<Record<TGeneratedReportStatus, string>> = {
    pending: 'Waiting in queue…',
    in_progress: 'Processing your report…',
    formatting: 'Formatting document…',
    uploading: 'Uploading document…',
}

interface ReportLoadingStateProps {
    status: TGeneratedReportStatus
}

export const ReportLoadingState = ({ status }: ReportLoadingStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <LoadingSpinner className="h-10 w-10" />
            <p className="text-sm font-medium text-muted-foreground">
                {STATUS_LABEL[status] ?? 'Processing…'}
            </p>
        </div>
    )
}

interface ReportErrorStateProps {
    message?: string
}

export const ReportErrorState = ({ message }: ReportErrorStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <XIcon className="h-10 w-10 text-destructive" />
            <p className="text-sm font-medium text-destructive">
                Failed processing document
            </p>
            {message && (
                <p className="text-xs text-muted-foreground max-w-md text-center">
                    {message}
                </p>
            )}
        </div>
    )
}

export const statusBadgeVariant = (status: TGeneratedReportStatus) => {
    if (status === 'completed') return 'default' as const
    if (status === 'failed') return 'destructive' as const
    return 'secondary' as const
}

export const statusLabel = (status: TGeneratedReportStatus) => {
    const map: Record<TGeneratedReportStatus, string> = {
        pending: 'Pending',
        in_progress: 'In Progress',
        formatting: 'Formatting',
        uploading: 'Uploading',
        completed: 'Completed',
        failed: 'Failed',
    }
    return map[status]
}

interface ReportViewerHeaderProps {
    report?: IGeneratedReport
    isComplete: boolean
    isPending: boolean
    isRefetching: boolean
    onReportPrint?: (report: IGeneratedReport) => void
    onReportDownload?: (report: IGeneratedReport) => void
    refetch: () => void
    className?: string
}

export const ReportViewerHeader: React.FC<ReportViewerHeaderProps> = ({
    report,
    isComplete,
    isPending,
    isRefetching,
    onReportPrint,
    onReportDownload,
    refetch,
    className,
}) => {
    const handlePrint = useCallback(() => {
        if (!report?.media.download_url)
            return toast.warning('No report to download')
        const fileUrl = report?.media?.download_url
        printPDF({ fileUrl })
        onReportPrint?.(report)
    }, [onReportPrint, report])

    const handleDownload = useCallback(async () => {
        if (!report?.media.download_url)
            return toast.warning('No report to download')
        downloadFileService({ url: report?.media.download_url, mode: 'fetch' })
        onReportDownload?.(report)
    }, [onReportDownload, report])

    return (
        <div
            className={`flex p-4 flex-row items-start justify-between gap-4 ${className}`}
        >
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
                        onClick={() => report && handlePrint()}
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
                        onClick={() => report && handleDownload()}
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
                    onClick={refetch}
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
    )
}
