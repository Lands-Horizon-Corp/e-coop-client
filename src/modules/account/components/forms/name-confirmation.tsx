import { useState } from 'react'

import { AlertCircle, CheckCircle2 } from 'lucide-react'

import Modal, { IModalProps } from '@/components/modals/modal'
import { Button, ButtonVariantType } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface NameConfirmationProps extends IModalProps {
    name: string
    mode?: 'delete' | 'update'
    confirmButtonText?: string
    confirmButtonVariant?: ButtonVariantType['variant']
    isLoading?: boolean
    isMatch?: (isMatch: boolean) => void
    onConfirm?: () => void | Promise<void>
    onCancel?: () => void
}

export function NameConfirmation({
    name,
    isLoading = false,
    isMatch,
    onCancel,
    onConfirm,
    confirmButtonVariant,
    confirmButtonText = 'Confirm',
    mode = 'delete',
    ...props
}: NameConfirmationProps) {
    const [inputValue, setInputValue] = useState('')
    const isMatching = inputValue === name

    if (mode === 'delete' && !confirmButtonVariant) {
        confirmButtonVariant = 'destructive'
    } else if (!confirmButtonVariant) {
        confirmButtonVariant = 'default'
    }

    return (
        <Modal
            {...props}
            footer={
                <div className="flex gap-3">
                    <Button
                        className="flex-1 bg-transparent"
                        disabled={isLoading}
                        onClick={onCancel}
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        disabled={!isMatching}
                        onClick={onConfirm}
                        variant={confirmButtonVariant}
                    >
                        {isLoading ? 'Processing...' : confirmButtonText}
                    </Button>
                </div>
            }
        >
            <div className="w-full max-w-md space-y-6  ">
                {/* Name Display */}
                <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-xs font-medium text-muted-foreground">
                        Name to confirm:
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold text-foreground">
                        {name}
                    </p>
                </div>

                {/* Input Field */}
                <div className="space-y-2">
                    <label
                        className="text-sm font-medium text-foreground"
                        htmlFor="name-input"
                    >
                        Type the name to confirm
                    </label>
                    <Input
                        className="font-mono"
                        disabled={isLoading}
                        id="name-input"
                        onChange={(e) => {
                            setInputValue(e.target.value)
                            isMatch?.(e.target.value === name)
                        }}
                        placeholder={`Type "${name}" to confirm`}
                        type="text"
                        value={inputValue}
                    />
                </div>

                {/* Validation Feedback */}
                {inputValue && (
                    <div
                        className={`flex items-center gap-2 rounded-md p-3 text-sm ${
                            isMatching
                                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-200'
                                : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200'
                        }`}
                    >
                        {isMatching ? (
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        )}
                        <span>
                            {isMatching
                                ? 'Name matches! Ready to confirm.'
                                : 'Name does not match.'}
                        </span>
                    </div>
                )}
            </div>
        </Modal>
    )
}
