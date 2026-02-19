import { createContext, useContext } from 'react'

// Use RefObject<HTMLDivElement> directly
export const ScrollContext =
    createContext<React.RefObject<HTMLDivElement> | null>(null)

export const useScrollContainer = () => {
    const context = useContext(ScrollContext)

    if (!context)
        throw new Error(
            'useScrollContainer must be used within ScrollContext.Provider'
        )
    return context
}
