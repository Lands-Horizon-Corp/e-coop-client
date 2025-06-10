import { cn } from '@/lib'
import { IBaseProps } from '@/types'

interface Props extends IBaseProps {}

const KanbanItemsContainer = ({ className, children }: Props) => {
    return (
        <div
            className={cn(
                'ecoop-scroll max-h-full min-h-full space-y-4 overflow-auto rounded-2xl border bg-secondary p-2 dark:bg-popover/20',
                className
            )}
        >
            {children}
        </div>
    )
}

export default KanbanItemsContainer
