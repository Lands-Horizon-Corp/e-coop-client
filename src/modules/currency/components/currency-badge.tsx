import { cn } from '@/helpers/tw-utils'
import { type VariantProps, cva } from 'class-variance-authority'

import { ICurrency } from '../currency.types'

const currencyBadgeVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border rounded-full',
    {
        variants: {
            variant: {
                primary: cn(
                    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                    'dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900'
                ),
                secondary: cn(
                    'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
                    'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                ),
                success: cn(
                    'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
                    'dark:bg-green-950 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900'
                ),
                warning: cn(
                    'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
                    'dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800 dark:hover:bg-yellow-900'
                ),
                outline: cn(
                    'bg-background text-foreground border-border hover:bg-accent',
                    'dark:bg-background dark:text-foreground dark:border-border dark:hover:bg-accent'
                ),
            },
            size: {
                sm: 'text-xs px-2 py-1 gap-1',
                md: 'text-sm px-2.5 py-1.5 gap-1.5',
                lg: 'text-base px-3 py-2 gap-2',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
)

const emojiSizeVariants = cva('flex-shrink-0', {
    variants: {
        size: {
            sm: 'text-sm',
            md: 'text-base',
            lg: 'text-lg',
        },
    },
    defaultVariants: {
        size: 'md',
    },
})

const symbolSizeVariants = cva('flex-shrink-0 font-bold', {
    variants: {
        size: {
            sm: 'text-xs',
            md: 'text-sm',
            lg: 'text-base',
        },
    },
    defaultVariants: {
        size: 'md',
    },
})

interface CurrencyBadgeProps
    extends VariantProps<typeof currencyBadgeVariants> {
    currency: ICurrency
    className?: string
    showEmoji?: boolean
    showSymbol?: boolean
    showCode?: boolean
    displayFormat?:
        | 'name'
        | 'code'
        | 'name-code'
        | 'symbol-name'
        | 'symbol-code'
}

export function CurrencyBadge({
    currency,
    className,
    showEmoji = true,
    showSymbol = false,
    showCode = true,
    displayFormat = 'name-code',
    size = 'md',
    variant = 'primary',
    ...props
}: CurrencyBadgeProps) {
    const getDisplayText = () => {
        switch (displayFormat) {
            case 'name':
                return currency.name
            case 'code':
                return currency.currency_code
            case 'name-code':
                return `${currency.name} (${currency.currency_code})`
            case 'symbol-name':
                return currency.symbol
                    ? `${currency.symbol} ${currency.name}`
                    : currency.name
            case 'symbol-code':
                return currency.symbol
                    ? `${currency.symbol} ${currency.currency_code}`
                    : currency.currency_code
            default:
                return `${currency.name} (${currency.currency_code})`
        }
    }

    return (
        <div
            className={cn(
                currencyBadgeVariants({ variant, size }),
                'max-w-full min-w-0',
                className
            )}
            title={`${currency.name} - ${currency.country}`}
            {...props}
        >
            {showEmoji && currency.emoji && (
                <span className={emojiSizeVariants({ size })}>
                    {currency.emoji}
                </span>
            )}
            {showSymbol && currency.symbol && !showEmoji && (
                <span className={symbolSizeVariants({ size })}>
                    {currency.symbol}
                </span>
            )}
            {showCode && <span className="truncate">{getDisplayText()}</span>}
        </div>
    )
}

export { currencyBadgeVariants, emojiSizeVariants, symbolSizeVariants }
export type CurrencyBadgeVariants = VariantProps<typeof currencyBadgeVariants>
