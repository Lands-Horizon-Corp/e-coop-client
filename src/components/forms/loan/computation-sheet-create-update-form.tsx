import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import {
    HandDropCoinsIcon,
    LinkIcon,
    NotAllowedIcon,
    PercentIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
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

import { computationSheetSchema } from '@/validations/loan/computation-sheet-schema'

import {
    useCreateComputationSheet,
    useUpdateComputationSheet,
} from '@/hooks/api-hooks/loan/use-computation-sheet'

import {
    IClassProps,
    IComputationSheet,
    IComputationSheetRequest,
    IForm,
    TEntityId,
} from '@/types'

type TFormValues = z.infer<typeof computationSheetSchema>

export interface IComputationSheetFormProps
    extends IClassProps,
        IForm<Partial<IComputationSheetRequest>, IComputationSheet, string> {
    computationSheetId?: TEntityId
}

const ComputationSheetCreateUpdateForm = ({
    readOnly,
    className,
    computationSheetId,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IComputationSheetFormProps) => {
    const form = useForm<TFormValues>({
        resolver: zodResolver(computationSheetSchema),
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
            ...defaultValues,
        },
    })

    const createMutation = useCreateComputationSheet({ onSuccess, onError })
    const updateMutation = useUpdateComputationSheet({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (computationSheetId) {
            updateMutation.mutate({ id: computationSheetId, data: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error, isPending } = computationSheetId
        ? updateMutation
        : createMutation

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
                    className="space-y-4 sm:gap-y-3"
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="name"
                        label="Name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                placeholder="Computation Sheet Name"
                                disabled={isDisabled(field.name)}
                                className="input input-bordered w-full"
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
                                placeholder="Description (short)"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="comaker_account"
                        label="Comaker Account"
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                placeholder="Comaker Account"
                                disabled={isDisabled(field.name)}
                                className="input input-bordered w-full"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="deliquent_account"
                        render={({ field }) => (
                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                <Switch
                                    id={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="order-1 after:absolute after:inset-0"
                                    aria-describedby={`${field.name}`}
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
                                            id={`${field.name}`}
                                            className="text-xs text-muted-foreground"
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
                                    id={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="order-1 after:absolute after:inset-0"
                                    aria-describedby={`${field.name}`}
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
                                            id={`${field.name}`}
                                            className="text-xs text-muted-foreground"
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
                                    id={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="order-1 after:absolute after:inset-0"
                                    aria-describedby={`${field.name}`}
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
                                            id={`${field.name}`}
                                            className="text-xs text-muted-foreground"
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
                                    id={field.name}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="order-1 after:absolute after:inset-0"
                                    aria-describedby={`${field.name}`}
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
                                            id={`${field.name}`}
                                            className="text-xs text-muted-foreground"
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

                <FormErrorMessage errorMessage={error} />

                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : computationSheetId ? (
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

export const ComputationSheetUpdateMiniForm = ({
    readOnly,
    className,
    computationSheetId,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IComputationSheetFormProps & { computationSheetId: TEntityId }) => {
    const form = useForm<TFormValues>({
        resolver: zodResolver(computationSheetSchema),
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
            ...defaultValues,
        },
    })

    const { error, isPending, mutate } = useUpdateComputationSheet({
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit((formData) => {
        mutate({ id: computationSheetId, data: formData })
    })

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
                    className="flex justify-between gap-x-4"
                >
                    <div className="w-8/12 space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label="Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="text"
                                    placeholder="Computation Sheet Name"
                                    disabled={isDisabled(field.name)}
                                    className="input input-bordered w-full"
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
                                    placeholder="Description (short)"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="comaker_account"
                            label="Comaker Account"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="Comaker Account"
                                    disabled={isDisabled(field.name)}
                                    className="input input-bordered w-full"
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
                                        id={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="order-1 after:absolute after:inset-0"
                                        aria-describedby={`${field.name}`}
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
                                        id={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="order-1 after:absolute after:inset-0"
                                        aria-describedby={`${field.name}`}
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
                                        id={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="order-1 after:absolute after:inset-0"
                                        aria-describedby={`${field.name}`}
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
                                        id={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="order-1"
                                        aria-describedby={`${field.name}`}
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

                <FormErrorMessage errorMessage={error} />

                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : computationSheetId ? (
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

export const ComputationSheetCreateUpdateFormModal = ({
    title = 'Create Computation Sheet',
    description = 'Fill out the form to create a new computation sheet.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IComputationSheetFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <ComputationSheetCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default ComputationSheetCreateUpdateForm
