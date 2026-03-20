import { create } from 'zustand'

import { TEntityId } from '@/types'

import { GenerateReportViewerProps } from './generated-report-view'

type ReportViewerState = {
    isOpen: boolean
    reportProps?: GenerateReportViewerProps

    open: (config: GenerateReportViewerProps) => void
    close: () => void
    afterClose: () => void
    setReportId: (id: TEntityId) => void
}

export const useReportViewerStore = create<ReportViewerState>((set) => ({
    isOpen: false,
    reportProps: undefined,

    open: (data) =>
        set({
            isOpen: true,
            reportProps: data,
        }),

    close: () =>
        set({
            isOpen: false,
        }),

    afterClose: () =>
        set({
            reportProps: undefined,
        }),

    setReportId: (id) =>
        set((state) => {
            if (!state.reportProps) return state

            return {
                reportProps: {
                    ...state.reportProps,
                    reportId: id,
                },
            }
        }),
}))
