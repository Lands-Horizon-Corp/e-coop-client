import { toast } from 'sonner'

import { cn } from '@/helpers'
import { useTheme } from '@/providers/theme-provider'

import { MoonIcon, SunIcon, SunMoonIcon } from '@/components/icons'

import { IClassProps } from '@/types'

interface Props extends IClassProps {}

const AppearanceSettings = ({ className }: Props) => {
    const { theme, setTheme } = useTheme()

    return (
        <div className={cn('flex flex-col gap-y-4 flex-1 w-full', className)}>
            <div>
                <p className="text-lg">Appearance</p>
                <p className="text-muted-foreground text-sm">
                    Customize appearance based on your preference
                </p>
            </div>
            <div className="grid grid-cols-3 gap-x-4 w-full">
                <div
                    className="space-y-1 cursor-pointer group"
                    onClick={() => {
                        setTheme('light')
                        toast.message(
                            <p>
                                Set theme to Light{' '}
                                <SunIcon className="inline" />
                            </p>
                        )
                    }}
                >
                    <div
                        tabIndex={0}
                        className={cn(
                            'bg-gray-100 border text-gray-700 rounded-xl h-48 flex items-center justify-center group-hover:border-primary ease-in-out duration-100',
                            theme === 'light' && 'border-4 border-primary/80'
                        )}
                    >
                        <div className="bg-gray-100 size-fit text-stone-800 p-4 rounded-full flex items-center justify-center">
                            <SunIcon className="size-8" />
                        </div>
                    </div>
                    <p>Light</p>
                    <p className="text-xs text-muted-foreground">
                        Sets theme to light mode only
                    </p>
                </div>
                <div
                    className="space-y-1 cursor-pointer group"
                    onClick={() => {
                        toast.message(
                            <p>
                                Set theme to Dark{' '}
                                <MoonIcon className="inline" />
                            </p>
                        )
                        setTheme('dark')
                    }}
                >
                    <div
                        tabIndex={0}
                        className={cn(
                            'bg-stone-900 border flex items-center justify-center rounded-xl h-48 group-hover:border-primary ease-in-out duration-100',
                            theme === 'dark' && 'border-4 border-primary/80'
                        )}
                    >
                        <div className="bg-stone-800 size-fit text-stone-200 p-4 rounded-full flex items-center justify-center">
                            <MoonIcon className="size-8" />
                        </div>
                    </div>
                    <p>Dark</p>
                    <p className="text-xs text-muted-foreground">
                        Sets theme to dark mode only
                    </p>
                </div>
                <div
                    className="space-y-1 cursor-pointer group"
                    onClick={() => {
                        toast.message(
                            <p>
                                Set theme to automatic sync to system device{' '}
                                <SunMoonIcon className="inline" />
                            </p>
                        )
                        setTheme('system')
                    }}
                >
                    <div
                        tabIndex={0}
                        className={cn(
                            'rounded-xl h-48 grid group-hover:border-primary ease-in-out duration-100 relative overflow-clip border grid-cols-2',
                            theme === 'system' && 'border-4 border-primary/80'
                        )}
                    >
                        <div className="bg-gray-100 flex items-center justify-center" />
                        <div className="bg-stone-950 flex items-center justify-center" />
                        <div className="bg-secondary/60 backdrop-blur-sm border border-muted-foreground size-fit text-muted-foreground absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 p-4 rounded-full flex items-center justify-center">
                            <SunMoonIcon className="size-8" />
                        </div>
                    </div>
                    <p>System</p>
                    <p className="text-xs text-muted-foreground">
                        Syncs with your device system theme settings
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AppearanceSettings
