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
    autoThemeEnabled: boolean
    lightModeTime: string
    darkModeTime: string
    manualOverride: boolean
    setTheme: (theme: Theme) => void
    setCustomTheme: (themeName: string) => void
    setAnimationVariant: (variant: AnimationVariant) => void
    setMouseTrailEnabled: (enabled: boolean) => void
    setAutoThemeEnabled: (enabled: boolean) => void
    setLightModeTime: (time: string) => void
    setDarkModeTime: (time: string) => void
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
    autoThemeEnabled: false,
    lightModeTime: '07:00',
    darkModeTime: '17:00',
    manualOverride: false,
    setTheme: () => null,
    setCustomTheme: () => null,
    setAnimationVariant: () => null,
    setMouseTrailEnabled: () => null,
    setAutoThemeEnabled: () => null,
    setLightModeTime: () => null,
    setDarkModeTime: () => null,
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
    const [autoThemeEnabled, setAutoThemeEnabledState] = useState<boolean>(
        () => {
            const stored = localStorage.getItem('ecoop-auto-theme-enabled')
            return stored !== null ? stored === 'true' : false
        }
    )
    const [lightModeTime, setLightModeTimeState] = useState<string>(() => {
        return localStorage.getItem('ecoop-light-mode-time') || '07:00'
    })
    const [darkModeTime, setDarkModeTimeState] = useState<string>(() => {
        return localStorage.getItem('ecoop-dark-mode-time') || '17:00'
    })
    const [manualOverride, setManualOverride] = useState<boolean>(() => {
        const stored = localStorage.getItem('ecoop-manual-override')
        const storedTime = localStorage.getItem('ecoop-manual-override-time')

        if (stored === 'true' && storedTime) {
            const overrideTime = parseInt(storedTime, 10)
            const now = Date.now()

            // Clear override if it's been more than 30 minutes
            if (now - overrideTime > 30 * 60 * 1000) {
                localStorage.removeItem('ecoop-manual-override')
                localStorage.removeItem('ecoop-manual-override-time')
                return false
            }
            return true
        }
        return false
    })

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

    const setAutoThemeEnabled = useCallback((enabled: boolean) => {
        setAutoThemeEnabledState(enabled)
        localStorage.setItem('ecoop-auto-theme-enabled', enabled.toString())

        // Clear manual override when auto theme is re-enabled
        if (enabled) {
            setManualOverride(false)
            localStorage.removeItem('ecoop-manual-override')
            localStorage.removeItem('ecoop-manual-override-time')
        }
    }, [])

    const setLightModeTime = useCallback((time: string) => {
        setLightModeTimeState(time)
        localStorage.setItem('ecoop-light-mode-time', time)
    }, [])

    const setDarkModeTime = useCallback((time: string) => {
        setDarkModeTimeState(time)
        localStorage.setItem('ecoop-dark-mode-time', time)
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

    // Automatic theme switching based on time
    useEffect(() => {
        if (!autoThemeEnabled || manualOverride) return

        const checkTimeAndUpdateTheme = () => {
            const now = new Date()
            const currentTime = now.getHours() * 60 + now.getMinutes()

            const [lightHour, lightMinute] = lightModeTime
                .split(':')
                .map(Number)
            const [darkHour, darkMinute] = darkModeTime.split(':').map(Number)

            const lightTime = lightHour * 60 + lightMinute
            const darkTime = darkHour * 60 + darkMinute

            let shouldBeDark = false

            if (lightTime < darkTime) {
                // Normal case: light mode in morning, dark mode in evening
                shouldBeDark =
                    currentTime >= darkTime || currentTime < lightTime
            } else {
                // Edge case: dark mode time is before light mode time (crosses midnight)
                shouldBeDark =
                    currentTime >= darkTime && currentTime < lightTime
            }

            const targetTheme: Theme = shouldBeDark ? 'dark' : 'light'

            if (theme !== targetTheme) {
                localStorage.setItem(storageKey, targetTheme)
                setTheme(targetTheme)
            }
        }

        // Check immediately
        checkTimeAndUpdateTheme()

        // Check every minute
        const interval = setInterval(checkTimeAndUpdateTheme, 60000)

        return () => clearInterval(interval)
    }, [
        autoThemeEnabled,
        manualOverride,
        lightModeTime,
        darkModeTime,
        theme,
        storageKey,
    ])
    const value = {
        theme,
        resolvedTheme,
        customTheme,
        animationVariant,
        mouseTrailEnabled,
        autoThemeEnabled,
        lightModeTime,
        darkModeTime,
        manualOverride,
        setTheme: (theme: Theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)

            // Set manual override flag when theme is manually changed
            if (autoThemeEnabled && (theme === 'light' || theme === 'dark')) {
                setManualOverride(true)
                localStorage.setItem('ecoop-manual-override', 'true')
                localStorage.setItem(
                    'ecoop-manual-override-time',
                    Date.now().toString()
                )

                // Clear manual override after 30 minutes
                setTimeout(
                    () => {
                        setManualOverride(false)
                        localStorage.removeItem('ecoop-manual-override')
                        localStorage.removeItem('ecoop-manual-override-time')
                    },
                    30 * 60 * 1000
                )
            }
        },
        setCustomTheme,
        setAnimationVariant,
        setMouseTrailEnabled,
        setAutoThemeEnabled,
        setLightModeTime,
        setDarkModeTime,
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
