import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
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
                        label="Select Owner/Admin"
                        name="user_organization_id"
                        render={({ field }) => (
                            <EmployeePicker
                                {...field}
                                mode="owner"
                                onSelect={(value) => {
                                    field.onChange(value?.id)
                                    form.setValue('user_organization', value)
                                }}
                                placeholder="Select Employee"
                                value={form.getValues('user_organization')}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <PasswordInput
                                {...field}
                                autoComplete="off"
                                id="password-field"
                                placeholder="Password"
                            />
                        )}
                    />
                </fieldset>
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <FormErrorMessage errorMessage={error} />
                    <Button
                        className="mt-4 w-full self-end px-8"
                        disabled={isPending || formProps.readOnly}
                        size="sm"
                        type="submit"
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
            className={cn('', className)}
            description={description}
            title={title}
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
