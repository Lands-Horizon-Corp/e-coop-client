import { useState } from 'react'

export const useModalState = (defaultState: boolean = false) => {
    const [open, onOpenChange] = useState(defaultState)

    return { open, onOpenChange }
}
