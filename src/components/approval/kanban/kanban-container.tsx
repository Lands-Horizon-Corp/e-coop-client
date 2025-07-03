import { cn } from '@/lib'

import { IBaseProps } from '@/types'

interface Props extends IBaseProps {}

const KanbanContainer = ({ className, children }: Props) => {
    return (
        <div
            className={cn(
                'h-fit shrink-0 space-y-4 overflow-clip rounded-lg',
                className
            )}
        >
            {children}
        </div>
    )
}

export default KanbanContainer
