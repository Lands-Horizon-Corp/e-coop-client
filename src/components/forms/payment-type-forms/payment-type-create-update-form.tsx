import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { useAuthUserWithOrg } from '@/store/user-auth-store'
import {
    IPaymentType,
    IPaymentTypeRequest,
} from '@/types/coop-types/payment-type'
import { Path, useForm } from 'react-hook-form'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import {
    useCreatePaymentType,
    useUpdatePaymentType,
} from '@/hooks/api-hooks/use-payment-type'

import { IClassProps, IForm, TEntityId } from '@/types'

const PaymentTypeSchema = z.object({
    name: z.string().min(1, 'Payment type name is required'),
    description: z
        .string()
        .max(50, 'Description must contain at most 50 character(s)')
        .optional(),
    number_of_days: z
        .number()
        .int()
        .min(0, 'Number of days must be non-negative')
        .optional(),
    type: z.enum(['cash', 'check', 'online'], {
        required_error: 'Payment type is required',
    }),
})

type PaymentTypeFormValues = z.infer<typeof PaymentTypeSchema>

export interface PaymentTypeFormProps
    extends IClassProps,
        IForm<
            Partial<IPaymentTypeRequest>,
            IPaymentType,
            string,
            PaymentTypeFormValues
        > {
    paymentTypeId?: TEntityId
}

const PaymentTypeCreateUpdateForm = ({
    paymentTypeId,
    readOnly,
    className,
    disabledFields,
    onError,
    onSuccess,
    defaultValues,
}: PaymentTypeFormProps) => {
    const { currentAuth: user } = useAuthUserWithOrg()
    const branchId = user.user_organization.branch_id
    const organizationId = user.user_organization.organization_id

    const form = useForm<PaymentTypeFormValues>({
        resolver: zodResolver(PaymentTypeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: defaultValues || {
            name: '',
            description: '',
            number_of_days: undefined,
            type: undefined,
        },
    })

    const {
        error: createError,
        isPending: isCreating,
        reset: resetCreate,
        mutate: createPaymentTypeMutate,
    } = useCreatePaymentType({ onSuccess, onError })

    const {
        error: updateError,
        isPending: isUpdating,
        reset: resetUpdate,
        mutate: updatePaymentType,
    } = useUpdatePaymentType({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (paymentTypeId) {
            updatePaymentType({
                paymentTypeId: paymentTypeId,
                data: formData,
            })
        } else {
            const requestData: IPaymentTypeRequest = {
                ...formData,
                organization_id: organizationId,
                branch_id: branchId,
            }
            createPaymentTypeMutate(requestData)
        }
    })

    const isPending = isCreating || isUpdating
    const error = createError || updateError

    const isDisabled = (field: Path<PaymentTypeFormValues>) =>
        readOnly || disabledFields?.includes(field) || isPending || false

    const isPaymentTypeOnChanged =
        JSON.stringify(form.watch()) !== JSON.stringify(defaultValues)

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label="Payment Type Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="e.g., Cash, Bank Transfer, Credit Card"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="type"
                            label="Payment Method Type"
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    disabled={isDisabled(field.name)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">
                                            cash
                                        </SelectItem>
                                        <SelectItem value="check">
                                            check
                                        </SelectItem>
                                        <SelectItem value="online">
                                            online
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="number_of_days"
                            label="Number of Days (Optional)"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="e.g., 30 (for credit terms)"
                                    disabled={isDisabled(field.name)}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseInt(e.target.value) ||
                                                undefined
                                        )
                                    }
                                    value={
                                        field.value !== undefined
                                            ? field.value
                                            : ''
                                    }
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    autoComplete="off"
                                    placeholder="Optional description for the payment type"
                                    className="max-h-40"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <Separator />
                <div className="space-y-2">
                    <FormErrorMessage errorMessage={error} />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                form.reset(defaultValues)
                                resetCreate()
                                resetUpdate()
                            }}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending || !isPaymentTypeOnChanged}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : paymentTypeId ? (
                                'Update'
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const PaymentTypeFormModal = ({
    title = 'Create Payment Type',
    description = 'Fill out the form to add a new payment type',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<PaymentTypeFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <PaymentTypeCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default PaymentTypeCreateUpdateForm
