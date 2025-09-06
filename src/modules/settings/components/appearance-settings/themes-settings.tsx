import { useCallback, useEffect, useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'

import { PaintIcon } from '@/components/icons'

import { IClassProps } from '@/types'

import { useTheme } from '../../provider/theme-provider'

interface Props extends IClassProps {}

interface CustomTheme {
    name: string
    colors: {
        light: Record<string, string>
        dark: Record<string, string>
    }
}

const predefinedThemes: CustomTheme[] = [
    {
        name: 'Default',
        colors: {
            light: {
                '--background': '#f0f8ff',
                '--foreground': '#374151',
                '--card': '#ffffff',
                '--card-foreground': '#374151',
                '--popover': '#ffffff',
                '--popover-foreground': '#374151',
                '--primary': '#22c55e',
                '--primary-foreground': '#ffffff',
                '--secondary': '#e0f2fe',
                '--secondary-foreground': '#4b5563',
                '--muted': '#f3f4f6',
                '--muted-foreground': '#6b7280',
                '--accent': '#d1fae5',
                '--accent-foreground': '#374151',
                '--destructive': '#ef4444',
                '--destructive-foreground': '#ffffff',
                '--border': '#e5e7eb',
                '--input': '#e5e7eb',
                '--ring': '#22c55e',
                '--chart-1': '#22c55e',
                '--chart-2': '#10b981',
                '--chart-3': '#059669',
                '--chart-4': '#047857',
                '--chart-5': '#065f46',
                '--sidebar': '#e0f2fe',
                '--sidebar-foreground': '#374151',
                '--sidebar-primary': '#22c55e',
                '--sidebar-primary-foreground': '#ffffff',
                '--sidebar-accent': '#d1fae5',
                '--sidebar-accent-foreground': '#374151',
                '--sidebar-border': '#e5e7eb',
                '--sidebar-ring': '#22c55e',
                '--font-sans': 'DM Sans, sans-serif',
                '--font-serif': 'Lora, serif',
                '--font-mono': 'IBM Plex Mono, monospace',
                '--radius': '0.5rem',
                '--shadow-2xs': '0px 4px 8px -1px hsl(0 0% 0% / 0.05)',
                '--shadow-xs': '0px 4px 8px -1px hsl(0 0% 0% / 0.05)',
                '--shadow-sm':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)',
                '--shadow':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-md':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 2px 4px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-lg':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 4px 6px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-xl':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 8px 10px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-2xl': '0px 4px 8px -1px hsl(0 0% 0% / 0.25)',
                '--tracking-normal': '0em',
                '--spacing': '0.25rem',
            },
            dark: {
                '--background': '#0f172a',
                '--foreground': '#d1d5db',
                '--card': '#1e293b',
                '--card-foreground': '#d1d5db',
                '--popover': '#1e293b',
                '--popover-foreground': '#d1d5db',
                '--primary': '#34d399',
                '--primary-foreground': '#0f172a',
                '--secondary': '#2d3748',
                '--secondary-foreground': '#a1a1aa',
                '--muted': '#1e293b',
                '--muted-foreground': '#6b7280',
                '--accent': '#374151',
                '--accent-foreground': '#a1a1aa',
                '--destructive': '#ef4444',
                '--destructive-foreground': '#0f172a',
                '--border': '#4b5563',
                '--input': '#4b5563',
                '--ring': '#34d399',
                '--chart-1': '#34d399',
                '--chart-2': '#2dd4bf',
                '--chart-3': '#22c55e',
                '--chart-4': '#10b981',
                '--chart-5': '#059669',
                '--sidebar': '#1e293b',
                '--sidebar-foreground': '#d1d5db',
                '--sidebar-primary': '#34d399',
                '--sidebar-primary-foreground': '#0f172a',
                '--sidebar-accent': '#374151',
                '--sidebar-accent-foreground': '#a1a1aa',
                '--sidebar-border': '#4b5563',
                '--sidebar-ring': '#34d399',
                '--font-sans': 'DM Sans, sans-serif',
                '--font-serif': 'Lora, serif',
                '--font-mono': 'IBM Plex Mono, monospace',
                '--radius': '0.5rem',
                '--shadow-2xs': '0px 4px 8px -1px hsl(0 0% 0% / 0.05)',
                '--shadow-xs': '0px 4px 8px -1px hsl(0 0% 0% / 0.05)',
                '--shadow-sm':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)',
                '--shadow':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-md':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 2px 4px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-lg':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 4px 6px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-xl':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 8px 10px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-2xl': '0px 4px 8px -1px hsl(0 0% 0% / 0.25)',
                '--tracking-normal': '0em',
                '--spacing': '0.25rem',
            },
        },
    },
    {
        name: 'Black & White',
        colors: {
            light: {
                '--background': '#ffffff',
                '--foreground': '#0a0a0a',
                '--card': '#ffffff',
                '--card-foreground': '#0a0a0a',
                '--popover': '#ffffff',
                '--popover-foreground': '#0a0a0a',
                '--primary': '#171717',
                '--primary-foreground': '#fafafa',
                '--secondary': '#f5f5f5',
                '--secondary-foreground': '#171717',
                '--muted': '#f5f5f5',
                '--muted-foreground': '#737373',
                '--accent': '#f5f5f5',
                '--accent-foreground': '#171717',
                '--destructive': '#e7000b',
                '--destructive-foreground': '#ffffff',
                '--border': '#e5e5e5',
                '--input': '#e5e5e5',
                '--ring': '#a1a1a1',
                '--chart-1': '#91c5ff',
                '--chart-2': '#3a81f6',
                '--chart-3': '#2563ef',
                '--chart-4': '#1a4eda',
                '--chart-5': '#1f3fad',
                '--sidebar': '#fafafa',
                '--sidebar-foreground': '#0a0a0a',
                '--sidebar-primary': '#171717',
                '--sidebar-primary-foreground': '#fafafa',
                '--sidebar-accent': '#f5f5f5',
                '--sidebar-accent-foreground': '#171717',
                '--sidebar-border': '#e5e5e5',
                '--sidebar-ring': '#a1a1a1',
                '--font-sans':
                    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                '--font-serif':
                    'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
                '--font-mono':
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                '--radius': '0.625rem',
                '--shadow-2xs': '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
                '--shadow-xs': '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
                '--shadow-sm':
                    '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
                '--shadow':
                    '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
                '--shadow-md':
                    '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)',
                '--shadow-lg':
                    '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)',
                '--shadow-xl':
                    '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)',
                '--shadow-2xl': '0 1px 3px 0px hsl(0 0% 0% / 0.25)',
                '--tracking-normal': '0em',
                '--spacing': '0.25rem',
            },
            dark: {
                '--background': '#0a0a0a',
                '--foreground': '#fafafa',
                '--card': '#171717',
                '--card-foreground': '#fafafa',
                '--popover': '#262626',
                '--popover-foreground': '#fafafa',
                '--primary': '#e5e5e5',
                '--primary-foreground': '#171717',
                '--secondary': '#262626',
                '--secondary-foreground': '#fafafa',
                '--muted': '#262626',
                '--muted-foreground': '#a1a1a1',
                '--accent': '#404040',
                '--accent-foreground': '#fafafa',
                '--destructive': '#ff6467',
                '--destructive-foreground': '#fafafa',
                '--border': '#282828',
                '--input': '#343434',
                '--ring': '#737373',
                '--chart-1': '#91c5ff',
                '--chart-2': '#3a81f6',
                '--chart-3': '#2563ef',
                '--chart-4': '#1a4eda',
                '--chart-5': '#1f3fad',
                '--sidebar': '#171717',
                '--sidebar-foreground': '#fafafa',
                '--sidebar-primary': '#1447e6',
                '--sidebar-primary-foreground': '#fafafa',
                '--sidebar-accent': '#262626',
                '--sidebar-accent-foreground': '#fafafa',
                '--sidebar-border': '#282828',
                '--sidebar-ring': '#525252',
                '--font-sans':
                    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                '--font-serif':
                    'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
                '--font-mono':
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                '--radius': '0.625rem',
                '--shadow-2xs': '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
                '--shadow-xs': '0 1px 3px 0px hsl(0 0% 0% / 0.05)',
                '--shadow-sm':
                    '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
                '--shadow':
                    '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)',
                '--shadow-md':
                    '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)',
                '--shadow-lg':
                    '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)',
                '--shadow-xl':
                    '0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)',
                '--shadow-2xl': '0 1px 3px 0px hsl(0 0% 0% / 0.25)',
                '--tracking-normal': '0em',
                '--spacing': '0.25rem',
            },
        },
    },
    {
        name: 'Amber Minimal',
        colors: {
            light: {
                '--background': '#ffffff',
                '--foreground': '#262626',
                '--card': '#ffffff',
                '--card-foreground': '#262626',
                '--popover': '#ffffff',
                '--popover-foreground': '#262626',
                '--primary': '#f59e0b',
                '--primary-foreground': '#000000',
                '--secondary': '#f3f4f6',
                '--secondary-foreground': '#4b5563',
                '--muted': '#f9fafb',
                '--muted-foreground': '#6b7280',
                '--accent': '#fffbeb',
                '--accent-foreground': '#92400e',
                '--destructive': '#ef4444',
                '--destructive-foreground': '#ffffff',
                '--border': '#e5e7eb',
                '--input': '#e5e7eb',
                '--ring': '#f59e0b',
                '--chart-1': '#f59e0b',
                '--chart-2': '#d97706',
                '--chart-3': '#b45309',
                '--chart-4': '#92400e',
                '--chart-5': '#78350f',
                '--sidebar': '#f9fafb',
                '--sidebar-foreground': '#262626',
                '--sidebar-primary': '#f59e0b',
                '--sidebar-primary-foreground': '#ffffff',
                '--sidebar-accent': '#fffbeb',
                '--sidebar-accent-foreground': '#92400e',
                '--sidebar-border': '#e5e7eb',
                '--sidebar-ring': '#f59e0b',
                '--font-sans': 'Inter, sans-serif',
                '--font-serif': 'Source Serif 4, serif',
                '--font-mono': 'JetBrains Mono, monospace',
                '--radius': '0.375rem',
                '--shadow-2xs': '0px 4px 8px -1px hsl(0 0% 0% / 0.05)',
                '--shadow-xs': '0px 4px 8px -1px hsl(0 0% 0% / 0.05)',
                '--shadow-sm':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)',
                '--shadow':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-md':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 2px 4px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-lg':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 4px 6px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-xl':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 8px 10px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-2xl': '0px 4px 8px -1px hsl(0 0% 0% / 0.25)',
                '--tracking-normal': '0em',
                '--spacing': '0.25rem',
            },
            dark: {
                '--background': '#171717',
                '--foreground': '#e5e5e5',
                '--card': '#262626',
                '--card-foreground': '#e5e5e5',
                '--popover': '#262626',
                '--popover-foreground': '#e5e5e5',
                '--primary': '#f59e0b',
                '--primary-foreground': '#000000',
                '--secondary': '#262626',
                '--secondary-foreground': '#e5e5e5',
                '--muted': '#262626',
                '--muted-foreground': '#a3a3a3',
                '--accent': '#92400e',
                '--accent-foreground': '#fde68a',
                '--destructive': '#ef4444',
                '--destructive-foreground': '#ffffff',
                '--border': '#404040',
                '--input': '#404040',
                '--ring': '#f59e0b',
                '--chart-1': '#fbbf24',
                '--chart-2': '#d97706',
                '--chart-3': '#92400e',
                '--chart-4': '#b45309',
                '--chart-5': '#92400e',
                '--sidebar': '#0f0f0f',
                '--sidebar-foreground': '#e5e5e5',
                '--sidebar-primary': '#f59e0b',
                '--sidebar-primary-foreground': '#ffffff',
                '--sidebar-accent': '#92400e',
                '--sidebar-accent-foreground': '#fde68a',
                '--sidebar-border': '#404040',
                '--sidebar-ring': '#f59e0b',
                '--font-sans': 'Inter, sans-serif',
                '--font-serif': 'Source Serif 4, serif',
                '--font-mono': 'JetBrains Mono, monospace',
                '--radius': '0.375rem',
                '--shadow-2xs': '0px 4px 8px -1px hsl(0 0% 0% / 0.05)',
                '--shadow-xs': '0px 4px 8px -1px hsl(0 0% 0% / 0.05)',
                '--shadow-sm':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)',
                '--shadow':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-md':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 2px 4px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-lg':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 4px 6px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-xl':
                    '0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 8px 10px -2px hsl(0 0% 0% / 0.10)',
                '--shadow-2xl': '0px 4px 8px -1px hsl(0 0% 0% / 0.25)',
                '--tracking-normal': '0em',
                '--spacing': '0.25rem',
            },
        },
    },
]

