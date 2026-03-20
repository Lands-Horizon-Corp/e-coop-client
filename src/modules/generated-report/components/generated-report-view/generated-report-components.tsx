import { XIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'

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
