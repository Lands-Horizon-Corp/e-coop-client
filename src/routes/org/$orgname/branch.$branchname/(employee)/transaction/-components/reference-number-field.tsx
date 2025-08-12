import { forwardRef } from 'react'

import { ReceiptIcon } from '@/components/icons'
import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'

type ReferenceNumberPros = React.InputHTMLAttributes<HTMLInputElement> & {
    InputClassName?: string
    className?: string
}

const ReferenceNumber = forwardRef<HTMLInputElement, ReferenceNumberPros>(
    ({ InputClassName, className, ...rest }, ref) => {
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
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg font-bold ">
                    <ReceiptIcon />
                </span>
            </div>
        )
    }
)
export default ReferenceNumber
