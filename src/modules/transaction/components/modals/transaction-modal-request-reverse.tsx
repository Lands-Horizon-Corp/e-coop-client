import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import {
    IVerification,
    IVerificationPasswordAdminRequest,
    VerificationPasswordAdminSchema,
    useRequestReverseTransaction,
} from '@/modules/authentication'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import { ShieldCheckIcon } from 'lucide-react'

import { ShieldLockIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import PasswordInput from '@/components/ui/password-input'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

type TTransactionReverseRequestValues = z.infer<
    typeof VerificationPasswordAdminSchema
>

export interface ITransactionBatchEndFormProps
    extends IClassProps,
        IForm<
            Partial<IVerificationPasswordAdminRequest>,
            IVerification,
            Error,
            TTransactionReverseRequestValues
        > {}

const TransactionReverseRequestForm = ({
    className,
    ...formProps
}: ITransactionBatchEndFormProps) => {
    const form = useForm<TTransactionReverseRequestValues>({
        resolver: standardSchemaResolver(VerificationPasswordAdminSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {},
    })

    const { formRef, handleFocusError } =
        useFormHelper<TTransactionReverseRequestValues>({
            form,
            ...formProps,
            autoSave: false,
            preventExitOnDirty: false,
        })

    const {
        mutate: requestReverse,
        error: rawError,
        isPending,
        isSuccess,
    } = useRequestReverseTransaction({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const onSubmit = form.handleSubmit(async (formData) => {
        requestReverse({
            user_organization_id: formData.user_organization_id,
            password: formData.password,
        })
    }, handleFocusError)

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <div className="flex flex-col items-center justify-center gap-y-2">
                        {isSuccess ? (
                            <ShieldCheckIcon className="size-16 text-primary animate-in" />
                        ) : (
                            <ShieldLockIcon className="size-16 text-orange-400 animate-out" />
                        )}
                    </div>
                    {isPending && <LoadingSpinner className="mx-auto" />}
                    <FormFieldWrapper
                        control={form.control}
                        name="user_organization_id"
                        label="Select Owner/Admin"
                        render={({ field }) => (
                            <EmployeePicker
                                {...field}
                                mode="owner"
                                value={form.getValues('user_organization')}
                                onSelect={(value) => {
                                    field.onChange(value?.id)
                                    form.setValue(
                                        'user_organization',
                                        value.user
                                    )
                                }}
                                placeholder="Select Employee"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <PasswordInput
                                {...field}
                                id="password-field"
                                autoComplete="off"
                                placeholder="Password"
                            />
                        )}
                    />
                </fieldset>
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <FormErrorMessage errorMessage={rawError} />
                    <Button
                        size="sm"
                        type="submit"
                        disabled={isPending || formProps.readOnly}
                        className="mt-4 w-full self-end px-8"
                    >
                        {isPending ? <LoadingSpinner /> : 'Request Reverse'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export const TransactionReverseRequestFormModal = ({
    title = 'Request Reverse Transaction',
    description = 'Fill out the form to request a reverse transaction.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ITransactionBatchEndFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <TransactionReverseRequestForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TransactionReverseRequestFormModal
