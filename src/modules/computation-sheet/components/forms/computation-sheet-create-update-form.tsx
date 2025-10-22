import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { CurrencyCombobox } from '@/modules/currency'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import {
    HandDropCoinsIcon,
    LinkIcon,
    NotAllowedIcon,
    PercentIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateComputationSheet,
    useUpdateComputationSheetById,
} from '../../computation-sheet.service'
import {
    IComputationSheet,
    IComputationSheetRequest,
} from '../../computation-sheet.types'
import { ComputationSheetSchema } from '../../computation-sheet.validation'

type TFormValues = z.infer<typeof ComputationSheetSchema>

export interface IComputationSheetFormProps
    extends IClassProps,
        IForm<Partial<IComputationSheetRequest>, IComputationSheet, Error> {
    computationSheetId?: TEntityId
}

const ComputationSheetCreateUpdateForm = ({
    className,
    computationSheetId,
    ...formProps
}: IComputationSheetFormProps) => {
    const form = useForm<TFormValues>({
        resolver: standardSchemaResolver(ComputationSheetSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            deliquent_account: false,
            fines_account: false,
            interest_account: false,
            comaker_account: 0,
            exist_account: false,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateComputationSheet({
        options: {
            ...withToastCallbacks({
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateComputationSheetById({
        options: {
            ...withToastCallbacks({
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TFormValues>({
            form,
            autoSave: !!computationSheetId,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (computationSheetId) {
            updateMutation.mutate({ id: computationSheetId, payload: formData })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = computationSheetId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="space-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Name"
                        name="name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                className="input input-bordered w-full"
                                disabled={isDisabled(field.name)}
                                placeholder="Computation Sheet Name"
                                type="text"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        description="WARN: This is uneditable once saved"
                        label="Currency *"
                        name="currency_id"
                        render={({ field }) => (
                            <CurrencyCombobox
                                disabled={
                                    isDisabled(field.name) ||
                                    computationSheetId !== undefined
                                }
                                onChange={(selected) =>
                                    field.onChange(selected.id)
                                }
                                placeholder="Select Currency"
                                value={field.value}
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
                                content={field.value}
                                disabled={isDisabled(field.name)}
                                placeholder="Description (short)"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Comaker Account"
                        name="comaker_account"
                        render={({ field }) => (
                            <Input
                                {...field}
                                className="input input-bordered w-full"
                                disabled={isDisabled(field.name)}
                                placeholder="Comaker Account"
                                type="number"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="deliquent_account"
                        render={({ field }) => (
                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                <Switch
                                    aria-describedby={`${field.name}`}
                                    checked={field.value}
                                    className="order-1 after:absolute after:inset-0"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    onCheckedChange={field.onChange}
                                />
                                <div className="flex grow items-center gap-3">
                                    <div className="size-fit rounded-full bg-secondary p-2">
                                        <NotAllowedIcon />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={field.name}>
                                            Deliquent Account
                                            <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                        </Label>
                                        <p
                                            className="text-xs text-muted-foreground"
                                            id={`${field.name}`}
                                        >
                                            Marks the computation sheet as
                                            related to accounts with overdue or
                                            unpaid balances.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="fines_account"
                        render={({ field }) => (
                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                <Switch
                                    aria-describedby={`${field.name}`}
                                    checked={field.value}
                                    className="order-1 after:absolute after:inset-0"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    onCheckedChange={field.onChange}
                                />
                                <div className="flex grow items-center gap-3">
                                    <div className="size-fit rounded-full bg-secondary p-2">
                                        <HandDropCoinsIcon />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={field.name}>
                                            Fines Account
                                            <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                        </Label>
                                        <p
                                            className="text-xs text-muted-foreground"
                                            id={`${field.name}`}
                                        >
                                            Indicates that this computation
                                            involves penalties or fines applied
                                            to the account.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="interest_account"
                        render={({ field }) => (
                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                <Switch
                                    aria-describedby={`${field.name}`}
                                    checked={field.value}
                                    className="order-1 after:absolute after:inset-0"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    onCheckedChange={field.onChange}
                                />
                                <div className="flex grow items-center gap-3">
                                    <div className="size-fit rounded-full bg-secondary p-2">
                                        <PercentIcon />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={field.name}>
                                            Interest Account
                                            <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                        </Label>
                                        <p
                                            className="text-xs text-muted-foreground"
                                            id={`${field.name}`}
                                        >
                                            Specifies that interest calculations
                                            are included or relevant in this
                                            computation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="exist_account"
                        render={({ field }) => (
                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                <Switch
                                    aria-describedby={`${field.name}`}
                                    checked={field.value}
                                    className="order-1 after:absolute after:inset-0"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    onCheckedChange={field.onChange}
                                />
                                <div className="flex grow items-center gap-3">
                                    <div className="size-fit rounded-full bg-secondary p-2 ">
                                        <LinkIcon />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={field.name}>
                                            Exist Account
                                            <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                        </Label>
                                        <p
                                            className="text-xs text-muted-foreground"
                                            id={`${field.name}`}
                                        >
                                            Flags that the account already
                                            exists in the system, preventing
                                            duplication or re-creation.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </fieldset>

                <FormFooterResetSubmit
                    className="sticky bottom-0"
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={computationSheetId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const ComputationSheetUpdateMiniForm = ({
    className,
    computationSheetId,
    ...formProps
}: IComputationSheetFormProps & { computationSheetId: TEntityId }) => {
    const form = useForm<TFormValues>({
        resolver: standardSchemaResolver(ComputationSheetSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            deliquent_account: false,
            fines_account: false,
            interest_account: false,
            comaker_account: 0,
            exist_account: false,
            ...formProps.defaultValues,
        },
    })

    const {
        error: rawError,
        isPending,
        mutate,
        reset,
    } = useUpdateComputationSheetById({
        options: {
            ...withToastCallbacks({
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TFormValues>({
            form,
            ...formProps,
            autoSave: true, // Always true since we have computationSheetId
        })

    const error = serverRequestErrExtractor({ error: rawError })

    const onSubmit = form.handleSubmit((formData) => {
        mutate({ id: computationSheetId, payload: formData })
    }, handleFocusError)

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="flex justify-between gap-x-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <div className="w-8/12 space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    className="input input-bordered w-full"
                                    disabled={isDisabled(field.name)}
                                    placeholder="Computation Sheet Name"
                                    type="text"
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
                                    content={field.value}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Description (short)"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Comaker Account"
                            name="comaker_account"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    className="input input-bordered w-full"
                                    disabled={isDisabled(field.name)}
                                    placeholder="Comaker Account"
                                    type="number"
                                />
                            )}
                        />
                    </div>
                    <div className="w-4/12 space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            name="deliquent_account"
                            render={({ field }) => (
                                <div className="shadow-xs relative flex w-full items-center gap-2 rounded-lg border border-input p-1 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                    <Switch
                                        aria-describedby={`${field.name}`}
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <NotAllowedIcon />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Deliquent Account
                                                <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="fines_account"
                            render={({ field }) => (
                                <div className="shadow-xs relative flex w-full items-center gap-2 rounded-lg border border-input p-1 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                    <Switch
                                        aria-describedby={`${field.name}`}
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <HandDropCoinsIcon />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Fines Account
                                                <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="interest_account"
                            render={({ field }) => (
                                <div className="shadow-xs relative flex w-full items-center gap-2 rounded-lg border border-input p-1 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                    <Switch
                                        aria-describedby={`${field.name}`}
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <PercentIcon />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Interest Account
                                                <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="exist_account"
                            render={({ field }) => (
                                <div className="shadow-xs relative flex w-full items-center gap-2 rounded-lg border border-input p-1 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                    <Switch
                                        aria-describedby={`${field.name}`}
                                        checked={field.value}
                                        className="order-1"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2 ">
                                            <LinkIcon />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Exist Account
                                                <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Update"
                />
            </form>
        </Form>
    )
}

export const ComputationSheetCreateUpdateFormModal = ({
    title = 'Create Computation Sheet',
    description = 'Fill out the form to create a new computation sheet.',
    className,
    formProps,
    hideOnSuccess = true,
    ...props
}: IModalProps & {
    formProps?: Omit<IComputationSheetFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <ComputationSheetCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    if (hideOnSuccess) props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default ComputationSheetCreateUpdateForm
