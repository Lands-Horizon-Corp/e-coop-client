import { type ReactNode } from 'react'

import type * as DialogPrimitive from '@radix-ui/react-dialog'

import { cn } from '@/helpers/tw-utils'
import type {
    IBaseProps,
    IClassProps,
} from '@/types/component-types/base-component'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    type DialogExtraProps,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

export interface IModalClassNames extends DialogExtraProps, IClassProps {
    titleClassName?: string
    descriptionClassName?: string
    titleHeaderContainerClassName?: string
}
export interface IModalProps
    extends IBaseProps, DialogPrimitive.DialogProps, IModalClassNames {
    title?: string | ReactNode
    trigger?: ReactNode
    description?: string | ReactNode
    footer?: React.ReactNode
    hideOnSuccess?: boolean
}

const Modal = ({
    title,
    footer,
    trigger,
    children,
    className,
    description,
    titleClassName,
    overlayClassName,
    showCloseButton,
    closeButtonClassName,
    descriptionClassName,
    titleHeaderContainerClassName,
    ...other
}: IModalProps) => {
    return (
        <Dialog {...other}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent
                className={cn(
                    'shadow-2 ecoop-scroll max-h-[95vh] max-w-xl overflow-y-auto rounded-2xl! border font-inter',
                    className
                )}
                closeButtonClassName={closeButtonClassName}
                onEscapeKeyDown={(e) => {
                    e.stopPropagation()
                }}
                overlayClassName={cn('backdrop-blur', overlayClassName)}
                showCloseButton={!showCloseButton}
            >
                <div
                    className={cn(
                        'space-y-2',
                        !title && !description && 'hidden',
                        titleHeaderContainerClassName
                    )}
                >
                    <DialogTitle className={cn('font-medium', titleClassName)}>
                        {title}
                    </DialogTitle>
                    <DialogDescription
                        className={cn(
                            '',
                            descriptionClassName,
                            !description && 'hidden'
                        )}
                    >
                        {description}
                    </DialogDescription>
                </div>
                {children}
                {footer && <Separator className="bg-muted/70" />}
                {footer}
            </DialogContent>
        </Dialog>
    )
}

export default Modal
