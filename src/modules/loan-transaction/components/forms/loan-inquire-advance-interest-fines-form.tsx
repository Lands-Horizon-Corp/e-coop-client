import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { formatNumber } from '@/helpers'
import { toInputDateString } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'
import { stringDateWithTransformSchema } from '@/validation'

import { CalculatorIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'

import { IClassProps, IForm } from '@/types'

// IM NOT SURE DESU
export const LoanInquireAdvanceInterestFinesSchema = z.object({
    current_interest: z.coerce.number().min(0).default(0),
    current_fines: z.coerce.number().min(0).default(0),
    entry_date: stringDateWithTransformSchema,
    interest: z.coerce.number().min(0).default(0),
    fines: z.coerce.number().min(0).default(0),
})

export type TLoanInquireAdvanceInterestFinesFormValues = z.infer<
    typeof LoanInquireAdvanceInterestFinesSchema
>

export interface ILoanInquireAdvanceInterestFinesFormProps
    extends IClassProps,
        IForm<
            Partial<TLoanInquireAdvanceInterestFinesFormValues>,
            any,
            Error,
            TLoanInquireAdvanceInterestFinesFormValues
        > {
    onCalculateSuccess?: (result: any) => void
}

const LoanInquireAdvanceInterestFinesForm = ({
    className,
    // onCalculateSuccess,
    ...formProps
}: ILoanInquireAdvanceInterestFinesFormProps) => {
    const form = useForm<TLoanInquireAdvanceInterestFinesFormValues>({
        resolver: standardSchemaResolver(LoanInquireAdvanceInterestFinesSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            current_interest: 0,
            current_fines: 0,
            interest: 0,
            fines: 0,
            ...formProps.defaultValues,
            entry_date: toInputDateString(
                formProps.defaultValues?.entry_date ?? new Date()
            ),
        },
    })

    // TODO: Add mutation call to compute interest and fines

    const onSubmit = form.handleSubmit((_formData) => {
        // TODO: instead here move this to on sucess of mutation
        // onCalculateSuccess?.(formData)
    })

    // Dummy computed values
    const interestDue = form.watch('interest') ?? 0
    const finesDue = form.watch('fines') ?? 0

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset className="grid gap-x-6 gap-y-4 sm:gap-y-3">
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="current_interest"
                            label="Current Interest"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="Current Interest"
                                    autoComplete="off"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="current_fines"
                            label="Current Fines"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="Current Fines"
                                    autoComplete="off"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="entry_date"
                            label="Date"
                            className="relative"
                            description="mm/dd/yyyy"
                            descriptionClassName="absolute top-0 right-0"
                            render={({ field }) => (
                                <InputDate
                                    type="date"
                                    {...field}
                                    className="block"
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="interest"
                            label="Interest"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="Interest"
                                    autoComplete="off"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="fines"
                            label="Fines"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    placeholder="Fines"
                                    autoComplete="off"
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>

                {/* Computed Results */}
                <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2 bg-green-200 rounded-md px-4 py-2">
                        <span className="font-bold text-lg text-green-900">
                            INTEREST DUE:
                        </span>
                        <span className="font-mono text-2xl text-green-900">
                            {formatNumber(interestDue, 2)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 bg-green-200 rounded-md px-4 py-2">
                        <span className="font-bold text-lg text-green-900">
                            FINES DUE:
                        </span>
                        <span className="font-mono text-2xl text-green-900">
                            {formatNumber(finesDue, 2)}
                        </span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-2 justify-end mt-4 sticky bottom-0">
                    <Button
                        type="submit"
                        className="text-lg w-full"
                        variant="default"
                        size="sm"
                    >
                        <CalculatorIcon className="size-4" />
                        Compute
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export const LoanInquireAdvanceInterestFinesModal = ({
    title = 'Inquire Advance Interest / Fines',
    description = 'Fill out the form to compute advance interest and fines.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ILoanInquireAdvanceInterestFinesFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <LoanInquireAdvanceInterestFinesForm
                {...formProps}
                onCalculateSuccess={(result) => {
                    formProps?.onCalculateSuccess?.(result)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanInquireAdvanceInterestFinesForm
