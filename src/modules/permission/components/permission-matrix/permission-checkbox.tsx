import { memo } from 'react'

import { cn } from '@/helpers'
import { Check, Minus } from 'lucide-react'

interface PermissionCheckboxProps {
    checked: boolean | 'indeterminate'
    onChange: (checked: boolean) => void
    disabled?: boolean
}

export const PermissionCheckbox = memo(function PermissionCheckbox({
    checked,
    onChange,
    disabled = false,
}: PermissionCheckboxProps) {
    const isIndeterminate = checked === 'indeterminate'
    const isChecked = checked === true

    return (
        <button
            className={cn(
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150',
                disabled && 'opacity-30 cursor-not-allowed',
                !disabled && 'cursor-pointer',
                isChecked &&
                    'bg-primary border-primary text-primary-foreground',
                isIndeterminate &&
                    'bg-primary/70 border-primary text-primary-foreground',
                !isChecked &&
                    !isIndeterminate &&
                    'bg-background border-border hover:border-primary/50'
            )}
            disabled={disabled}
            onClick={() => !disabled && onChange(!isChecked)}
            type="button"
        >
            {isChecked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
            {isIndeterminate && (
                <Minus className="w-3.5 h-3.5" strokeWidth={3} />
            )}
        </button>
    )
})
