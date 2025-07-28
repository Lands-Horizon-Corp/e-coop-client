import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    resolvedTheme: ResolvedTheme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: 'system',
    resolvedTheme: 'light',
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export const ThemeProvider = ({
    children,
    defaultTheme = 'system',
    storageKey = 'vite-ui-theme',
    ...props
}: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')

    const removeClassTheme = (root: HTMLElement) => {
        if (!root) return
        root.classList.remove('light', 'dark')
    }

    const handleSetTheme = (root: HTMLElement, theme: Theme) => {
        if (!root) return

        if (theme === 'light') setResolvedTheme('light')
        else setResolvedTheme('dark')

        root.classList.add(theme)
    }

    useEffect(() => {
        const root = window.document.documentElement
        removeClassTheme(root)

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleThemeChange = (event: MediaQueryListEvent) => {
            removeClassTheme(root)
            if (event.matches) handleSetTheme(root, 'dark')
            else handleSetTheme(root, 'light')
        }

        if (theme === 'system') {
            mediaQuery.addEventListener('change', handleThemeChange)
            const systemTheme = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches
                ? 'dark'
                : 'light'

            handleSetTheme(root, systemTheme)
            root.classList.add(systemTheme)
            return
        }

        handleSetTheme(root, theme)

        return () => {
            mediaQuery.removeEventListener('change', handleThemeChange)
        }
    }, [theme])

    const value = {
        theme,
        resolvedTheme,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider')

    return context
}
