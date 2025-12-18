import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

import {
    getLocalStorage,
    removeLocalStorage,
    setLocalStorage,
    useLocalStorage,
} from '@/hooks/use-localstorage'

export type Theme = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'
export type AnimationVariant = 'circle' | 'circle-blur' | 'polygon' | 'gif'

export type CustomThemeColors = {
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
    theme: 'dark', // Changed from 'system' to 'dark'
    resolvedTheme: 'dark', // Changed from 'light' to 'dark'
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
    defaultTheme = 'dark', // Changed from 'system' to 'dark'
    storageKey = 'ecoop-system-theme',
    ...props
}: ThemeProviderProps) => {
    const [theme, setThemeState] = useLocalStorage<Theme>(
        storageKey,
        defaultTheme
    )
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark')
    const [customTheme, setCustomThemeState] = useLocalStorage<string>(
        'ecoop-custom-theme',
        'Default'
    )
    const [animationVariant, setAnimationVariantState] =
        useLocalStorage<AnimationVariant>('ecoop-animation-variant', 'circle')
    const [mouseTrailEnabled, setMouseTrailEnabledState] =
        useLocalStorage<boolean>('ecoop-mouse-trail-enabled', false)
    const [autoThemeEnabled, setAutoThemeEnabledState] =
        useLocalStorage<boolean>('ecoop-auto-theme-enabled', false)
    const [lightModeTime, setLightModeTimeState] = useLocalStorage<string>(
        'ecoop-light-mode-time',
        '07:00'
    )
    const [darkModeTime, setDarkModeTimeState] = useLocalStorage<string>(
        'ecoop-dark-mode-time',
        '17:00'
    )
    const [manualOverride, setManualOverride] = useLocalStorage<boolean>(
        'ecoop-manual-override',
        false
    )
    const [manualOverrideTime, setManualOverrideTime] = useLocalStorage<number>(
        'ecoop-manual-override-time',
        0
    )

    // Check and clear expired manual override
    useEffect(() => {
        if (manualOverride && manualOverrideTime) {
            const now = Date.now()
            if (now - manualOverrideTime > 30 * 60 * 1000) {
                setManualOverride(false)
                setManualOverrideTime(0)
            }
        }
    }, [
        manualOverride,
        manualOverrideTime,
        setManualOverride,
        setManualOverrideTime,
    ])

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

    const setCustomTheme = useCallback(
        (themeName: string) => {
            setCustomThemeState(themeName)
        },
        [setCustomThemeState]
    )

    const setAnimationVariant = useCallback(
        (variant: AnimationVariant) => {
            setAnimationVariantState(variant)
        },
        [setAnimationVariantState]
    )

    const setMouseTrailEnabled = useCallback(
        (enabled: boolean) => {
            setMouseTrailEnabledState(enabled)
        },
        [setMouseTrailEnabledState]
    )

    const setAutoThemeEnabled = useCallback(
        (enabled: boolean) => {
            setAutoThemeEnabledState(enabled)

            // Clear manual override when auto theme is re-enabled
            if (enabled) {
                setManualOverride(false)
                setManualOverrideTime(0)
            }
        },
        [setAutoThemeEnabledState, setManualOverride, setManualOverrideTime]
    )

    const setLightModeTime = useCallback(
        (time: string) => {
            setLightModeTimeState(time)
        },
        [setLightModeTimeState]
    )

    const setDarkModeTime = useCallback(
        (time: string) => {
            setDarkModeTimeState(time)
        },
        [setDarkModeTimeState]
    )

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
                setLocalStorage('ecoop-theme-colors', colors)
            } else {
                removeLocalStorage('ecoop-theme-colors')
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
                setThemeState(event.newValue as Theme)
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [storageKey])

    // Apply saved custom theme on mount and when resolved theme changes
    useEffect(() => {
        const savedCustomTheme = getLocalStorage<string>('ecoop-custom-theme')
        const savedThemeColors =
            getLocalStorage<CustomThemeColors>('ecoop-theme-colors')

        if (
            savedCustomTheme &&
            savedCustomTheme !== 'Default' &&
            savedThemeColors
        ) {
            try {
                const colors = savedThemeColors
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
                removeLocalStorage('ecoop-theme-colors')
                setLocalStorage('ecoop-custom-theme', 'Default')
                setCustomThemeState('Default')
            }
        }
    }, [resolvedTheme, customTheme, setCustomThemeState])

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
                setThemeState(targetTheme)
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
        setThemeState,
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
            setThemeState(theme)

            // Set manual override flag when theme is manually changed
            if (autoThemeEnabled && (theme === 'light' || theme === 'dark')) {
                setManualOverride(true)
                setManualOverrideTime(Date.now())

                // Clear manual override after 30 minutes
                setTimeout(
                    () => {
                        setManualOverride(false)
                        setManualOverrideTime(0)
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
