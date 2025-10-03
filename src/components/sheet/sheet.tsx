import { type ReactNode, useEffect } from 'react'

import * as SheetPrimitive from '@radix-ui/react-dialog'

import { SHORTCUT_SCOPES } from '@/constants'
import { cn } from '@/helpers/tw-utils'
import type {
    IBaseProps,
    IClassProps,
} from '@/types/component-types/base-component'

import { Separator } from '@/components/ui/separator'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet'

import GeneralShortcutsWrapper, {
    useShortcutContext,
} from '../shorcuts/general-shortcuts-wrapper'

export interface ISheetClassNames extends IClassProps {
    titleClassName?: string
    descriptionClassName?: string
}

export interface ISheetProps
    extends IBaseProps,
        React.ComponentProps<typeof SheetPrimitive.Root>,
        ISheetClassNames {
    title?: string | ReactNode
    description?: string | ReactNode
    footer?: React.ReactNode
}

const SheetModal = ({
    title,
    footer,
    children,
    className,
    description,
    titleClassName,
    descriptionClassName,
    ...other
}: ISheetProps) => {
    const { setActiveScope } = useShortcutContext()

    useEffect(() => {
        if (other.open) {
            setActiveScope(SHORTCUT_SCOPES.SHEET)
        }
        return () => {
            setActiveScope(SHORTCUT_SCOPES.GLOBAL)
        }
    }, [other.open, setActiveScope])

    return (
        <GeneralShortcutsWrapper mode={SHORTCUT_SCOPES.SHEET}>
            <Sheet {...other}>
                <SheetContent
                    className={cn(
                        'shadow-2 ecoop-scroll font-inter',
                        className
                    )}
                >
                    <SheetTitle className={cn('font-medium', titleClassName)}>
                        {title}
                    </SheetTitle>
                    <SheetDescription
                        className={cn(
                            'mb-4',
                            descriptionClassName,
                            !description && 'hidden'
                        )}
                    >
                        {description}
                    </SheetDescription>
                    {children}
                    {footer && <Separator className="bg-muted/70" />}
                    {footer}
                </SheetContent>
            </Sheet>
        </GeneralShortcutsWrapper>
    )
}

export default SheetModal
