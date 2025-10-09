import { MouseEvent } from 'react'

import { cn } from '@/helpers'
import useConfirmModalStore from '@/store/confirm-modal-store'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import { Separator } from '@/components/ui/separator'

import { IClassProps } from '@/types'

interface IFormResetSubmitFooterProps extends IClassProps {
    readOnly?: boolean
    isLoading?: boolean
    disableSubmit?: boolean
    showSeparator?: boolean
    disableReset?: boolean

    hideReset?: boolean

    showConfirmOnReset?: boolean

    submitText?: React.ReactNode | string
    resetText?: string

    error?: string

    resetButtonType?: 'button' | 'reset'
    submitButtonType?: 'button' | 'submit'

    onReset?: () => void
    onSubmit?: (e: MouseEvent<HTMLButtonElement>) => void
}

const FormFooterResetSubmit = ({
    submitText = 'Submit',
    resetText = 'Reset',
    isLoading,
    readOnly,
    className,
    disableSubmit,
    error,
    showSeparator = false,
    hideReset = false,
    showConfirmOnReset = true,
    disableReset,

    resetButtonType = 'button',
    submitButtonType = 'submit',

    onSubmit,
    onReset,
}: IFormResetSubmitFooterProps) => {
    const { onOpen } = useConfirmModalStore()
    return (
        <div className={cn('space-y-2 py-1 px-0', className)}>
            <FormErrorMessage errorMessage={error} />
            {showSeparator && <Separator className="my-2 sm:my-4" />}
            <div className="flex items-center justify-end gap-x-2">
                {!hideReset && (
                    <Button
                        className="w-full self-end px-8 sm:w-fit"
                        disabled={
                            disableSubmit ||
                            readOnly ||
                            isLoading ||
                            disableReset
                        }
                        onClick={() => {
                            if (showConfirmOnReset) {
                                return onOpen({
                                    title: 'Reset Changes',
                                    description:
                                        'You might have unsave changes, are you sure to proceed?',
                                    onConfirm: () => onReset?.(),
                                })
                            }
                            onReset?.()
                        }}
                        size="sm"
                        type={resetButtonType}
                        variant="secondary"
                    >
                        {resetText}
                    </Button>
                )}
                <Button
                    className="w-full self-end px-8 sm:w-fit"
                    disabled={isLoading || readOnly || disableSubmit}
                    onClick={onSubmit}
                    size="sm"
                    type={onSubmit !== undefined ? 'button' : submitButtonType}
                >
                    {isLoading ? <LoadingSpinner /> : submitText}
                </Button>
            </div>
        </div>
    )
}

export default FormFooterResetSubmit
