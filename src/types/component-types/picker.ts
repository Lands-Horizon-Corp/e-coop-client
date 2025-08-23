import { useModalState } from '@/hooks/use-modal-state'

export interface IPickerBaseProps<T = unknown> {
    value?: T
    onSelect?: (selected: T) => void

    disabled?: boolean
    placeholder?: string
    triggerClassName?: string
    modalState?: ReturnType<typeof useModalState>
}
