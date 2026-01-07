import { useMemo, useState } from 'react'

import Fuse from 'fuse.js'

import { cn } from '@/helpers'
import Themes from '@/modules/settings/data/themes.json'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { FaMagnifyingGlass } from 'react-icons/fa6'

import {
    ArrowChevronDown,
    ArrowChevronUpIcon,
    CheckFillIcon,
    MoonIcon,
    SunMoonIcon,
    XIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useInternalState } from '@/hooks/use-internal-state'

import { useTheme } from '../provider/theme-provider'

interface ThemePickerProps extends IPickerBaseProps {}

const ThemePicker = ({
    onSelect,
    modalState,
    value = 'default',
}: ThemePickerProps) => {
    const { theme, setTheme } = useTheme()
    const [state, setState] = useInternalState(
        false,
        modalState?.open,
        modalState?.onOpenChange
    )

    const defaultValue = [...Themes].find(
        (item) => item.name.toLowerCase() === (value as string).toLowerCase()
    )

    const [selectedTheme, setSelectedTheme] = useState<TTheme | null>(
        defaultValue as TTheme
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

    const applyCustomTheme = (theme: TTheme) => {
        onSelect?.(theme.name)
        setSelectedTheme(theme)
        setState(false)
    }

    return (
        <div>
            <Popover modal onOpenChange={setState} open={state}>
                <PopoverTrigger
                    asChild
                    className="w-full selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                >
                    {selectedTheme ? (
                        <div className="flex items-center justify-between w-full ">
                            <ThemeResolver
                                className="px-0 py-1"
                                theme={selectedTheme}
                            />
                            <Button
                                className="max-h-fit !max-w-0"
                                onClick={(e) => {
                                    e.preventDefault()
                                    setSelectedTheme(null)
                                    onSelect?.('')
                                }}
                                size={'sm'}
                                variant={'ghost'}
                            >
                                <XIcon />
                            </Button>
                        </div>
                    ) : (
                        <p className="flex items-center justify-between w-full">
                            Select theme
                            <div>
                                {!state ? (
                                    <ArrowChevronDown className="size-4 opacity-50" />
                                ) : (
                                    <ArrowChevronUpIcon className="size-4 opacity-50" />
                                )}
                            </div>
                        </p>
                    )}
                </PopoverTrigger>
                <PopoverContent align="center" className="p-0 ">
                    <div className="flex px-3 py-1 items-center">
                        <div className="flex-1 max-w-sm relative flex items-center">
                            <FaMagnifyingGlass className="text-muted-foreground" />
                            <Input
                                className="w-full placeholder:text-xs pr-8 focus:!border-0 !bg-transparent border-0 focus-visible:border-0 focus-visible:ring-ring/0 focus-visible:ring-[0px]"
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search themes..."
                                type="text"
                                value={searchQuery}
                            />
                            {searchQuery && (
                                <Button
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setSearchQuery('')
                                    }}
                                    size="sm"
                                    variant="ghost"
                                >
                                    <XIcon className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="div flex px-3 py-1 justify-between">
                        <p className="text-sm text-muted-foreground">
                            {filteredThemes.length} themes
                        </p>
                        <div>
                            {theme === 'light' ? (
                                <SunMoonIcon
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setTheme('dark')
                                    }}
                                />
                            ) : (
                                <MoonIcon
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setTheme('light')
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <p className=" text-xs py-1.5 px-2 text-muted-foreground">
                        Built-in Themes
                    </p>
                    <ScrollArea className="grid grid-cols-1 p-1 h-52 gap-y-1 ">
                        {filteredThemes.map((theme) => (
                            <div className="hover:bg-secondary">
                                <ThemeResolver
                                    applyCustomTheme={applyCustomTheme}
                                    key={theme.name}
                                    selectedTheme={selectedTheme?.name}
                                    theme={theme as TTheme}
                                />
                            </div>
                        ))}
                    </ScrollArea>
                </PopoverContent>
            </Popover>
        </div>
    )
}
export type ThemeColors = {
    [key: `--${string}`]: string | undefined
}

export type CustomThemeColors = {
    light: ThemeColors
    dark: ThemeColors
}

export type TTheme = {
    name: string
    colors: CustomThemeColors
}

type TThemeResolverProps = {
    theme: TTheme
    selectedTheme?: string | null
    applyCustomTheme?: (theme: TTheme) => void
    className?: string
}
const ThemeResolver = ({
    theme,
    selectedTheme,
    applyCustomTheme,
    className,
}: TThemeResolverProps) => {
    const { theme: currentTheme } = useTheme()

    const resolveTheme = currentTheme === 'light' ? 'light' : 'dark'

    return (
        <div
            className={cn(
                'relative h-full p-2 rounded-lg cursor-pointer transition-all duration-200',
                className
            )}
            key={theme.name}
            onClick={() => applyCustomTheme?.(theme)}
        >
            <div className="flex items-center ">
                <div className="flex mr-2 space-x-1">
                    {(
                        [
                            '--background',
                            '--foreground',
                            '--primary',
                            '--secondary',
                        ] as const
                    ).map((item) => {
                        const currentColors = theme.colors[resolveTheme]
                        return (
                            <div
                                className={cn(
                                    'size-3 rounded-full',
                                    item === '--background'
                                        ? 'border-primary border'
                                        : ''
                                )}
                                key={item}
                                style={{
                                    backgroundColor: currentColors[item],
                                }}
                            />
                        )
                    })}
                </div>
                <p className="text-xs text-muted-foreground">{theme.name}</p>
            </div>

            {selectedTheme === theme.name && (
                <div className="absolute top-1/2 -translate-y-1/2 right-2">
                    <CheckFillIcon />
                </div>
            )}

            {/* <div className="absolute left-1 top-1">
                    <div className="text-[8px] font-medium opacity-60">
                        Light
                    </div>
                </div>
                <div className="absolute left-1 bottom-1">
                    <div className="text-[8px] font-medium opacity-60">
                        Dark
                    </div>
                </div> */}
        </div>
    )
}

export default ThemePicker
