import { useCallback, useState } from 'react'

import { useHotkeys } from 'react-hotkeys-hook'

export type TKanbanMenuItem<T = string> = {
    name: string
    value: T
    icon: React.ReactNode
}

export type TUseSearchKanbanOptions<T> = {
    menuItems: TKanbanMenuItem<T>[]
    initialMode?: T | null
    initialSearchTerm?: string
    initialSearchAllModes?: boolean
}

export type TUseSearchKanbanReturn<T> = {
    selectedMode: T | null
    searchTerm: string
    searchAllModes: boolean
    selectedItem: TKanbanMenuItem<T> | null
    showSearch: boolean

    setSelectedMode: (mode: T | null) => void
    setSearchTerm: (term: string) => void
    setSearchAllModes: (value: boolean) => void
    handleClearSearch: () => void
    handleModeChange: (mode: T) => void
    handleSearchAllModesChange: (checked: boolean) => void
    resetAll: () => void

    isSearchActive: boolean
    isAllModesView: boolean
    isSingleModeView: boolean
}

export const useSearchKanban = <T extends string>({
    menuItems,
    initialMode = null,
    initialSearchTerm = '',
    initialSearchAllModes = false,
}: TUseSearchKanbanOptions<T>): TUseSearchKanbanReturn<T> => {
    const [selectedMode, setSelectedMode] = useState<T | null>(initialMode)
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm)
    const [searchAllModes, setSearchAllModes] = useState(initialSearchAllModes)

    const handleClearSearch = useCallback(() => {
        setSearchTerm('')
        setSearchAllModes(false)
    }, [])

    const handleModeChange = useCallback(
        (mode: T) => {
            if (selectedMode === mode) {
                setSelectedMode(null)
                setSearchTerm('')
                setSearchAllModes(false)
            } else {
                setSelectedMode(mode)
                setSearchAllModes(false)
            }
        },
        [selectedMode]
    )

    const handleSearchAllModesChange = useCallback((checked: boolean) => {
        setSearchAllModes(checked)
        if (checked) {
            setSelectedMode(null)
        } else {
            setSearchTerm('')
        }
    }, [])

    const resetAll = useCallback(() => {
        setSelectedMode(null)
        setSearchTerm('')
        setSearchAllModes(false)
    }, [])

    const selectedItem = selectedMode
        ? menuItems.find((item) => item.value === selectedMode) || null
        : null

    const showSearch = selectedMode !== null || searchAllModes
    const isSearchActive = searchTerm.length > 0
    const isAllModesView = selectedMode === null
    const isSingleModeView = selectedMode !== null

    useHotkeys(
        'esc',
        (e) => {
            e.preventDefault()
            setSelectedMode(null)
            handleClearSearch()
        },
        {
            enableOnFormTags: ['INPUT', 'SELECT', 'TEXTAREA'],
        }
    )

    useHotkeys(
        'enter',
        (e) => {
            e.preventDefault()
            setSearchAllModes(true)
            const searchInput = document.querySelector(
                'input[placeholder*="Search"]'
            ) as HTMLInputElement
            if (searchInput) {
                searchInput.focus()
            }
        },
        {
            keydown: true,
            keyup: true,
        }
    )

    return {
        // State
        selectedMode,
        searchTerm,
        searchAllModes,
        selectedItem,
        showSearch,

        // Actions
        setSelectedMode,
        setSearchTerm,
        setSearchAllModes,
        handleClearSearch,
        handleModeChange,
        handleSearchAllModesChange,
        resetAll,

        // Computed values
        isSearchActive,
        isAllModesView,
        isSingleModeView,
    }
}
