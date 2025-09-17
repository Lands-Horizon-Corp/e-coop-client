import { cn } from '@/helpers'

import { Separator } from '@/components/ui/separator'

import { IClassProps } from '@/types'

import LightDarkModeSettings from './light-dark-mode-settings'
import ThemesSettings from './themes-settings'
import TransitionSettings from './transition-settings'

interface Props extends IClassProps {}

const AppearanceSettings = ({ className }: Props) => {
    return (
        <div className={cn('flex flex-col gap-y-4 flex-1 w-full', className)}>
            <LightDarkModeSettings />
            <TransitionSettings />
            <Separator />
            <ThemesSettings />
        </div>
    )
}

export default AppearanceSettings
