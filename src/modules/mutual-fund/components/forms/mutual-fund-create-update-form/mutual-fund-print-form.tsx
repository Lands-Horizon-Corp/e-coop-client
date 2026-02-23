import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { usePrintMutualFund } from '@/modules/mutual-fund/mutual-fund.service'
import {
    IMutualFund,
    IMutualFundPrintRequest,
} from '@/modules/mutual-fund/mutual-fund.types'
import { MutualFundPrintSchema } from '@/modules/mutual-fund/mutual-fund.validation'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

export interface IMutualFundPrintFormProps
    extends
        IClassProps,
        IForm<Partial<IMutualFundPrintRequest>, IMutualFund, Error, void> {
    mutualFundId: TEntityId
}

const MutualFundPrintForm = ({
    mutualFundId,
    className,
    ...formProps
}: IMutualFundPrintFormProps) => {
    const form = useForm<IMutualFundPrintRequest>({
        resolver: standardSchemaResolver(MutualFundPrintSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            report_format: 'Format #1',
            sort_by: 'PB',
            ...formProps.defaultValues,
        },
    })

    const printMutation = usePrintMutualFund({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<IMutualFundPrintRequest>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        printMutation.mutate({ mutualFundId, payload: formData })
    }, handleFocusError)

    const { error: rawError, isPending, reset } = printMutation

    const error = serverRequestErrExtractor({ error: rawError })

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
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Report Format *"
                            name="report_format"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-2 gap-3 rounded-xl bg-popover/20 p-3.5"
                                    disabled={isDisabled(field.name)}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            id="report_format_1"
                                            value="format_1"
                                        />
                                        <Label
                                            className="cursor-pointer font-normal"
                                            htmlFor="report_format_1"
                                        >
                                            Format #1
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            id="report_format_2"
                                            value="format_2"
                                        />
                                        <Label
                                            className="cursor-pointer font-normal"
                                            htmlFor="report_format_2"
                                        >
                                            Format #2
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Sort By*"
                            name="sort_by"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-2 gap-3 rounded-xl bg-popover/20 p-3.5"
                                    disabled={isDisabled(field.name)}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            id="sort_by_passbook"
                                            value={'passbook'}
                                        />
                                        <Label
                                            className="cursor-pointer font-normal"
                                            htmlFor={'sort_by_passbook'}
                                        >
                                            Passbook
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            id="sort_by_name"
                                            value={'name'}
                                        />
                                        <Label
                                            className="cursor-pointer font-normal"
                                            htmlFor={'sort_by_name'}
                                        >
                                            Name
                                        </Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={'Print'}
                />
            </form>
        </Form>
    )
}

export const MutualFundPrintFormModal = ({
    title = 'Print Mutual Fund',
    description = 'Fill out the form to print this mutual fund.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMutualFundPrintFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <MutualFundPrintForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MutualFundPrintForm
