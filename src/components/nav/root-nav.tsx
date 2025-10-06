import { cn } from '@/helpers/tw-utils'

import { IBaseProps } from '@/types'

const RootNav = ({ className, children }: IBaseProps) => {
    return (
        <nav
            className={cn(
                'flex min-h-[68px] items-center justify-between gap-x-2 px-4 lg:px-16 fixed top-0 z-20 w-full backdrop-blur-2xl',
                className
            )}
        >
            {children}
        </nav>
    )
}

export default RootNav
