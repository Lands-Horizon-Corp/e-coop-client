import { cn } from '@/lib/utils'
import { IClassProps } from '@/types'
import { ResolvedTheme, useTheme } from '@/providers/theme-provider'

type TEcoopThemeMode = 'dynamic' | ResolvedTheme

type TLogoUrls =
    | '/e-coop-logo-1.webp'
    | '/e-coop-logo-white.webp'
    | '/e-coop-logo-black.webp'

interface Props extends IClassProps {
    blurDisabled?: boolean
    blurClassName?: string
    themeMode?: TEcoopThemeMode
    lightUrl?: string | TLogoUrls
    darkUrl?: string | TLogoUrls
}

const getResolvedLogoUrl = (
    lightUrl: string,
    darkUrl: string,
    theme: ResolvedTheme
) => {
    if (theme === 'light') return lightUrl

    return darkUrl
}

const EcoopLogo = ({
    className,
    blurClassName,
    blurDisabled = false,
    themeMode = 'dynamic',
    darkUrl = '/e-coop-logo-white.webp',
    lightUrl = '/e-coop-logo-1.webp',
}: Props) => {
    const { resolvedTheme } = useTheme()

    const finalUrl =
        themeMode === 'dynamic'
            ? getResolvedLogoUrl(lightUrl, darkUrl, resolvedTheme)
            : themeMode === 'light'
              ? getResolvedLogoUrl(lightUrl, darkUrl, 'light')
              : getResolvedLogoUrl(lightUrl, darkUrl, 'dark')

    return (
        <div className={cn('relative size-8', className)}>
            <img src={finalUrl} alt="logo" className="h-full w-full" />
            {!blurDisabled && (
                <img
                    src={finalUrl}
                    alt="logo-blur"
                    className={cn(
                        'pointer-events-none absolute inset-0 left-1/2 top-1/2 z-0 size-full -translate-x-1/2 -translate-y-[45%] blur-xl selection:bg-none',
                        blurClassName
                    )}
                />
            )}
        </div>
    )
}

export default EcoopLogo
