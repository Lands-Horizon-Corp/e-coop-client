import { useModalState } from '@/hooks/use-modal-state'

export interface IPickerBaseProps<T = unknown> {
    disabled?: boolean
    placeholder?: string
    triggerClassName?: string
    onSelect?: (selected: T) => void
    modalState?: ReturnType<typeof useModalState>
}
