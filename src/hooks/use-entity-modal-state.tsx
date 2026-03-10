import { useState } from 'react'

export type TModalMode = 'view' | 'edit' | 'create'

export const useEntityModal = <T,>() => {
    const [open, onOpenChange] = useState(false)
    const [mode, setMode] = useState<TModalMode>('view')
    const [data, setData] = useState<T | null>(null)

    const create = () => {
        setMode('create')
        setData(null)
        onOpenChange(true)
    }

    const view = (value: T) => {
        setMode('view')
        setData(value)
        onOpenChange(true)
    }

    const edit = (value: T) => {
        setMode('edit')
        setData(value)
        onOpenChange(true)
    }

    const close = () => {
        onOpenChange(false)
        setData(null)
    }

    return {
        open,
        mode,
        data,
        onOpenChange,
        create,
        view,
        edit,
        close,
    }
}
