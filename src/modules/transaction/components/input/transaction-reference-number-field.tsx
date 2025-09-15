import { forwardRef } from 'react'

import { cn } from '@/helpers'

import { Input } from '@/components/ui/input'

type ReferenceNumberPros = React.InputHTMLAttributes<HTMLInputElement> & {
    InputClassName?: string
    isDefault?: boolean
}

const TransactionReferenceNumber = forwardRef<
    HTMLInputElement,
    ReferenceNumberPros
>(({ InputClassName, className, isDefault, ...rest }, ref) => {
    return (
        <div className={`relative flex items-center ${className}`}>
            <Input
                {...rest}
                ref={ref}
                className={cn(
                    'border !border-primary/20',
                    isDefault
                        ? ''
                        : 'text-lg font-bold text-primary placeholder:text-sm placeholder:font-normal placeholder:text-foreground/40',
                    InputClassName
                )}
            />
        </div>
    )
})
export default TransactionReferenceNumber
