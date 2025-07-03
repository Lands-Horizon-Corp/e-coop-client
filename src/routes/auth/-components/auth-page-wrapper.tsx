import { cn } from '@/lib/utils'

import { IBaseProps } from '@/types'

const AuthPageWrapper = ({ className, children }: IBaseProps) => {
    return (
        <div
            className={cn(
                'flex w-full justify-center p-6 sm:rounded-2xl sm:backdrop-blur-md',
                className
            )}
        >
            {children}
        </div>
    )
}

export default AuthPageWrapper
