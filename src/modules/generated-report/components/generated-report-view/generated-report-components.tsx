import React, { useCallback } from 'react'

import { toast } from 'sonner'

import { downloadFileService } from '@/helpers/file-download'
import { IGeneratedReport } from '@/modules/generated-report/generated-report.types'
import { printPDF } from '@/modules/pdf/pdf-utils'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Download, FileText, Printer } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import { RefreshIcon, XIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'

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
    isLocked?: boolean
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
    isLocked,
    onReportPrint,
    onReportDownload,
    refetch,
    className,
}) => {
    const { onOpen } = useConfirmModalStore()

    const handlePrint = useCallback(() => {
        if (!report?.media.download_url)
            return toast.warning('No report to download')
        const fileUrl = report?.media?.download_url

        if (!isLocked && report.has_password)
            return onOpen({
                title: 'Password protected',
                description: 'Please unlock the PDF first',
            })

        if (report.has_password) {
            return onOpen({
                title: 'PDF Print Redirect',
                description:
                    'Due to the document password protected, printing in this page is restricted. Redirecting to new Tab for security reason.',
                onConfirm: () => {
                    printPDF({
                        fileUrl,
                        isPasswordProtected: report.has_password,
                    })
                    onReportPrint?.(report)
                },
            })
        }

        printPDF({ fileUrl, isPasswordProtected: report.has_password })
        onReportPrint?.(report)
    }, [report, isLocked, onOpen, onReportPrint])

    const handleDownload = useCallback(async () => {
        if (!report?.media.download_url)
            return toast.warning('No report to download')
        if (!isLocked && report.has_password)
            return onOpen({
                title: 'Password protected',
                description: 'Please unlock the PDF first',
            })

        downloadFileService({ url: report?.media.download_url, mode: 'fetch' })
        onReportDownload?.(report)
    }, [isLocked, onOpen, onReportDownload, report])

    useHotkeys('ctrl+p', (e) => {
        e.preventDefault()
        handlePrint()
    })

    useHotkeys('ctrl+d', (e) => {
        e.preventDefault()
        handleDownload()
    })

    const isActionDisabled =
        !report || !isComplete || (report.has_password && !isLocked)

    return (
        <div
            className={`flex p-4 flex-row items-center justify-between gap-4 ${className}`}
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
                        disabled={isActionDisabled}
                        onClick={() => report && handlePrint()}
                        size="xs"
                        variant="outline"
                    >
                        <Printer className="h-4 w-4" />
                        Print
                        <span>
                            <Kbd className="mr-1">Ctrl</Kbd>
                            <Kbd>P</Kbd>
                        </span>
                    </Button>
                )}

                {report && (
                    <Button
                        disabled={isActionDisabled}
                        onClick={() => report && handleDownload()}
                        size="xs"
                        variant="outline"
                    >
                        <Download className="h-4 w-4" />
                        Download
                        <span>
                            <Kbd className="mr-1">Ctrl</Kbd>
                            <Kbd>D</Kbd>
                        </span>
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
