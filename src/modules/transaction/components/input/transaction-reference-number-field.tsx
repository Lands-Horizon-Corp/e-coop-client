import { forwardRef } from 'react'

import { cn } from '@/helpers'

import { Input } from '@/components/ui/input'

type ReferenceNumberPros = React.InputHTMLAttributes<HTMLInputElement> & {
    InputClassName?: string
    className?: string
}

const TransactionReferenceNumber = forwardRef<
    HTMLInputElement,
    ReferenceNumberPros
>(({ InputClassName, className, ...rest }, ref) => {
    return (
        <div className={`relative flex items-center ${className}`}>
            <Input
                {...rest}
                ref={ref}
                className={cn(
                    'pr-9 text-lg font-semibold bg-secondary  text-primary placeholder:text-sm placeholder:font-normal placeholder:text-foreground/40',
                    InputClassName
                )}
            />
        </div>
    )
})
export default TransactionReferenceNumber
