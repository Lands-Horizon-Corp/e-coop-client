import { useCallback, useEffect, useMemo, useState } from 'react'

import Fuse from 'fuse.js'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import Themes from '@/modules/settings/data/themes.json'

import { PaintIcon } from '@/components/icons'
import { Input } from '@/components/ui/input'

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

            {/* Search Input */}
            <div className="w-full max-w-sm">
                <Input
                    type="text"
                    placeholder="Search themes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* No results message */}
            {searchQuery.trim() && filteredThemes.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                    <p>No themes found matching "{searchQuery}"</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {filteredThemes.map((theme) => (
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
