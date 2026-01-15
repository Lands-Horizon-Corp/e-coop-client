import {
    IGeneratedReportRequest,
    TemplateOptions,
} from '@/modules/generated-report/generated-report.types'
import { create } from 'zustand'

import { IForm } from '@/types'

export type TGenerateReport = Pick<
    IForm<IGeneratedReportRequest>,
    'onSuccess' | 'onError'
>

export interface IGeneratedReportConfigState {
    request?: IGeneratedReportRequest
    templateConfig?: TemplateOptions

    // Actions
    setConfig: (payload: IGeneratedReportRequest) => void
    clear: () => void
}

export const useGeneratedReportConfigStore =
    create<IGeneratedReportConfigState>((set) => ({
        request: undefined,
        templateConfig: undefined,
        setConfig: (payload) => set({ request: payload }),
        clear: () => set({ request: undefined, templateConfig: undefined }),
    }))

export default useGeneratedReportConfigStore
