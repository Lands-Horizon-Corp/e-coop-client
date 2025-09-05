import { cn } from '@/helpers/tw-utils'

import type { IBaseProps } from '@/types'

interface Props extends IBaseProps {}

const PageContainer = ({ children, className }: Props) => {
    return (
        <div
            className={cn(
                'flex w-full max-w-full flex-col items-center px-4 pb-6 sm:px-4',
                className
            )}
        >
            {children}
        </div>
    )
}

export default PageContainer
