import { toast } from 'sonner'

import useGeneratedReportConfigStore from '@/store/generated-report-config-store'

import { IForm } from '@/types'

import { useCreateGeneratedReport } from '../../generated-report.service'
import { IGeneratedReport } from '../../generated-report.types'

export type IUseGenerateReportProps = Pick<
    IForm<IGeneratedReport>,
    'onSuccess' | 'onError'
>

export const useGenerateReport = ({
    onSuccess,
    onError,
}: IUseGenerateReportProps = {}) => {
    const { mutateAsync: generateReport } = useCreateGeneratedReport({
        options: {
            onSuccess: (data) => {
                useGeneratedReportConfigStore.getState().clear()
                onSuccess?.(data)
            },
            onError: (err) => {
                toast.error('Failed to start report generation.')
                onError?.(err)
            },
        },
    })

    const { request } = useGeneratedReportConfigStore()

    const handleGenerateReport = async () => {
        if (!request) {
            throw new Error('No report request configuration found.')
        }
        return toast.promise(generateReport(request), {
            loading: 'Starting report generation...',
            success: 'Report generation initiated.',
            error: 'Failed to start report generation.',
        })
    }

    if (!request) return

    return { handleGenerateReport }
}
