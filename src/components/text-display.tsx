import { cn } from '@/helpers'

import { IBaseProps } from '@/types'

import CopyWrapper from './wrappers/copy-wrapper'

type Props = {
    noValueText?: string
    withCopy?: boolean
} & IBaseProps

const TextDisplay = ({
    noValueText,
    withCopy = false,
    children,
    className,
}: Props) => {
    return (
        <span
            className={cn(
                'text-sm data-display-state data-[display-state=present]:text-inherit data-[display-state=missing]:text-muted-foreground',
                className
            )}
            data-display-state={children === undefined ? 'missing' : 'present'}
        >
            {children && withCopy ? (
                <CopyWrapper>{children}</CopyWrapper>
            ) : (
                children || noValueText
            )}
        </span>
    )
}

export default TextDisplay
