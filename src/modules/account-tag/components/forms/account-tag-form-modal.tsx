import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { useCreateAccountTag, useUpdateById } from '@/modules/account-tag'
import { TAG_CATEGORY } from '@/modules/tag-template/tag.constants'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { TIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import ColorPicker from '@/components/pickers/color-picker'
import { Form, FormControl } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { IAccounTagRequest, IAccountTag } from '../../account-tag.types'
import {
    AccountTagFormValues,
    AccountTagSchema,
} from '../../account-tag.validation'

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
    ...formProps
}: AccountTagFormProps) => {
    const form = useForm<AccountTagFormValues>({
        resolver: standardSchemaResolver(AccountTagSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const {
        error: createError,
        isPending: isCreating,
        reset: resetCreate,
        mutate: createAccountTag,
    } = useCreateAccountTag({ options: { onSuccess: formProps.onSuccess } })

    const {
        error: updateError,
        isPending: isUpdating,
        reset: resetUpdate,
        mutate: updateAccountTag,
    } = useUpdateById({ options: { onSuccess: formProps.onSuccess } })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<AccountTagFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((data) => {
        if (accountTagId) {
            updateAccountTag({ id: accountTagId, payload: data })
        } else {
            createAccountTag(data)
        }
    }, handleFocusError)

    const isPending = isCreating || isUpdating
    const error = serverRequestErrExtractor({
        error: createError || updateError,
    })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Tag Name"
                        name="name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Enter tag name"
                                value={field.value || ''}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Account"
                        name="account_id"
                        render={({ field }) => (
                            <AccountPicker
                                disabled={isDisabled(field.name)}
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue('account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                                placeholder="Select an account"
                                value={form.getValues('account')}
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
                                className="max-h-40"
                                disabled={isDisabled(field.name)}
                                placeholder="Optional description"
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Category"
                        name="category"
                        render={({ field }) => (
                            <FormControl>
                                <Select
                                    defaultValue={field.value}
                                    disabled={isDisabled(field.name)}
                                    onValueChange={(selectedValue) => {
                                        field.onChange(selectedValue)
                                    }}
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
                        label="Select Color"
                        name="color"
                        render={({ field }) => (
                            <ColorPicker
                                alpha={true}
                                className="mt-0 w-full"
                                inputClassName="h-10 w-full"
                                onChange={field.onChange}
                                value={field.value ?? ''}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Icon"
                        name="icon"
                        render={({ field }) => (
                            <IconCombobox
                                className="w-full"
                                disabled={isDisabled(field.name)}
                                onChange={field.onChange}
                                placeholder="Select an icon"
                                value={field.value as TIcon}
                            />
                        )}
                    />
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        resetCreate()
                        resetUpdate()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={accountTagId ? 'Update' : 'Create'}
                />
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
            className={cn('', className)}
            description={description}
            title={title}
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

export default AccountTagFormModal
