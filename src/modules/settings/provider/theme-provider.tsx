import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

export type Theme = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'
export type AnimationVariant = 'circle' | 'circle-blur' | 'polygon' | 'gif'

type CustomThemeColors = {
    light: Record<string, string>
    dark: Record<string, string>
}

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    resolvedTheme: ResolvedTheme
    customTheme: string
    animationVariant: AnimationVariant
    mouseTrailEnabled: boolean
    setTheme: (theme: Theme) => void
    setCustomTheme: (themeName: string) => void
    setAnimationVariant: (variant: AnimationVariant) => void
    setMouseTrailEnabled: (enabled: boolean) => void
    applyCustomThemeColors: (
        colors: CustomThemeColors,
        themeName: string
    ) => void
}

const initialState: ThemeProviderState = {
    theme: 'system',
    resolvedTheme: 'light',
    customTheme: 'Default',
    animationVariant: 'circle',
    mouseTrailEnabled: true,
    setTheme: () => null,
    setCustomTheme: () => null,
    setAnimationVariant: () => null,
    setMouseTrailEnabled: () => null,
    applyCustomThemeColors: () => null,
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
    const [customTheme, setCustomThemeState] = useState<string>(() => {
        return localStorage.getItem('ecoop-custom-theme') || 'Default'
    })
    const [animationVariant, setAnimationVariantState] =
        useState<AnimationVariant>(() => {
            return (
                (localStorage.getItem(
                    'ecoop-animation-variant'
                ) as AnimationVariant) || 'circle'
            )
        })
    const [mouseTrailEnabled, setMouseTrailEnabledState] = useState<boolean>(
        () => {
            const stored = localStorage.getItem('ecoop-mouse-trail-enabled')
            return stored !== null ? stored === 'true' : false
        }
    )

    const removeClassTheme = useCallback((root: HTMLElement) => {
        if (!root) return
        root.classList.remove('light', 'dark')
    }, [])

    const handleSetTheme = useCallback((root: HTMLElement, theme: Theme) => {
        if (!root) return

        if (theme === 'light') setResolvedTheme('light')
        else setResolvedTheme('dark')

        root.classList.add(theme)
    }, [])

    const setCustomTheme = useCallback((themeName: string) => {
        setCustomThemeState(themeName)
        localStorage.setItem('ecoop-custom-theme', themeName)
    }, [])

    const setAnimationVariant = useCallback((variant: AnimationVariant) => {
        setAnimationVariantState(variant)
        localStorage.setItem('ecoop-animation-variant', variant)
    }, [])

    const setMouseTrailEnabled = useCallback((enabled: boolean) => {
        setMouseTrailEnabledState(enabled)
        localStorage.setItem('ecoop-mouse-trail-enabled', enabled.toString())
    }, [])

    const applyCustomThemeColors = useCallback(
        (colors: CustomThemeColors, themeName: string) => {
            const root = document.documentElement
            const modeColors = colors[resolvedTheme]

            // Clear any existing custom properties
            Object.keys(colors.light)
                .concat(Object.keys(colors.dark))
                .forEach((property) => {
                    root.style.removeProperty(property)
                })

            // Apply new colors if not default
            if (themeName !== 'Default') {
                Object.entries(modeColors).forEach(([property, value]) => {
                    root.style.setProperty(property, value)
                })
                localStorage.setItem(
                    'ecoop-theme-colors',
                    JSON.stringify(colors)
                )
            } else {
                localStorage.removeItem('ecoop-theme-colors')
            }
        },
        [resolvedTheme]
    )

    useEffect(() => {
        const root = window.document.documentElement
        removeClassTheme(root)

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleThemeChange = (event: MediaQueryListEvent) => {
            if (theme === 'system') {
                removeClassTheme(root)
                if (event.matches) handleSetTheme(root, 'dark')
                else handleSetTheme(root, 'light')
            }
        }

        if (theme === 'system') {
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleThemeChange)
            } else {
                mediaQuery.addListener(handleThemeChange) // Fallback for older browsers
            }

            const systemTheme = mediaQuery.matches ? 'dark' : 'light'
            handleSetTheme(root, systemTheme)
        } else {
            handleSetTheme(root, theme)
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleThemeChange)
            } else {
                mediaQuery.removeListener(handleThemeChange)
            }
        }
    }, [theme, removeClassTheme, handleSetTheme])

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === storageKey && event.newValue) {
                setTheme(event.newValue as Theme)
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [storageKey])

    // Apply saved custom theme on mount and when resolved theme changes
    useEffect(() => {
        const savedCustomTheme = localStorage.getItem('ecoop-custom-theme')
        const savedThemeColors = localStorage.getItem('ecoop-theme-colors')

        if (
            savedCustomTheme &&
            savedCustomTheme !== 'Default' &&
            savedThemeColors
        ) {
            try {
                const colors = JSON.parse(savedThemeColors) as CustomThemeColors
                const root = document.documentElement
                const modeColors = colors[resolvedTheme]

                // Clear any existing custom properties
                Object.keys(colors.light)
                    .concat(Object.keys(colors.dark))
                    .forEach((property) => {
                        root.style.removeProperty(property)
                    })

                // Apply new colors
                Object.entries(modeColors).forEach(([property, value]) => {
                    root.style.setProperty(property, value)
                })

                if (customTheme !== savedCustomTheme) {
                    setCustomThemeState(savedCustomTheme)
                }
            } catch {
                localStorage.removeItem('ecoop-theme-colors')
                localStorage.setItem('ecoop-custom-theme', 'Default')
                setCustomThemeState('Default')
            }
        }
    }, [resolvedTheme, customTheme])
    const value = {
        theme,
        resolvedTheme,
        customTheme,
        animationVariant,
        mouseTrailEnabled,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        },
        setCustomTheme,
        setAnimationVariant,
        setMouseTrailEnabled,
        applyCustomThemeColors,
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
