import { forwardRef } from 'react'

import { cn } from '@/helpers/tw-utils'

import type { IBaseProps } from '@/types'

interface Props extends IBaseProps {}

const PageContainer = forwardRef<HTMLDivElement, Props>(
    ({ children, className }, ref) => {
        return (
            <div
                className={cn(
                    'flex w-full max-w-full flex-col items-center px-4 pb-6 sm:px-4',
                    className
                )}
                ref={ref}
            >
                {children}
            </div>
        )
    }
)

PageContainer.displayName = 'PageContainer'

export default PageContainer
