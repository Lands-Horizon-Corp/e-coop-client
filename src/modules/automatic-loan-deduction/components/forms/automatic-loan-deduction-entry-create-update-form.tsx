import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker } from '@/modules/account'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { MoonIcon, NotAllowedIcon, PlusIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IForm, TEntityId } from '@/types'

import {
    IAutomaticLoanDeductionRequest,
    useCreateAutomaticLoanDeduction,
    useUpdateAutomaticLoanDeductionById,
} from '../..'
import {
    AutomaticLoanDeductionSchema,
    TAutomaticLoanDeductionSchema,
} from '../../automatic-loan-deduction.validation'

export interface IAutomaticLoanDeductionFormProps
    extends IForm<
        Partial<TAutomaticLoanDeductionSchema>,
        IAutomaticLoanDeductionRequest,
        Error
    > {
    automaticLoanDeductionId?: TEntityId
    className?: string
}

export const AutomaticLoanDeductionCreateUpdateForm = ({
    className,
    automaticLoanDeductionId,
    ...formProps
}: IAutomaticLoanDeductionFormProps) => {
    const form = useForm<TAutomaticLoanDeductionSchema>({
        resolver: standardSchemaResolver(AutomaticLoanDeductionSchema),
        defaultValues: {
            description: '',
            charges_percentage_1: 0,
            charges_percentage_2: 0,
            charges_amount: 0,
            charges_divisor: 1,
            min_amount: 0,
            max_amount: 0,
            anum: 1,
            ct: 0,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateAutomaticLoanDeduction({
        options: {
            ...withToastCallbacks({
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateAutomaticLoanDeductionById({
        options: {
            ...withToastCallbacks({
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TAutomaticLoanDeductionSchema>({
            form,
            ...formProps,
            autoSave: automaticLoanDeductionId !== undefined,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (automaticLoanDeductionId) {
            updateMutation.mutate({
                id: automaticLoanDeductionId,
                payload: formData,
            })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = automaticLoanDeductionId !== undefined ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('w-full max-w-full space-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="gap-4 grid grid-cols-1"
                >
                    <div className="space-y-4">
                        <div className="space-y-2 ">
                            <div className="space-y-1">
                                <p>Account & References</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Other account connection & reference
                                    connection
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="account_id"
                                    label="Account"
                                    render={({ field }) => (
                                        <AccountPicker
                                            {...field}
                                            hideDescription
                                            value={form.getValues('account')}
                                            onSelect={(account) => {
                                                field.onChange(account.id)
                                                form.setValue(
                                                    'account',
                                                    account,
                                                    { shouldDirty: true }
                                                )
                                            }}
                                            disabled={isDisabled(field.name)}
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
                                            hideDescription
                                            value={form.getValues(
                                                'link_account'
                                            )}
                                            onSelect={(account) => {
                                                field.onChange(account.id)
                                                form.setValue(
                                                    'link_account',
                                                    account,
                                                    { shouldDirty: true }
                                                )
                                            }}
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
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
                        <div className="grid grid-cols-2 gap-x-4">
                            <div className="space-y-2 border bg-popover p-4 rounded-xl">
                                <div className="space-y-1">
                                    <p>Ammount Limits</p>
                                    <p className="text-xs text-muted-foreground/70">
                                        Set up the charge percentages and
                                        amounts for this deduction
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
                                                disabled={isDisabled(
                                                    field.name
                                                )}
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
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 border bg-popover p-4 rounded-xl">
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
                                                disabled={isDisabled(
                                                    field.name
                                                )}
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
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="space-y-1">
                                <p>Others</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Other Configuration
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="add_on"
                                    render={({ field }) => (
                                        <Label
                                            htmlFor={field.name}
                                            className="shadow-xs has-data-[state=checked]:bg-gradient-to-tl from-primary/70 to-popover relative has-data flex w-full items-center gap-2 rounded-lg border border-input p-2 outline-none duration-200 ease-out cursor-pointer"
                                        >
                                            <Checkbox
                                                id={field.name}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                className="order-1"
                                                aria-describedby={`${field.name}-desc`}
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className="size-fit rounded-full bg-secondary p-1">
                                                    <PlusIcon className="size-3" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <span>Add-On</span>
                                                </div>
                                            </div>
                                        </Label>
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="ao_rest"
                                    render={({ field }) => (
                                        <Label
                                            htmlFor={field.name}
                                            className="shadow-xs has-data-[state=checked]:bg-gradient-to-tl from-primary/70 to-popover relative has-data flex w-full items-center gap-2 rounded-lg border border-input p-2 outline-none duration-200 ease-out cursor-pointer"
                                        >
                                            <Checkbox
                                                id={field.name}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                className="order-1"
                                                aria-describedby={`${field.name}-desc`}
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className="size-fit rounded-full bg-secondary p-1">
                                                    <MoonIcon className="size-3" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <span>AO Rest</span>
                                                </div>
                                            </div>
                                        </Label>
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="exclude_renewal"
                                    render={({ field }) => (
                                        <Label
                                            htmlFor={field.name}
                                            className="shadow-xs ease-in-out duration-100 transition-colors has-data-[state=checked]:bg-gradient-to-tl from-primary/70 bg-muted to-popover relative has-data flex w-full items-center gap-2 rounded-lg border border-input p-2 outline-none duration-500 ease-out cursor-pointer"
                                        >
                                            <Checkbox
                                                id={field.name}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                className="order-1"
                                                aria-describedby={`${field.name}-desc`}
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className="size-fit rounded-full bg-secondary p-1">
                                                    <NotAllowedIcon className="size-3" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <span>Exclude Renewal</span>
                                                </div>
                                            </div>
                                        </Label>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label="Remrks / Description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                disabled={isDisabled(field.name)}
                                placeholder="Optional description or remarks"
                            />
                        )}
                    />
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    className="sticky bottom-0"
                    disableSubmit={!form.formState.isDirty}
                    submitText={automaticLoanDeductionId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
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
            className={cn('!max-w-5xl', className)}
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
