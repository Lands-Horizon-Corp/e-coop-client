import { cn } from '@/helpers'

import { IClassProps } from '@/types'

interface Props extends IClassProps {}

const ThemesSettings = ({ className }: Props) => {
    return (
        <div className={cn('flex flex-col gap-y-4 flex-1 w-full', className)}>
            hello
        </div>
    )
}

export default ThemesSettings
