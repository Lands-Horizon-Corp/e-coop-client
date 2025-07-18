import { ReactNode } from 'react'

import { cn } from '@/lib'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogExtraProps,
    DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

import { IBaseProps, IClassProps } from '@/types'

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
}

const Modal = ({
    title,
    footer,
    children,
    className,
    description,
    titleClassName,
    hideCloseButton,
    overlayClassName,
    closeButtonClassName,
    descriptionClassName,
    ...other
}: IModalProps) => {
    return (
        <Dialog {...other}>
            <DialogContent
                hideCloseButton={hideCloseButton}
                closeButtonClassName={closeButtonClassName}
                overlayClassName={cn('backdrop-blur', overlayClassName)}
                className={cn(
                    'shadow-2 ecoop-scroll max-h-[95vh] max-w-xl overflow-y-auto !rounded-2xl border font-inter',
                    className
                )}
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
