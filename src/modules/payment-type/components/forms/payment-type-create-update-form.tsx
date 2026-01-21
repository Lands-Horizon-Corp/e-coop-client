import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { useAuthUserWithOrg } from '@/modules/authentication/authgentication.store'
import {
    IPaymentType,
    IPaymentTypeRequest,
    PaymentTypeFormValues,
    PaymentTypeSchema,
    useCreate,
    useUpdateById,
} from '@/modules/payment-type'

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

import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'
import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

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
    className,
    onSuccess,
    ...formProps
}: PaymentTypeFormProps) => {
    const { currentAuth: user } = useAuthUserWithOrg()
    const branchId = user.user_organization.branch_id
    const organizationId = user.user_organization.organization_id

    const form = useForm<PaymentTypeFormValues>({
        resolver: standardSchemaResolver(PaymentTypeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: formProps.defaultValues || {
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
    } = useCreate({ options: { onSuccess } })

    const {
        error: updateError,
        isPending: isUpdating,
        reset: resetUpdate,
        mutate: updatePaymentType,
    } = useUpdateById({ options: { onSuccess } })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<PaymentTypeFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (paymentTypeId) {
            updatePaymentType({
                id: paymentTypeId,
                payload: formData,
            })
        } else {
            const requestData: IPaymentTypeRequest = {
                ...formData,
                organization_id: organizationId,
                branch_id: branchId,
            }
            createPaymentTypeMutate(requestData)
        }
    }, handleFocusError)

    const isPending = isCreating || isUpdating

    const errorMessage = serverRequestErrExtractor({
        error: createError || updateError,
    })

    const isPaymentTypeOnChanged =
        JSON.stringify(form.watch()) !== JSON.stringify(formProps.defaultValues)

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

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
                            label="Payment Type Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="e.g., Cash, Bank Transfer, Credit Card"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Payment Method Type"
                            name="type"
                            render={({ field }) => (
                                <Select
                                    defaultValue={field.value}
                                    disabled={isDisabled(field.name)}
                                    onValueChange={field.onChange}
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
                            label="Number of Days (Optional)"
                            name="number_of_days"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseInt(e.target.value) ||
                                                undefined
                                        )
                                    }
                                    placeholder="e.g., 30 (for credit terms)"
                                    type="number"
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
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    autoComplete="off"
                                    className="max-h-40"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Optional description for the payment type"
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <Separator />
                <div className="space-y-2">
                    <FormErrorMessage errorMessage={errorMessage} />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            className="w-full self-end px-8 sm:w-fit"
                            onClick={() => {
                                form.reset(formProps.defaultValues)
                                resetCreate()
                                resetUpdate()
                            }}
                            size="sm"
                            type="button"
                            variant="ghost"
                        >
                            Reset
                        </Button>
                        <Button
                            className="w-full self-end px-8 sm:w-fit"
                            disabled={isPending || !isPaymentTypeOnChanged}
                            size="sm"
                            type="submit"
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

export const PaymentTypeCreateUpdateFormModal = ({
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
            className={cn('', className)}
            description={description}
            title={title}
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

export default PaymentTypeCreateUpdateFormModal
