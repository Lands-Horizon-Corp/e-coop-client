import { cn } from '@/lib'

import { IBaseProps } from '@/types'

const NavContainer = ({ children, className }: IBaseProps) => {
    return (
        <div className={cn('flex items-center gap-x-2', className)}>
            {children}
        </div>
    )
}

export default NavContainer
