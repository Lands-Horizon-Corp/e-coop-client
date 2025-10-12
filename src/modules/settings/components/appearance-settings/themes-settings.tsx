import { useCallback, useEffect, useMemo, useState } from 'react'

import Fuse from 'fuse.js'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import Themes from '@/modules/settings/data/themes.json'

import { PaintIcon, XIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

import { IClassProps } from '@/types'

import { useTheme } from '../../provider/theme-provider'

interface Props extends IClassProps {}

interface CustomTheme {
    name: string
    colors: {
        light: Record<string, string | undefined>
        dark: Record<string, string | undefined>
    }
}

const ThemesSettings = ({ className }: Props) => {
    const {
        resolvedTheme,
        customTheme,
        setCustomTheme,
        applyCustomThemeColors,
        mouseTrailEnabled,
        setMouseTrailEnabled,
        autoThemeEnabled,
        setAutoThemeEnabled,
        lightModeTime,
        setLightModeTime,
        darkModeTime,
        setDarkModeTime,
    } = useTheme()
    const [selectedTheme, setSelectedTheme] = useState<string>(customTheme)
    const [currentMode, setCurrentMode] = useState<'light' | 'dark'>(
        resolvedTheme
    )
    const [searchQuery, setSearchQuery] = useState<string>('')

    const sortedThemes = useMemo(() => {
        return [...Themes].sort((a, b) => a.name.localeCompare(b.name))
    }, [])

    const fuse = useMemo(() => {
        return new Fuse(sortedThemes, {
            keys: ['name'],
            threshold: 0.3,
            includeScore: true,
        })
    }, [sortedThemes])

    const filteredThemes = useMemo(() => {
        if (!searchQuery.trim()) {
            return sortedThemes
        }

        const results = fuse.search(searchQuery)
        return results.map((result) => result.item)
    }, [searchQuery, fuse, sortedThemes])

    const applyCustomTheme = useCallback(
        (theme: CustomTheme) => {
            // Apply the theme colors first
            applyCustomThemeColors(
                {
                    light: Object.fromEntries(
                        Object.entries(theme.colors.light).map(([k, v]) => [
                            k,
                            v ?? '',
                        ])
                    ),
                    dark: Object.fromEntries(
                        Object.entries(theme.colors.dark).map(([k, v]) => [
                            k,
                            v ?? '',
                        ])
                    ),
                },
                theme.name
            )

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

    const resetToDefault = useCallback(() => {
        const defaultTheme = sortedThemes.find(
            (theme) => theme.name === 'Default'
        )
        if (defaultTheme) {
            applyCustomTheme(defaultTheme)
            toast.success('Reset to Default theme')
        }
    }, [sortedThemes, applyCustomTheme])

    const clearSearch = useCallback(() => {
        setSearchQuery('')
    }, [])

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

            {/* Mouse Trail Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="space-y-1">
                    <p className="text-sm font-medium">Mouse Trail Effect</p>
                    <p className="text-xs text-muted-foreground">
                        Enable animated cursor trail that follows your mouse
                        movement
                    </p>
                </div>
                <Switch
                    checked={mouseTrailEnabled}
                    onCheckedChange={setMouseTrailEnabled}
                />
            </div>

            {/* Automatic Theme Switching */}
            <div className="space-y-4 p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">
                            Automatic Theme Switching
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Automatically switch between light and dark modes
                            based on time
                        </p>
                    </div>
                    <Switch
                        checked={autoThemeEnabled}
                        onCheckedChange={setAutoThemeEnabled}
                    />
                </div>

                {autoThemeEnabled && (
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Light Mode Time
                            </label>
                            <Input
                                className="text-sm"
                                onChange={(e) =>
                                    setLightModeTime(e.target.value)
                                }
                                type="time"
                                value={lightModeTime}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">
                                Dark Mode Time
                            </label>
                            <Input
                                className="text-sm"
                                onChange={(e) =>
                                    setDarkModeTime(e.target.value)
                                }
                                type="time"
                                value={darkModeTime}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Search Input and Reset Button */}
            <div className="flex gap-3 items-center">
                <div className="flex-1 max-w-sm relative">
                    <Input
                        className="w-full pr-8"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search themes..."
                        type="text"
                        value={searchQuery}
                    />
                    {searchQuery && (
                        <Button
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                            onClick={clearSearch}
                            size="sm"
                            variant="ghost"
                        >
                            <XIcon className="h-3 w-3" />
                        </Button>
                    )}
                </div>
                <Button
                    className="whitespace-nowrap"
                    disabled={selectedTheme === 'Default'}
                    onClick={resetToDefault}
                    size="sm"
                    variant="outline"
                >
                    Reset to Default
                </Button>
            </div>

            {/* No results message */}
            {searchQuery.trim() && filteredThemes.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    <p>No themes found matching "{searchQuery}"</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 gap-y-10">
                {filteredThemes.map((theme) => (
                    <div className="space-y-2" key={theme.name}>
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
                            <p className="text-xs text-muted-foreground">
                                {theme.name}
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
                    application. When automatic theme switching is enabled, the
                    system will override manual theme selection based on your
                    configured times.
                </p>
            </div>
        </div>
    )
}

export default ThemesSettings
