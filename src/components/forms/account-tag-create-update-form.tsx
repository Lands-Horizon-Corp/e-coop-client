import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { TAG_CATEGORY } from '@/constants'
import { Path, useForm } from 'react-hook-form'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import Modal, { IModalProps } from '@/components/modals/modal'
import AccountPicker from '@/components/pickers/account-picker'
import InputColor from '@/components/pickers/color-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form, FormControl } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import {
    descriptionSchema,
    descriptionTransformerSanitizer,
} from '@/validations/common'

import {
    useCreateAccountTag,
    useUpdateAccountTag,
} from '@/hooks/api-hooks/use-account-tag'
import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'

import {
    IAccounTagRequest,
    IAccountTag,
    IClassProps,
    IForm,
    TEntityId,
    TIcon,
    TTagCategory,
} from '@/types'

const AccountTagSchema = z.object({
    account_id: z.string().min(1, 'Account is required'),
    account: z.any().optional(),
    name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
    description: descriptionSchema
        .optional()
        .transform(descriptionTransformerSanitizer),
    category: z
        .string()
        .min(1, 'Category is required') as z.ZodType<TTagCategory>,
    color: z.string().optional(),
    icon: z.string().optional(),
})

export type AccountTagFormValues = z.infer<typeof AccountTagSchema>

export interface AccountTagFormProps
    extends IClassProps,
        IForm<
            Partial<IAccounTagRequest>,
            IAccountTag,
            string,
            AccountTagFormValues
        > {
    accountTagId?: TEntityId
}

const AccountTagCreateUpdateForm = ({
    accountTagId,
    className,
    disabledFields,
    onError,
    onSuccess,
    defaultValues,
    readOnly,
}: AccountTagFormProps) => {
    const form = useForm<AccountTagFormValues>({
        resolver: zodResolver(AccountTagSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: { ...defaultValues },
    })

    const {
        error: createError,
        isPending: isCreating,
        reset: resetCreate,
        mutate: createAccountTag,
    } = useCreateAccountTag({ onSuccess, onError })

    const {
        error: updateError,
        isPending: isUpdating,
        reset: resetUpdate,
        mutate: updateAccountTag,
    } = useUpdateAccountTag({ onSuccess, onError })

    const onSubmit = form.handleSubmit((data) => {
        if (accountTagId) {
            updateAccountTag({ accountTagId, data })
        } else {
            createAccountTag(data)
        }
    })

    const isPending = isCreating || isUpdating
    const error = createError || updateError

    const isDisabled = (field: Path<AccountTagFormValues>) =>
        readOnly || disabledFields?.includes(field) || isPending || false

    const isAccountTagChanged =
        JSON.stringify(form.watch()) !== JSON.stringify(defaultValues)

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
                    className="grid gap-x-6 gap-y-4"
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="name"
                        label="Tag Name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                value={field.value || ''}
                                placeholder="Enter tag name"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="account_id"
                        label="Account"
                        render={({ field }) => (
                            <AccountPicker
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue('account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                                placeholder="Select an account"
                                value={form.getValues('account')}
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
                                placeholder="Optional description"
                                className="max-h-40"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="category"
                        label="Category"
                        render={({ field }) => (
                            <FormControl>
                                <Select
                                    onValueChange={(selectedValue) => {
                                        field.onChange(selectedValue)
                                    }}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        {field.value || 'select Account Type'}
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(TAG_CATEGORY).map(
                                            (account) => {
                                                return (
                                                    <SelectItem
                                                        key={account}
                                                        value={account}
                                                    >
                                                        {account}
                                                    </SelectItem>
                                                )
                                            }
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="color"
                        label="Select Color"
                        render={({ field }) => (
                            <InputColor
                                value={field.value ?? ''}
                                onChange={field.onChange}
                                alpha={true}
                                className="mt-0 w-full"
                                inputClassName="h-10 w-full "
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="icon"
                        label="Icon"
                        render={({ field }) => (
                            <IconCombobox
                                value={field.value as TIcon}
                                onChange={field.onChange}
                                placeholder="Select an icon"
                                disabled={isDisabled(field.name)}
                                className="w-full"
                            />
                        )}
                    />
                </fieldset>

                <Separator />

                <div className="space-y-2">
                    <FormErrorMessage errorMessage={error} />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                form.reset(defaultValues)
                                resetCreate()
                                resetUpdate()
                            }}
                            className="w-full sm:w-fit px-8"
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || !isAccountTagChanged}
                            className="w-full sm:w-fit px-8"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : accountTagId ? (
                                'Save'
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

export const AccountTagFormModal = ({
    title = 'Create Account Tag',
    description = 'Fill out the form to manage account tag',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<AccountTagFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <AccountTagCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default AccountTagCreateUpdateForm
