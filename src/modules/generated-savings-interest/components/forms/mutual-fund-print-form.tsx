import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { usePrintGeneratedSavingsInterest } from '@/modules/generated-savings-interest/generated-savings-interest.service'
import { GeneratedSavingsInterestPrintSchema } from '@/modules/generated-savings-interest/generated-savings-interest.validation'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    IGeneratedSavingsInterest,
    IGeneratedSavingsInterestPrintRequest,
} from '../../generated-savings-interest.types'

export interface IGeneratedSavingsInterestPrintFormProps
    extends IClassProps,
        IForm<
            Partial<IGeneratedSavingsInterestPrintRequest>,
            IGeneratedSavingsInterest,
            Error,
            void
        > {
    generatedSavingsInterestId: TEntityId
}

const GeneratedSavingsInterestPrintForm = ({
    generatedSavingsInterestId,
    className,
    ...formProps
}: IGeneratedSavingsInterestPrintFormProps) => {
    const form = useForm<IGeneratedSavingsInterestPrintRequest>({
        resolver: standardSchemaResolver(GeneratedSavingsInterestPrintSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            sort_by: 'passbook',
            member_type_id: null,
            ...formProps.defaultValues,
        },
    })

    const printMutation = usePrintGeneratedSavingsInterest({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<IGeneratedSavingsInterestPrintRequest>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        toast.promise(
            printMutation.mutateAsync({
                generatedSavingsInterestId,
                payload: formData,
            }),
            {
                loading: 'Printing generated savings interest...',
                success: 'Generated savings interest printed successfully',
                error: 'Failed to print generated savings interest',
            }
        )
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
                            label="Member Type"
                            name="member_type_id"
                            render={({ field }) => (
                                <MemberTypeCombobox
                                    {...field}
                                    onChange={(selected) => {
                                        field.onChange(selected?.id)
                                    }}
                                    value={field.value!}
                                />
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

export const GeneratedSavingsInterestPrintFormModal = ({
    title = 'Print Generated Savings Interest',
    description = 'Fill out the form to print this generated savings interest.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IGeneratedSavingsInterestPrintFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <GeneratedSavingsInterestPrintForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default GeneratedSavingsInterestPrintForm