const ThemesSettings = ({ className }: Props) => {
    const {
        resolvedTheme,
        customTheme,
        setCustomTheme,
        applyCustomThemeColors,
    } = useTheme()
    const [selectedTheme, setSelectedTheme] = useState<string>(customTheme)
    const [currentMode, setCurrentMode] = useState<'light' | 'dark'>(
        resolvedTheme
    )

    const applyCustomTheme = useCallback(
        (theme: CustomTheme) => {
            // Apply the theme colors first
            applyCustomThemeColors(theme.colors, theme.name)

            // Then update the state
            setSelectedTheme(theme.name)
            setCustomTheme(theme.name)

            toast.success(
                `Applied ${theme.name} theme${
                    currentMode === 'dark' ? ' (Dark Mode)' : ' (Light Mode)'
                }`
            )
        },
        [applyCustomThemeColors, setCustomTheme, currentMode]
    )

    // Sync with theme provider
    useEffect(() => {
        setSelectedTheme(customTheme)
    }, [customTheme])

    useEffect(() => {
        setCurrentMode(resolvedTheme)
    }, [resolvedTheme])

    return (
        <div className={cn('flex flex-col gap-y-4 flex-1 w-full', className)}>
            <div>
                <p className="text-lg">Custom Themes</p>
                <p className="text-muted-foreground text-sm">
                    Choose from predefined color themes that work in both light
                    and dark modes
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {predefinedThemes.map((theme) => (
                    <div key={theme.name} className="space-y-2">
                        <div
                            className={cn(
                                'relative overflow-hidden rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105',
                                selectedTheme === theme.name
                                    ? 'border-primary shadow-lg'
                                    : 'border-border hover:border-muted-foreground'
                            )}
                            onClick={() => applyCustomTheme(theme)}
                        >
                            {/* Light Mode Preview - Top Half */}
                            <div
                                className="h-16 p-2 space-y-1 border-b border-border/50"
                                style={{
                                    backgroundColor:
                                        theme.colors.light['--background'],
                                    color: theme.colors.light['--foreground'],
                                }}
                            >
                                <div className="flex gap-1 items-center">
                                    <PaintIcon
                                        className="h-2 w-2"
                                        style={{
                                            color: theme.colors.light[
                                                '--primary'
                                            ],
                                        }}
                                    />
                                    <div
                                        className="h-2 w-4 rounded-sm"
                                        style={{
                                            backgroundColor:
                                                theme.colors.light['--primary'],
                                        }}
                                    />
                                    <div
                                        className="h-2 w-3 rounded-sm"
                                        style={{
                                            backgroundColor:
                                                theme.colors.light[
                                                    '--secondary'
                                                ],
                                        }}
                                    />
                                </div>
                                <div
                                    className="h-4 rounded border"
                                    style={{
                                        backgroundColor:
                                            theme.colors.light['--card'],
                                        borderColor:
                                            theme.colors.light['--border'],
                                    }}
                                >
                                    <div
                                        className="h-1 w-2/3 m-1 rounded-sm"
                                        style={{
                                            backgroundColor:
                                                theme.colors.light['--accent'],
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Dark Mode Preview - Bottom Half */}
                            <div
                                className="h-16 p-2 space-y-1"
                                style={{
                                    backgroundColor:
                                        theme.colors.dark['--background'],
                                    color: theme.colors.dark['--foreground'],
                                }}
                            >
                                <div className="flex gap-1 items-center">
                                    <PaintIcon
                                        className="h-2 w-2"
                                        style={{
                                            color: theme.colors.dark[
                                                '--primary'
                                            ],
                                        }}
                                    />
                                    <div
                                        className="h-2 w-4 rounded-sm"
                                        style={{
                                            backgroundColor:
                                                theme.colors.dark['--primary'],
                                        }}
                                    />
                                    <div
                                        className="h-2 w-3 rounded-sm"
                                        style={{
                                            backgroundColor:
                                                theme.colors.dark[
                                                    '--secondary'
                                                ],
                                        }}
                                    />
                                </div>
                                <div
                                    className="h-4 rounded border"
                                    style={{
                                        backgroundColor:
                                            theme.colors.dark['--card'],
                                        borderColor:
                                            theme.colors.dark['--border'],
                                    }}
                                >
                                    <div
                                        className="h-1 w-2/3 m-1 rounded-sm"
                                        style={{
                                            backgroundColor:
                                                theme.colors.dark['--accent'],
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Selected indicator */}
                            {selectedTheme === theme.name && (
                                <div className="absolute top-1 right-1">
                                    <div className="size-2 rounded-full bg-primary" />
                                </div>
                            )}

                            {/* Light/Dark mode labels */}
                            <div className="absolute left-1 top-1">
                                <div className="text-[8px] font-medium opacity-60">
                                    Light
                                </div>
                            </div>
                            <div className="absolute left-1 bottom-1">
                                <div className="text-[8px] font-medium opacity-60">
                                    Dark
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="font-medium">{theme.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {theme.name === 'Default'
                                    ? 'Original colors (Light & Dark)'
                                    : `${theme.name.split(' ')[0]} theme (Both modes)`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Custom themes include all CSS
                    variables (colors, shadows, fonts, radius, etc.) and
                    automatically adapt to your current light/dark mode setting.
                    Theme preferences are saved and will persist across
                    sessions. Changes are applied instantly to the entire
                    application.
                </p>
            </div>
        </div>
    )
}

export default ThemesSettings
