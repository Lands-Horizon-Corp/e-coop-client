import { cn } from '@/lib'
import { IBaseProps } from '@/types'

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
