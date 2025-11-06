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
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

export interface IModalClassNames extends DialogExtraProps, IClassProps {
    titleClassName?: string
    descriptionClassName?: string
}
export interface IModalProps
    extends IBaseProps,
        DialogPrimitive.DialogProps,
        IModalClassNames {
    title?: string | ReactNode
    description?: string | ReactNode
    footer?: React.ReactNode
    hideOnSuccess?: boolean
}

const Modal = ({
    title,
    footer,
    children,
    className,
    description,
    titleClassName,
    overlayClassName,
    showCloseButton,
    closeButtonClassName,
    descriptionClassName,
    ...other
}: IModalProps) => {
    return (
        <Dialog {...other}>
            <DialogContent
                className={cn(
                    'shadow-2 ecoop-scroll max-h-[95vh] max-w-xl overflow-y-auto !rounded-2xl border font-inter',
                    className
                )}
                closeButtonClassName={closeButtonClassName}
                overlayClassName={cn('backdrop-blur', overlayClassName)}
                showCloseButton={!showCloseButton}
            >
                <DialogTitle className={cn('font-medium', titleClassName)}>
                    {title}
                </DialogTitle>
                <DialogDescription
                    className={cn(
                        'mb-4',
                        descriptionClassName,
                        !description && 'hidden'
                    )}
                >
                    {description}
                </DialogDescription>
                {children}
                {footer && <Separator className="bg-muted/70" />}
                {footer}
            </DialogContent>
        </Dialog>
    )
}

export default Modal
