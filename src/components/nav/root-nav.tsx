import { cn } from '@/helpers/tw-utils'

import { IBaseProps } from '@/types'

const RootNav = ({ className, children }: IBaseProps) => {
    return (
        <nav
            className={cn(
                'z-10 flex min-h-[68px] items-center justify-between gap-x-2 px-4 lg:px-16',
                className
            )}
        >
            {children}
        </nav>
    )
}

export default RootNav
