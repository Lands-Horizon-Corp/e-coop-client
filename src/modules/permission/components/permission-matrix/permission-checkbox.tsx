import { forwardRef } from 'react'

import { cn } from '@/helpers'
import { Check, Minus } from 'lucide-react'

import InfoTooltip from '@/components/tooltips/info-tooltip'

import { TPermissionAction } from '../../permission.types'
import { getActionDetails } from '../../permission.utils'

interface PermissionCheckboxProps {
    action?: TPermissionAction
    checked: boolean | 'indeterminate'
    onChange: (checked: boolean) => void
    disabled?: boolean
}

export const PermissionCheckbox = forwardRef<
    HTMLButtonElement,
    PermissionCheckboxProps
>(({ action, checked, disabled = false, onChange }, ref) => {
    const isIndeterminate = checked === 'indeterminate'
    const isChecked = checked === true

    const actionDetails = action ? getActionDetails(action) : undefined

    const Comp = (
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
            ref={ref}
            type="button"
        >
            {isChecked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
            {isIndeterminate && (
                <Minus className="w-3.5 h-3.5" strokeWidth={3} />
            )}
        </button>
    )

    if (actionDetails)
        return (
            <InfoTooltip
                content={
                    <div className="space-y-2 p-2">
                        <p className="font-bold inline-flex items-center w-full justify-between text-base">
                            {actionDetails.label}
                            {actionDetails.icon && (
                                <span className="p-1 rounded-md inline-flex flex-col items-center bg-popover">
                                    <actionDetails.icon className="inline" />
                                </span>
                            )}
                        </p>
                        <p className="text-sm">{actionDetails.description}</p>
                    </div>
                }
                contentClassName="rounded-2xl"
            >
                {Comp}
            </InfoTooltip>
        )

    return Comp
})
