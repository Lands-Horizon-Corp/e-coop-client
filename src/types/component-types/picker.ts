import { ReactNode } from 'react'

import { useModalState } from '@/hooks/use-modal-state'

export interface IPickerBaseProps<T = unknown> {
    value?: T
    onSelect?: (selected: T) => void

    disabled?: boolean
    placeholder?: string
    triggerClassName?: string
    modalState?: ReturnType<typeof useModalState>

    customComponent?: ReactNode
    triggerVariant?:
        | 'ghost'
        | 'secondary'
        | 'outline'
        | 'link'
        | 'nostyle'
        | 'default'
        | 'destructive'
        | null
        | undefined
}
