import { useCallback, useEffect } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    CashCheckVoucherPrintSchema,
    ICashCheckVoucher,
    TCashCheckVoucherPrintSchema,
    TORCashCheckSettings,
    usePrintCashCheckVoucherTransaction,
} from '@/modules/cash-check-voucher'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    buildCashCheckOR,
    isAllowedInputCashCheckOR,
} from '../../cash-check-voucher.utils'

export interface ICashCheckVoucherPrintFormProps
    extends
        IClassProps,
        IForm<
            Partial<TCashCheckVoucherPrintSchema>,
            ICashCheckVoucher,
            Error,
            TCashCheckVoucherPrintSchema
        > {
    cashCheckVoucherId: TEntityId
    orSettings?: TORCashCheckSettings
}

const CashCheckVoucherPrintForm = ({
    cashCheckVoucherId,
    className,
    orSettings,
    ...formProps
}: ICashCheckVoucherPrintFormProps) => {
    const form = useForm<TCashCheckVoucherPrintSchema>({
        resolver: standardSchemaResolver(CashCheckVoucherPrintSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            cash_voucher_number: '',
            ...formProps.defaultValues,
        },
    })

    const printMutation = usePrintCashCheckVoucherTransaction({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TCashCheckVoucherPrintSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit(async (payload) => {
        toast.promise(
            printMutation.mutateAsync({
                cashCheckVoucherId,
                payload,
            }),
            {
                loading: 'Printing Cash/Check Voucher...',
                success: 'Cash/Check Voucher Printed',
                error: (error) =>
                    `Something went wrong: ${serverRequestErrExtractor({ error })}`,
            }
        )
    }, handleFocusError)

    const { error: rawError, isPending, reset } = printMutation

    const error = serverRequestErrExtractor({ error: rawError })

    const handleAutoGenerateOR = useCallback(
        (isAuto?: boolean) => {
            form.setValue('or_auto_generated', isAuto)

            if (!orSettings)
                return toast.warning(
                    'Failed to generate Cash Check OR, could not retrieve settings'
                )

            if (isAuto) {
                form.setValue(
                    'cash_voucher_number',
                    buildCashCheckOR(orSettings)
                )
            }
        },
        [orSettings, form]
    )

    useHotkeys(
        'alt + E',
        (e) => {
            e.preventDefault()
            handleAutoGenerateOR(!form.getValues('or_auto_generated'))
        },
        { enableOnFormTags: true },
        [orSettings, form, handleAutoGenerateOR]
    )

    useEffect(() => {
        if (
            isAllowedInputCashCheckOR(orSettings) ||
            !!form.getValues('cash_voucher_number')
        )
            return undefined

        handleAutoGenerateOR(true)
    }, [orSettings, form, handleAutoGenerateOR])

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
                                disabled={
                                    isDisabled(field.name) ||
                                    !isAllowedInputCashCheckOR(orSettings)
                                }
                                id={field.name}
                                placeholder="Voucher Number"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        className=""
                        control={form.control}
                        labelClassName="text-xs font-medium text-muted-foreground"
                        name="or_auto_generated"
                        render={({ field }) => (
                            <div className="flex items-center">
                                <Switch
                                    checked={field.value}
                                    className="mr-2 max-h-4 max-w-9"
                                    onCheckedChange={(value) => {
                                        handleAutoGenerateOR(value)
                                        field.onChange(value)
                                    }}
                                    thumbClassName="size-3"
                                />
                                <Label className="text-xs font-medium text-muted-foreground mr-1">
                                    OR Auto Generated
                                </Label>
                                <Label className="text-xs font-medium text-muted-foreground">
                                    Press Alt{' '}
                                    <KbdGroup>
                                        <Kbd>Alt</Kbd>
                                        <span>+</span>
                                        <Kbd>E</Kbd>
                                    </KbdGroup>
                                </Label>
                            </div>
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

export const CashCheckVoucherPrintFormModal = ({
    className,
    formProps,
    title = 'Cash/Check Voucher Print',
    description = 'Input required details to print the Cash/Check Voucher.',
    ...props
}: IModalProps & {
    formProps: Omit<ICashCheckVoucherPrintFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-lg', className)}
            description={description}
            title={title}
            {...props}
        >
            <CashCheckVoucherPrintForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default CashCheckVoucherPrintFormModal
