import { useCallback, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IAccount } from '@/modules/account'
import CompanyCombobox from '@/modules/company/components/combobox'
import { currencyFormat } from '@/modules/currency'
import {
    IJournalVoucher,
    IJournalVoucherRequest,
    JournalVoucherSchema,
    journalVoucherBaseKey,
    useCreateJournalVoucher,
    useUpdateJournalVoucherById,
} from '@/modules/journal-voucher'
import {
    IJournalVoucherEntryRequest,
    JournalVoucherEntrySchema,
} from '@/modules/journal-voucher-entry'
import { JournalVoucherTagsManagerPopover } from '@/modules/journal-voucher-tag/components/journal-voucher-tag-management'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { useJournalVoucherStore } from '@/store/journal-voucher-store'
import { useMemberPickerStore } from '@/store/member-picker-store'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { BookIcon, XIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { CommandShortcut } from '@/components/ui/command'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import JournalVoucherStatusIndicator from '../journal-voucher-status-indicator'
import { JournalEntryTable } from './journal-entry-table'

type TJournalVoucherFormValues = z.infer<typeof JournalVoucherSchema>

export interface IJournalVoucherCreateUpdateFormProps
    extends IClassProps,
        IForm<
            IJournalVoucher,
            IJournalVoucherRequest,
            Error,
            TJournalVoucherFormValues
        > {
    journalVoucherId?: TEntityId
    mode?: 'create' | 'update' | 'readOnly'
}

type TValidateResult =
    | {
          isValid: true
          validatedEntries: IJournalVoucherEntryRequest[]
      }
    | {
          isValid: false
          error: string
      }
type TValidateJournalEntryProps = {
    data: IJournalVoucherEntryRequest[]
}

const ValidateJournalEntry = ({
    data,
}: TValidateJournalEntryProps): TValidateResult => {
    const transformedEntries = data.map((entry) => {
        const memberProfile = entry.member_profile as
            | IMemberProfile
            | undefined
            | null
        const account = entry.account as IAccount | undefined | null

        return {
            cash_check_voucher_number: entry.cash_check_voucher_number,
            id: entry.id,
            credit: entry.credit,
            debit: entry.debit,
            member_profile_id: memberProfile?.id,
            account_id: account?.id,
        }
    })

    const parsedEntries = z
        .array(JournalVoucherEntrySchema)
        .safeParse(transformedEntries)

    if (!parsedEntries.success) {
        const firstError = parsedEntries.error.issues[0]
        const fieldPath = firstError.path

        const fieldName = String(fieldPath[fieldPath.length - 1])
        const errorMessage = firstError.message

        const errorLocation =
            fieldPath.length > 1
                ? `Entry ${parseInt(String(fieldPath[0])) + 1}: `
                : ''

        return {
            isValid: false,
            error: `Field Error: ${errorLocation}name: ${fieldName} message: ${errorMessage}`,
        }
    }

    return {
        isValid: true,
        validatedEntries: transformedEntries,
    }
}

const JournalVoucherCreateUpdateForm = ({
    className,
    journalVoucherId,
    defaultValues,
    mode = 'create',
    ...formProps
}: IJournalVoucherCreateUpdateFormProps) => {
    const queryClient = useQueryClient()

    const { data } = useTransactionBatchStore()
    const [defaultMode, setDefaultMode] = useState<
        'create' | 'update' | 'readOnly'
    >(formProps.readOnly ? 'readOnly' : mode)

    const [defaultMemberProfile, setDefaultMemberProfile] = useState<
        IMemberProfile | undefined
    >(defaultValues?.member_profile)

    const [editJournalId, setEditJournalId] = useState<TEntityId>(
        journalVoucherId ?? ''
    )
    const isUpdate = !!editJournalId

    const {
        selectedJournalVoucherEntry,
        setSelectedJournalVoucherEntry,
        journalVoucherEntriesDeleted,
        resetJournalVoucherDeleted,
    } = useJournalVoucherStore()

    const { setSelectedMember } = useMemberPickerStore()

    const form = useForm<TJournalVoucherFormValues>({
        resolver: standardSchemaResolver(JournalVoucherSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
        },
    })

    const {
        mutate: createJournalVoucher,
        isPending: isCreating,
        error: createError,
        reset: resetCreate,
    } = useCreateJournalVoucher({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Journal Voucher Created',
                onSuccess: (data) => {
                    formProps.onSuccess?.(data)
                    setEditJournalId(data.id)
                    setSelectedJournalVoucherEntry([])
                    setDefaultMode('update')
                },
                onError: formProps.onError,
            }),
        },
    })

    const {
        mutate: updateJournalVoucher,
        isPending: isUpdating,
        error: updateError,
        reset: resetUpdate,
    } = useUpdateJournalVoucherById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Journal Voucher updated',
                onSuccess: (data) => {
                    formProps.onSuccess?.(data)
                    resetJournalVoucherDeleted()
                },
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TJournalVoucherFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit(async (formData) => {
        const payload: IJournalVoucherRequest = {
            ...formData,
            date: new Date(formData.date).toISOString(),
        }
        const validateResult = ValidateJournalEntry({
            data: selectedJournalVoucherEntry,
        })

        if (isUpdate && validateResult.isValid) {
            updateJournalVoucher({
                id: editJournalId,
                payload: {
                    ...payload,
                    journal_voucher_entries: validateResult.validatedEntries,
                    journal_voucher_entries_deleted:
                        journalVoucherEntriesDeleted,
                },
            })
        } else if (!validateResult.isValid) {
            form.setError('root', {
                type: 'custom',
                message: validateResult.error,
            })
        } else {
            createJournalVoucher(payload)
        }
    }, handleFocusError)

    const isPending = isCreating || isUpdating
    const rawError = isUpdate ? updateError : createError

    const error =
        serverRequestErrExtractor({ error: rawError }) ||
        form.formState.errors?.root?.message

    const JournalEntries =
        defaultValues?.journal_voucher_entries?.map((entry) => ({
            id: entry.id,
            account_id: entry.account_id,
            member_profile_id: entry.member_profile_id,
            member_profile: entry.member_profile,
            account: entry.account,
            employee_user_id: entry.employee_user_id,
            cash_check_voucher_number: entry.cash_check_voucher_number,
            description: entry.description,
            debit: entry.debit,
            credit: entry.credit,
        })) ?? []

    const handleSetMemberProfile = useCallback(
        (memberProfile: IMemberProfile | undefined) => {
            form.setValue('name', memberProfile?.id)
            form.setValue('member_profile', memberProfile)
        },
        [form]
    )

    const handleClearMember = useCallback(() => {
        handleSetMemberProfile(undefined)
    }, [handleSetMemberProfile])

    useHotkeys('d', (e) => {
        e.preventDefault()
        handleClearMember()
    })

    useHotkeys('ctrl + enter', (e) => {
        e.preventDefault()
        if (defaultMode !== 'readOnly') {
            onSubmit()
        }
    })

    const isPrinted = !!defaultValues?.printed_date

    return (
        <Form {...form}>
            <form
                className={cn('!w-full flex flex-col space-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="w-full flex items-center gap-2 justify-end"></div>
                <fieldset
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <div className="absolute top-4 right-10 z-10 flex gap-2">
                        {isUpdate && (
                            <JournalVoucherTagsManagerPopover
                                journalVoucherId={editJournalId}
                                readOnly={isPrinted}
                                size="sm"
                            />
                        )}
                        {editJournalId && defaultValues && (
                            <div className="">
                                <JournalVoucherStatusIndicator
                                    journalVoucher={defaultValues}
                                />
                            </div>
                        )}
                        <div className=" bg-muted p-1 rounded-sm -top-1 right-0 z-10 flex items-center">
                            <Button
                                className="size-fit px-2 py-0.5 mr-1 text-xs"
                                size="sm"
                                tabIndex={0}
                                type="button"
                                variant={'ghost'}
                            >
                                Select or Add Member{' '}
                            </Button>
                            <CommandShortcut className="bg-accent text-xs min-w-fit size-fit px-2 py-0.5 rounded-sm text-primary">
                                Enter
                            </CommandShortcut>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-4 flex flex-col">
                        <FormFieldWrapper
                            className="w-full "
                            control={form.control}
                            name="name"
                            render={({ field }) => {
                                return (
                                    <div className="relative w-full">
                                        <Input
                                            className="!text-md p-5 font-semibold h-12"
                                            {...field}
                                            id={field.name}
                                            value={field.value || ''}
                                        />
                                        <Button
                                            className="absolute m-auto top-0 bottom-0 right-1 hover:!bg-primary/20"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                form.reset({
                                                    company_id: undefined,
                                                    member_profile: undefined,
                                                    member_id: undefined,
                                                    name: '',
                                                })
                                            }}
                                            size={'sm'}
                                            variant="ghost"
                                        >
                                            <XIcon />
                                        </Button>
                                    </div>
                                )
                            }}
                        />
                    </div>

                    <div className="col-span-4 relative grid grid-cols-2 gap-x-2">
                        <FormFieldWrapper
                            className="relative"
                            control={form.control}
                            label="Member Profile"
                            name="member_id"
                            render={({ field }) => {
                                return (
                                    <>
                                        <MemberPicker
                                            allowShorcutCommand
                                            disabled={isDisabled(field.name)}
                                            onSelect={(selectedMember) => {
                                                field.onChange(
                                                    selectedMember?.id
                                                )
                                                form.setValue(
                                                    'member_profile',
                                                    selectedMember
                                                )
                                                form.setValue(
                                                    'name',
                                                    selectedMember?.full_name
                                                )
                                                form.setValue(
                                                    'company_id',
                                                    undefined
                                                )
                                                setDefaultMemberProfile(
                                                    selectedMember
                                                )
                                            }}
                                            placeholder="Relative Member Profile"
                                            value={form.getValues(
                                                'member_profile'
                                            )}
                                        />
                                    </>
                                )
                            }}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Company"
                            name="company_id"
                            render={({ field }) => (
                                <CompanyCombobox
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onChange={(selectedCompany) => {
                                        field.onChange(selectedCompany.id)
                                        form.setValue(
                                            'name',
                                            selectedCompany.name
                                        )
                                        form.setValue('member_id', undefined)
                                        form.setValue(
                                            'member_profile',
                                            undefined
                                        )
                                    }}
                                    placeholder="Select a company"
                                    value={field.value}
                                />
                            )}
                        />
                    </div>
                    <FormFieldWrapper
                        control={form.control}
                        label="CV Number"
                        name="cash_voucher_number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Enter CV number"
                                value={field.value || ''}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        className="relative"
                        control={form.control}
                        description="mm/dd/yyyy"
                        descriptionClassName="absolute top-0 right-0"
                        label="Date"
                        name="date"
                        render={({ field }) => (
                            <InputDate {...field} value={field.value ?? ''} />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Reference"
                        name="reference"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Enter reference"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        className="col-span-1 md:col-span-4 !max-h-xs"
                        control={form.control}
                        label="Particulars"
                        name="description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                className="!max-h-[100px] h-[70px] resize-y"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Particulars"
                            />
                        )}
                    />
                    {defaultMode !== 'create' && (
                        <JournalEntryTable
                            className="col-span-1 md:col-span-4"
                            defaultMemberProfile={defaultMemberProfile}
                            journalVoucherId={journalVoucherId ?? ''}
                            mode={defaultMode}
                            rowData={JournalEntries}
                            transactionBatchId={data?.id}
                        />
                    )}
                </fieldset>
                <div className="w-full flex justify-end gap-4">
                    <div className="max-w-[130px] flex-col flex justify-end">
                        <p className="text-primary bg-background border text-left rounded-md pl-8 pr-10 py-1 text-lg font-bold">
                            {currencyFormat(defaultValues?.total_debit || 0, {
                                showSymbol: false,
                            })}
                        </p>
                    </div>
                    <div className="max-w-[130px]">
                        <p className="text-primary bg-background border text-left rounded-md pl-8 pr-10 py-1 text-lg font-bold">
                            {currencyFormat(defaultValues?.total_credit || 0, {
                                showSymbol: false,
                            })}
                        </p>
                    </div>
                </div>
                <FormFooterResetSubmit
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        if (isUpdate) {
                            form.reset({
                                ...defaultValues,
                                date: defaultValues?.date
                                    ? new Date(defaultValues.date).toISOString()
                                    : undefined,
                            })
                            resetUpdate()
                        } else {
                            form.reset()
                            resetCreate()
                        }
                        setSelectedJournalVoucherEntry([])
                        setSelectedMember(null)
                        queryClient.invalidateQueries({
                            queryKey: [journalVoucherBaseKey, 'paginated'],
                        })
                    }}
                    readOnly={formProps.readOnly}
                    submitText={isUpdate ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const JournalVoucherCreateUpdateFormModal = ({
    formProps,
    className,
    ...props
}: IModalProps & {
    formProps?: Omit<IJournalVoucherCreateUpdateFormProps, 'className'>
}) => {
    const description = formProps?.journalVoucherId
        ? 'Update the details for this journal voucher.'
        : 'Fill in the details for a new journal voucher.'

    return (
        <Modal
            className={cn('!min-w-2xl !max-w-4xl', className)}
            title={
                <div>
                    <p className="font-medium">
                        <BookIcon className="inline text-primary" /> Journal
                        Voucher
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            }
            {...props}
        >
            <JournalVoucherCreateUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    // props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default JournalVoucherCreateUpdateFormModal
