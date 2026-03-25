import { useEffect } from 'react'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { useSubscribe } from '@/hooks/use-pubsub'

import { useGetMyInProgressReports } from '../../generated-report.service'
import { IGeneratedReport } from '../../generated-report.types'
import { useReportViewerStore } from '../generated-report-view/global-generate-report-viewer.store'
import { useReportListenerStore } from './report-listener-store'

export const useInitReportListener = ({
    onReportUpdate,
}: {
    onReportUpdate?: (report: IGeneratedReport) => void
} = {}) => {
    const appendReport = useReportListenerStore((s) => s.appendReport)

    const { data, isSuccess } = useGetMyInProgressReports({})

    useEffect(() => {
        if (!isSuccess || !data?.length) return

        data.forEach((report) => {
            appendReport(report.id, onReportUpdate)
        })
    }, [data, isSuccess, appendReport, onReportUpdate])
}
export const ReportListenerHeadless = () => {
    const reports = useReportListenerStore((s) => s.reports)
    const removeReport = useReportListenerStore((s) => s.removeReport)

    useInitReportListener()

    const reportIds = Object.keys(reports)

    return (
        <>
            {reportIds.map((id) => {
                const eventName = `live.${id}`

                return (
                    <ReportListenerItem
                        eventName={eventName}
                        id={id}
                        key={id}
                        onDone={() => {
                            removeReport(id)
                        }}
                    />
                )
            })}
        </>
    )
}

const ReportListenerItem = ({
    id,
    eventName,
    onDone,
}: {
    id: string
    eventName: string
    onDone: () => void
}) => {
    const entry = useReportListenerStore((s) => s.reports[id])

    useSubscribe('generated_report', eventName, (data: IGeneratedReport) => {
        entry?.callback?.(data)

        if (data.status === 'completed' || data.status === 'failed') {
            if (data.status === 'completed')
                toast.success(`Completed report generation ${data.name}`, {
                    action: (
                        <Button
                            onClick={() =>
                                useReportViewerStore.getState().open({
                                    reportId: data.id,
                                    defaultReport: data,
                                })
                            }
                        >
                            View
                        </Button>
                    ),
                })
            else
                toast.success(`Report generation ${data.name} failed`, {
                    description: data.system_message,
                    action: (
                        <Button
                            onClick={() =>
                                useReportViewerStore.getState().open({
                                    reportId: data.id,
                                    defaultReport: data,
                                })
                            }
                        >
                            View
                        </Button>
                    ),
                })
            onDone()
        }
    })

    useEffect(() => {
        return () => {
            onDone()
        }
    }, [onDone])

    return null
}
