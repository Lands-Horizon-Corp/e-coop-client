import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { useCreate, useUpdateById } from '@/modules/account-tag'
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
    } = useCreate({ options: { onSuccess: formProps.onSuccess } })

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
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
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
                                    disabled={isDisabled(field.name)}
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
                            <ColorPicker
                                value={field.value ?? ''}
                                onChange={field.onChange}
                                alpha={true}
                                className="mt-0 w-full"
                                inputClassName="h-10 w-full"
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

                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={accountTagId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        resetCreate()
                        resetUpdate()
                    }}
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

export default AccountTagFormModal
