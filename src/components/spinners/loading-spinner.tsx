import { LoadingCircleIcon } from '@/components/icons'

import { cn } from '@/lib/utils'
import { IClassProps } from '@/types/components'

interface Props extends IClassProps {}

const LoadingSpinner = ({ className }: Props) => {
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
