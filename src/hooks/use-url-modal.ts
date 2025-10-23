import { useEffect } from 'react'

import { useLocation, useNavigate, useSearch } from '@tanstack/react-router'

import { useModalState } from './use-modal-state'

interface UseUrlModalOptions {
    paramName: string
    defaultOpen?: boolean
}

export const useUrlModal = ({
    paramName,
    defaultOpen = false,
}: UseUrlModalOptions) => {
    const navigate = useNavigate()
    const location = useLocation()
    const search = useSearch({ strict: false }) as Record<string, any>
    const modal = useModalState(defaultOpen)

    const paramValue = search[paramName]
    const hasParam = !!paramValue

    useEffect(() => {
        modal.onOpenChange(hasParam)
    }, [hasParam, modal])

    const openWithParam = (value: string) => {
        navigate({
            to: location.pathname,
            search: {
                ...search,
                [paramName]: value,
            },
        })
    }

    const closeAndClearParam = () => {
        navigate({
            to: location.pathname,
            search: undefined,
            replace: true,
        })
    }

    const onOpenChange = (open: boolean) => {
        if (!open) {
            closeAndClearParam()
        }
    }

    return {
        isOpen: modal.open,
        paramValue: paramValue as string | undefined,
        openWithParam,
        closeAndClearParam,
        onOpenChange,
    }
}
