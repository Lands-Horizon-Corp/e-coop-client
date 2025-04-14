import { LoadingCircleIcon } from '@/components/icons'

import { cn } from '@/lib/utils'
import { IBaseProps } from '@/types/components'

const LoadingSpinner = ({ className }: IBaseProps) => {
    return (
        <LoadingCircleIcon
            className={cn(
                'size-4 animate-spin [animation-duration:1s]',
                className
            )}
        />
    )
}

export default LoadingSpinner
