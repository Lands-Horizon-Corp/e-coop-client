import { create } from 'zustand'

import { IGeneratedReport } from '../../generated-report.types'

type TReportListenerCallback = (report: IGeneratedReport) => void

interface IReportListenerEntry {
    id: string
    callback?: TReportListenerCallback
}

interface IReportListenerStore {
    reports: Record<string, IReportListenerEntry>

    appendReport: (id: string, callback?: TReportListenerCallback) => void
    removeReport: (id: string) => void
    clearReports: () => void

    getReportIds: () => string[]
}

export const useReportListenerStore = create<IReportListenerStore>(
    (set, get) => ({
        reports: {},

        appendReport: (id, callback) =>
            set((state) => ({
                reports: {
                    ...state.reports,
                    [id]: { id, callback },
                },
            })),

        removeReport: (id) =>
            set((state) => {
                const next = { ...state.reports }
                delete next[id]
                return { reports: next }
            }),

        clearReports: () => set({ reports: {} }),

        getReportIds: () => Object.keys(get().reports),
    })
)
