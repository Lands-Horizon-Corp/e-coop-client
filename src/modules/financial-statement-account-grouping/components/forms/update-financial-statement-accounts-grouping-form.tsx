import { Path, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/helpers'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import {
    IFinancialStatementAccountGrouping,
    IFinancialStatementAccountGroupingRequest,
    TFinancialStatementGroupingFormValues,
    financialStatementGroupingSchema,
    useUpdateById,
} from '@/modules/financial-statement-account-grouping'

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

import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'

import { IClassProps, IForm, TEntityId } from '@/types'

export interface IFinancialStatementGroupingFormProps
    extends IClassProps,
        IForm<
            Partial<IFinancialStatementAccountGroupingRequest>,
            IFinancialStatementAccountGrouping,
            string,
            TFinancialStatementGroupingFormValues
        > {
    groupingId?: TEntityId
}

const FinancialStatementAccountsGroupingUpdateForm = ({
    groupingId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onSuccess,
}: IFinancialStatementGroupingFormProps) => {
    const { currentAuth: user } = useAuthUserWithOrgBranch()
    const organizationId = user?.user_organization?.organization?.id
    const branchId = user?.user_organization?.branch?.id

    const form = useForm<TFinancialStatementGroupingFormValues>({
        resolver: zodResolver(financialStatementGroupingSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
        },
    })

    const updateMutation = useUpdateById({
        options: {
            onSuccess: (data) => {
                onSuccess?.(data)
            },
        },
    })

    const onSubmit = form.handleSubmit(
        (formData: TFinancialStatementGroupingFormValues) => {
            if (groupingId) {
                updateMutation.mutate({
                    id: groupingId,
                    payload: {
                        organization_id: organizationId,
                        branch_id: branchId,
                        ...formData,
                    },
                })
            }
        }
    )

    const { error, isPending, reset } = updateMutation

    const isDisabled = (field: Path<TFinancialStatementGroupingFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

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
                    <FormFieldWrapper
                        control={form.control}
                        name="name"
                        label="Name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Group Name"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label="Description"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Description"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            name="debit"
                            label="Debit Type"
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isDisabled(field.name)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="positive">
                                            positive
                                        </SelectItem>
                                        <SelectItem value="negative">
                                            negative
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="credit"
                            label="Credit Type"
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    disabled={isDisabled(field.name)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="positive">
                                            positive
                                        </SelectItem>
                                        <SelectItem value="negative">
                                            negative
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <FormFieldWrapper
                        control={form.control}
                        name="from_code"
                        label="From Code"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="From Code"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="to_code"
                        label="To Code"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="To Code"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                </fieldset>
                {!readOnly && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <FormErrorMessage
                                errorMessage={error ? error.message : null}
                            />
                            <div className="flex items-center justify-end gap-x-2">
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        form.reset()
                                        reset()
                                    }}
                                    className="w-full sm:w-fit px-8"
                                >
                                    Reset
                                </Button>
                                <Button
                                    size="sm"
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full sm:w-fit px-8"
                                >
                                    {isPending ? (
                                        <LoadingSpinner />
                                    ) : groupingId ? (
                                        'Update'
                                    ) : (
                                        'Create'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </form>
        </Form>
    )
}

const FinancialStatementAccountGroupingUpdateModal = ({
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IFinancialStatementGroupingFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('shadow-none', className)}
            overlayClassName="!bg-transparent backdrop-blur-sm"
            {...props}
        >
            <FinancialStatementAccountsGroupingUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default FinancialStatementAccountGroupingUpdateModal
