import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import { useUpdateGeneralLedgerAccountsGrouping } from '@/hooks/api-hooks/general-ledger-definitions/use-general-ledger-accounts-grouping'

import {
    IClassProps,
    IForm,
    IGeneralLedgerAccountsGrouping,
    IGeneralLedgerAccountsGroupingRequest,
    TEntityId,
} from '@/types'

import Modal, { IModalProps } from '../modals/modal'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select'

const glGroupingSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    debit: z.enum(['positive', 'negative'], {
        required_error: 'Debit is required',
    }),
    credit: z.enum(['positive', 'negative'], {
        required_error: 'Credit is required',
    }),
    from_code: z.coerce
        .number({ invalid_type_error: 'From Code must be a number' })
        .optional(),
    to_code: z.coerce
        .number({ invalid_type_error: 'To Code must be a number' })
        .optional(),
})

type TGLGroupingFormValues = z.infer<typeof glGroupingSchema>

export interface IGLGroupingFormProps
    extends IClassProps,
        IForm<
            Partial<IGeneralLedgerAccountsGroupingRequest>,
            IGeneralLedgerAccountsGrouping,
            string,
            TGLGroupingFormValues
        > {
    groupingId?: TEntityId
}

const GLAccountsGroupingUpdateForm = ({
    groupingId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IGLGroupingFormProps) => {
    const form = useForm<TGLGroupingFormValues>({
        resolver: zodResolver(glGroupingSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
        },
    })

    const updateMutation = useUpdateGeneralLedgerAccountsGrouping({
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit((formData) => {
        if (groupingId) {
            updateMutation.mutate({
                generalLedgerAccountsGroupingId: groupingId,
                data: formData,
            })
        }
    })

    const { error, isPending, reset } = updateMutation

    const isDisabled = (field: Path<TGLGroupingFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

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
                                        <SelectItem value="positve">
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
                            <FormErrorMessage errorMessage={error} />
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

export const GLAccountsGroupingUpdateModal = ({
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IGLGroupingFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn(' shadow-none', className)}
            overlayClassName="!bg-transparent backdrop-blur-sm"
            {...props}
        >
            <GLAccountsGroupingUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default GLAccountsGroupingUpdateModal
