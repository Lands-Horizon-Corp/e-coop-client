// src/forms/automatic-loan-deduction-form.tsx
import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import { MoonIcon, NotAllowedIcon, PlusIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import AccountPicker from '@/components/pickers/account-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import { automaticLoanDeductionSchema } from '@/validations/loan/automatic-loan-deduction-schema'

import {
    useCreateAutomaticLoanDeduction,
    useUpdateAutomaticLoanDeduction,
} from '@/hooks/api-hooks/loan/use-automatic-loan-deduction'

import { IAutomaticLoanDeductionRequest, IForm, TEntityId } from '@/types'

type TFormValues = z.infer<typeof automaticLoanDeductionSchema>

export interface IAutomaticLoanDeductionFormProps
    extends IForm<
        Partial<TFormValues>,
        IAutomaticLoanDeductionRequest,
        string
    > {
    automaticLoanDeductionId?: TEntityId
    readOnly?: boolean
    className?: string
    disabledFields?: Path<TFormValues>[]
}

export const AutomaticLoanDeductionCreateUpdateForm = ({
    readOnly,
    className,
    automaticLoanDeductionId,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IAutomaticLoanDeductionFormProps) => {
    const form = useForm<TFormValues>({
        resolver: zodResolver(automaticLoanDeductionSchema),
        defaultValues: {
            name: '',
            description: '',
            charges_percentage_1: 0,
            charges_percentage_2: 0,
            charges_amount: 0,
            charges_divisor: 1,
            min_amount: 0,
            max_amount: 0,
            anum: 1,
            ct: 0,
            ...defaultValues,
        },
    })

    const createMutation = useCreateAutomaticLoanDeduction({
        onSuccess,
        onError,
    })
    const updateMutation = useUpdateAutomaticLoanDeduction({
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit((formData) => {
        if (automaticLoanDeductionId) {
            updateMutation.mutate({
                id: automaticLoanDeductionId,
                data: formData,
            })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error, isPending } =
        automaticLoanDeductionId !== undefined ? updateMutation : createMutation

    const isDisabled = (field: Path<TFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="gap-4 grid grid-cols-1 sm:grid-cols-2"
                >
                    <div className="space-y-2">
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label="Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Name"
                                    disabled={isDisabled(field.name)}
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
                                    content={field.value}
                                    placeholder="A short description"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <div className="space-y-2 border bg-background/40 p-4 rounded-xl">
                            <div className="space-y-1">
                                <p>Account & References</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Other account connection & reference
                                    connection
                                </p>
                            </div>

                            <div className="grid gap-x-2 sm:grid-cols-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="account_id"
                                    label="Account"
                                    render={({ field }) => (
                                        <AccountPicker
                                            {...field}
                                            onSelect={(account) => {
                                                field.onChange(account.id)
                                            }}
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="link_account_id"
                                    label="Linked Account"
                                    render={({ field }) => (
                                        <AccountPicker
                                            {...field}
                                            onSelect={(account) => {
                                                field.onChange(account.id)
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 border bg-background/40 p-4 rounded-xl">
                            <div className="space-y-1">
                                <p>Charges Config</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Set up the charge percentages and amounts
                                    for this deduction
                                </p>
                            </div>

                            <div className="grid gap-x-2 sm:grid-cols-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="charges_percentage_1"
                                    label="Charges % 1"
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            placeholder="%"
                                            {...field}
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="charges_percentage_2"
                                    label="Charges % 2"
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            placeholder="%"
                                            {...field}
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="charges_amount"
                                    label="Charges Amount"
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            {...field}
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="charges_divisor"
                                    label="Charges Divisor"
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            {...field}
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="space-y-2 border bg-background/40 p-4 rounded-xl">
                            <div className="space-y-1">
                                <p>Ammount Limits</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Set up the charge percentages and amounts
                                    for this deduction
                                </p>
                            </div>

                            <div className="grid gap-x-2 sm:grid-cols-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="min_amount"
                                    label="Min Amount"
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            {...field}
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="max_amount"
                                    label="Max Amount"
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            {...field}
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 border bg-background/40 p-4 rounded-xl">
                            <div className="space-y-1">
                                <p>Terms Config</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Configure loan term and additional
                                    parameters
                                </p>
                            </div>

                            <div className="grid gap-x-2 sm:grid-cols-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="anum"
                                    label="Number of Months (Anum)"
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            {...field}
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="ct"
                                    label="CT"
                                    render={({ field }) => (
                                        <Input
                                            type="number"
                                            {...field}
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 border bg-background/40 p-4 rounded-xl">
                            <div className="space-y-1">
                                <p>Others</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Other Configuration
                                </p>
                            </div>

                            <div className="space-y-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="add_on"
                                    render={({ field }) => (
                                        <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                            <Switch
                                                id={field.name}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="order-1 after:absolute after:inset-0"
                                                aria-describedby={`${field.name}-desc`}
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className="size-fit rounded-full bg-secondary p-2">
                                                    <PlusIcon />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor={field.name}>
                                                        Add-On
                                                    </Label>
                                                    <p
                                                        id={`${field.name}-desc`}
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Enables loan add-ons to
                                                        complete or enhance the
                                                        base loan package.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="ao_rest"
                                    render={({ field }) => (
                                        <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                            <Switch
                                                id={field.name}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="order-1 after:absolute after:inset-0"
                                                aria-describedby={`${field.name}-desc`}
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className="size-fit rounded-full bg-secondary p-2">
                                                    <MoonIcon />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor={field.name}>
                                                        AO Rest
                                                    </Label>
                                                    <p
                                                        id={`${field.name}-desc`}
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Controls whether Add-On
                                                        values reset or persist
                                                        by default.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="exclude_renewal"
                                    render={({ field }) => (
                                        <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                            <Switch
                                                id={field.name}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="order-1 after:absolute after:inset-0"
                                                aria-describedby={`${field.name}-desc`}
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className="size-fit rounded-full bg-secondary p-2">
                                                    <NotAllowedIcon />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor={field.name}>
                                                        Exclude Renewal
                                                    </Label>
                                                    <p
                                                        id={`${field.name}-desc`}
                                                        className="text-xs text-muted-foreground"
                                                    >
                                                        Prevents this loan from
                                                        being included in
                                                        renewal-related
                                                        computations.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </fieldset>

                <FormErrorMessage errorMessage={error} />

                <Separator className="my-4" />
                <div className="flex justify-end gap-x-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => form.reset()}
                        className="px-6"
                    >
                        Reset
                    </Button>
                    <Button type="submit" disabled={isPending} className="px-6">
                        {isPending ? (
                            <LoadingSpinner />
                        ) : automaticLoanDeductionId ? (
                            'Update'
                        ) : (
                            'Create'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export const AutomaticLoanDeductionCreateUpdateFormModal = ({
    title = 'Create Automatic Loan Deduction',
    description = 'Fill out the form to create a new loan deduction.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IAutomaticLoanDeductionFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('max-w-[95vw]', className)}
            {...props}
        >
            <AutomaticLoanDeductionCreateUpdateForm
                {...formProps}
                onSuccess={(created) => {
                    formProps?.onSuccess?.(created)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}
