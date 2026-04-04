import { useState } from 'react'

export const useModalState = (defaultState: boolean = false) => {
    const [open, onOpenChange] = useState(defaultState)

    const openModal = () => onOpenChange(true)
    const close = () => onOpenChange(false)
    const toggle = () => onOpenChange((prev) => !prev)

    return { open, onOpenChange, openModal, close, toggle }
}
