import { useCallback } from 'react'

import { cn } from '@/helpers/tw-utils'
import { useTheme } from '@/modules/settings/provider/theme-provider'
import type { IBaseProps } from '@/types/component-types/base-component'

import { MoonIcon, SunIcon, SunMoonIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type AnimationVariant = 'circle' | 'circle-blur' | 'gif' | 'polygon'

type StartPosition =
    | 'center'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'

interface ThemeToggleMenuProps extends IBaseProps {
    variant?: AnimationVariant
    start?: StartPosition
    url?: string
}

export const ThemeToggleMenu = ({
    className,
    variant = 'circle',
    start = 'center',
    url,
}: ThemeToggleMenuProps) => {
    const { setTheme, resolvedTheme } = useTheme()

    // Theme transition hook using View Transitions API
    const startTransition = useCallback((updateFn: () => void) => {
        if ('startViewTransition' in document) {
            document.startViewTransition(updateFn)
        } else {
            updateFn()
        }
    }, [])

    const handleThemeChange = useCallback(
        (newTheme: 'light' | 'dark' | 'system') => {
            // Inject animation styles for this specific transition
            const styleId = `theme-transition-${Date.now()}`
            const style = document.createElement('style')
            style.id = styleId

            // Generate animation CSS based on variant
            let css = ''
            const positions = {
                center: 'center',
                'top-left': 'top left',
                'top-right': 'top right',
                'bottom-left': 'bottom left',
                'bottom-right': 'bottom right',
            }

            if (variant === 'circle') {
                const cx =
                    start === 'center'
                        ? '50'
                        : start.includes('left')
                          ? '0'
                          : '100'
                const cy =
                    start === 'center'
                        ? '50'
                        : start.includes('top')
                          ? '0'
                          : '100'
                css = `
                    @supports (view-transition-name: root) {
                        ::view-transition-old(root) { 
                            animation: none;
                        }
                        ::view-transition-new(root) {
                            animation: circle-expand 0.4s ease-out;
                            transform-origin: ${positions[start]};
                        }
                        @keyframes circle-expand {
                            from {
                                clip-path: circle(0% at ${cx}% ${cy}%);
                            }
                            to {
                                clip-path: circle(150% at ${cx}% ${cy}%);
                            }
                        }
                    }
                `
            } else if (variant === 'circle-blur') {
                const cx =
                    start === 'center'
                        ? '50'
                        : start.includes('left')
                          ? '0'
                          : '100'
                const cy =
                    start === 'center'
                        ? '50'
                        : start.includes('top')
                          ? '0'
                          : '100'
                css = `
                    @supports (view-transition-name: root) {
                        ::view-transition-old(root) { 
                            animation: none;
                        }
                        ::view-transition-new(root) {
                            animation: circle-blur-expand 0.5s ease-out;
                            transform-origin: ${positions[start]};
                            filter: blur(0);
                        }
                        @keyframes circle-blur-expand {
                            from {
                                clip-path: circle(0% at ${cx}% ${cy}%);
                                filter: blur(4px);
                            }
                            to {
                                clip-path: circle(150% at ${cx}% ${cy}%);
                                filter: blur(0);
                            }
                        }
                    }
                `
            } else if (variant === 'gif' && url) {
                css = `
                    @supports (view-transition-name: root) {
                        ::view-transition-old(root) {
                            animation: fade-out 0.4s ease-out;
                        }
                        ::view-transition-new(root) {
                            animation: gif-reveal 2.5s cubic-bezier(0.4, 0, 0.2, 1);
                            mask-image: url('${url}');
                            mask-size: 0%;
                            mask-repeat: no-repeat;
                            mask-position: center;
                        }
                        @keyframes fade-out {
                            to {
                                opacity: 0;
                            }
                        }
                        @keyframes gif-reveal {
                            0% {
                                mask-size: 0%;
                            }
                            20% {
                                mask-size: 35%;
                            }
                            60% {
                                mask-size: 35%;
                            }
                            100% {
                                mask-size: 300%;
                            }
                        }
                    }
                `
            } else if (variant === 'polygon') {
                css = `
                    @supports (view-transition-name: root) {
                        ::view-transition-old(root) {
                            animation: none;
                        }
                        ::view-transition-new(root) {
                            animation: ${resolvedTheme === 'light' ? 'wipe-in-dark' : 'wipe-in-light'} 0.4s ease-out;
                        }
                        @keyframes wipe-in-dark {
                            from {
                                clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
                            }
                            to {
                                clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                            }
                        }
                        @keyframes wipe-in-light {
                            from {
                                clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
                            }
                            to {
                                clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                            }
                        }
                    }
                `
            }

            if (css) {
                style.textContent = css
                document.head.appendChild(style)

                // Clean up animation styles after transition
                setTimeout(() => {
                    const styleEl = document.getElementById(styleId)
                    if (styleEl) {
                        styleEl.remove()
                    }
                }, 3000)
            }

            // Start the transition
            startTransition(() => {
                setTheme(newTheme)
            })
        },
        [setTheme, startTransition, variant, start, url, resolvedTheme]
    )

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className={cn('rounded-full', className)}
                >
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleThemeChange('light')}>
                    <SunIcon className="mr-2 size-4" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
                    <MoonIcon className="mr-2 size-4" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange('system')}>
                    <SunMoonIcon className="mr-2 size-4" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
