import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    IOtherFund,
    OtherFundPrintSchema,
    TOtherFundPrintSchema,
    usePrintOtherFundTransaction,
} from '@/modules/other-fund'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

export interface IOtherFundPrintFormProps
    extends
        IClassProps,
        IForm<
            Partial<TOtherFundPrintSchema>,
            IOtherFund,
            Error,
            TOtherFundPrintSchema
        > {
    otherFundId: TEntityId
}

const OtherFundPrintForm = ({
    otherFundId,
    className,
    ...formProps
}: IOtherFundPrintFormProps) => {
    const form = useForm<TOtherFundPrintSchema>({
        resolver: standardSchemaResolver(OtherFundPrintSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            cash_voucher_number: '',
            ...formProps.defaultValues,
        },
    })

    const printMutation = usePrintOtherFundTransaction({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TOtherFundPrintSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit(async (payload) => {
        toast.promise(
            printMutation.mutateAsync({
                otherFundId,
                payload,
            }),
            {
                loading: 'Printing Other Fund...',
                success: 'Other Fund Printed',
                error: (error) =>
                    `Something went wrong: ${serverRequestErrExtractor({ error })}`,
            }
        )
    }, handleFocusError)

    const { error: rawError, isPending, reset } = printMutation
    const error = serverRequestErrExtractor({ error: rawError })

    useHotkeys(
        'alt + E',
        (e) => {
            e.preventDefault()
        },
        { enableOnFormTags: true },
        [form]
    )

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Voucher *"
                        name="cash_voucher_number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Voucher Number"
                            />
                        )}
                    />
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Print"
                />
            </form>
        </Form>
    )
}

export const OtherFundPrintFormModal = ({
    className,
    formProps,
    title = 'Other Fund Print',
    description = 'Input required details to print the Other Fund record.',
    ...props
}: IModalProps & {
    formProps: Omit<IOtherFundPrintFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('max-w-lg!', className)}
            description={description}
            title={title}
            {...props}
        >
            <OtherFundPrintForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default OtherFundPrintFormModal
