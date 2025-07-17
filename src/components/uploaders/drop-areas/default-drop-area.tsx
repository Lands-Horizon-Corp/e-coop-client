import { cn } from '@/lib'

import { ImageIcon } from '@/components/icons'

import DropHoverOverlay from '../drop-hover-overlay'
import { IDropAreaProps } from './type'

const DefaultDropArea = ({
    className,
    isDraggingAbove,
    dropText,
}: IDropAreaProps) => {
    return (
        <div
            className={cn(
                'flex h-full w-full flex-col items-center justify-center space-y-4 rounded-xl border border-dashed bg-popover/50 p-8 text-foreground/60 duration-700 ease-in-out hover:text-foreground/80',
                className,
                isDraggingAbove &&
                    'border-muted-foreground/80 bg-popover text-foreground'
            )}
        >
            <DropHoverOverlay shown={isDraggingAbove} />
            <ImageIcon className="size-16 stroke-1" />
            <span className="text-sm">
                {dropText ?? 'Drop your image here'}
            </span>
        </div>
    )
}

export default DefaultDropArea
