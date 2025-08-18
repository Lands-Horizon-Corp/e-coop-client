import { cn } from '@/helpers/tw-utils'

import type { IBaseProps } from '@/types'

interface Props extends IBaseProps {
    shown?: boolean
    titleText?: string
}

const DropHoverOverlay = ({
    shown,
    children,
    className,
    titleText = 'Drop Here',
}: Props) => {
    return (
        <div
            className={cn(
                'inset pointer-events-none absolute left-0 top-0 z-20 flex h-full w-full items-center justify-center rounded-2xl bg-background/40 opacity-0 backdrop-blur-sm delay-150 duration-300 ease-in-out',
                className,
                shown && 'opacity-100'
            )}
        >
            {children ? (
                children
            ) : (
                <p className="text-foreground/80">{titleText}</p>
            )}
        </div>
    )
}

export default DropHoverOverlay
