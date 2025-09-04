import { forwardRef } from 'react'

import { cn } from '@/helpers'

import { AutoAwesomeIcon } from '@/components/icons'
import { Input } from '@/components/ui/input'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

type ReferenceNumberPros = React.InputHTMLAttributes<HTMLInputElement> & {
    InputClassName?: string
    className?: string
    isAutoGenerate?: boolean
    isAutoOnClick?: () => void
}

const TransactionReferenceNumber = forwardRef<
    HTMLInputElement,
    ReferenceNumberPros
>(
    (
        { InputClassName, className, isAutoGenerate, isAutoOnClick, ...rest },
        ref
    ) => {
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
                {
                    <Tooltip>
                        <TooltipTrigger>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg font-bold ">
                                <AutoAwesomeIcon
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        isAutoOnClick?.()
                                    }}
                                    className={`cursor-pointer ${isAutoGenerate ? 'text-primary' : 'text-muted-foreground'}`}
                                />
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-sm">
                                {isAutoGenerate
                                    ? 'cancel'
                                    : 'Generate a reference number'}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                }
            </div>
        )
    }
)
export default TransactionReferenceNumber
