import { useCallback, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IAccount } from '@/modules/account'
import CashCheckVoucherStatusIndicator from '@/modules/cash-check-voucher/components/cash-check-status-indicator'
import CompanyCombobox from '@/modules/company/components/combobox'
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
import { TransactionAmountField } from '@/modules/transaction'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { useJournalVoucherStore } from '@/store/journal-voucher-store'
import { useMemberPickerStore } from '@/store/member-picker-store'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { XIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

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

    const isPrinted = !!defaultValues?.printed_date
    const isApproved = !!defaultValues?.approved_date
    const isReleased = !!defaultValues?.released_date

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('!w-full flex flex-col space-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <div className="absolute top-4 right-10 z-10 flex gap-2">
                        <JournalVoucherTagsManagerPopover
                            size="sm"
                            journalVoucherId={editJournalId}
                        />
                        {editJournalId && (
                            <div className="">
                                <CashCheckVoucherStatusIndicator
                                    voucherDates={{
                                        printed_date: isPrinted
                                            ? defaultValues?.printed_date
                                            : null,
                                        approved_date: isApproved
                                            ? defaultValues?.approved_date
                                            : null,
                                        released_date: isReleased
                                            ? defaultValues?.released_date
                                            : null,
                                    }}
                                    className="max-w-max"
                                />
                            </div>
                        )}
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
                                            value={field.value || ''}
                                            id={field.name}
                                        />
                                        <Button
                                            variant="ghost"
                                            size={'sm'}
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
                                        >
                                            <XIcon />
                                        </Button>
                                    </div>
                                )
                            }}
                        />
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full px-5 bg-sidebar rounded-2xl my-2"
                        >
                            <AccordionItem
                                value="item-1"
                                className="border-b-0"
                            >
                                <AccordionTrigger className="text-primary text-xs">
                                    more options
                                </AccordionTrigger>
                                <AccordionContent className="">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-3 mt-2">
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="member_id"
                                            label="Member Profile"
                                            render={({ field }) => {
                                                return (
                                                    <MemberPicker
                                                        value={form.getValues(
                                                            'member_profile'
                                                        )}
                                                        onSelect={(
                                                            selectedMember
                                                        ) => {
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
                                                        disabled={isDisabled(
                                                            field.name
                                                        )}
                                                        allowShorcutCommand
                                                    />
                                                )
                                            }}
                                        />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="company_id"
                                            label="Company"
                                            render={({ field }) => (
                                                <CompanyCombobox
                                                    {...field}
                                                    value={field.value}
                                                    placeholder="Select a company"
                                                    onChange={(
                                                        selectedCompany
                                                    ) => {
                                                        field.onChange(
                                                            selectedCompany.id
                                                        )
                                                        form.setValue(
                                                            'name',
                                                            selectedCompany.name
                                                        )
                                                        form.setValue(
                                                            'member_id',
                                                            undefined
                                                        )
                                                        form.setValue(
                                                            'member_profile',
                                                            undefined
                                                        )
                                                    }}
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                />
                                            )}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <FormFieldWrapper
                        control={form.control}
                        name="cash_voucher_number"
                        label="CV Number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                value={field.value || ''}
                                placeholder="Enter CV number"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="date"
                        label="Date"
                        className="relative"
                        description="mm/dd/yyyy"
                        descriptionClassName="absolute top-0 right-0"
                        render={({ field }) => (
                            <InputDate {...field} value={field.value ?? ''} />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="reference"
                        label="Reference"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Enter reference"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label="Particulars"
                        className="col-span-1 md:col-span-4 !max-h-xs"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                id={field.name}
                                className="!max-h-[100px] h-[70px] resize-y"
                                placeholder="Particulars"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    {defaultMode !== 'create' && (
                        <JournalEntryTable
                            className="col-span-1 md:col-span-4"
                            journalVoucherId={journalVoucherId ?? ''}
                            mode={defaultMode}
                            rowData={JournalEntries}
                            transactionBatchId={data?.id}
                            defaultMemberProfile={defaultMemberProfile}
                        />
                    )}
                </fieldset>
                <div className="w-full flex justify-end gap-4">
                    <div className="max-w-[130px] flex-col flex justify-end">
                        <TransactionAmountField
                            value={defaultValues?.total_debit || 0}
                            readOnly
                            className="text-primary font-bold text-left [&_.input]:text-right [&_.input]:font-bold"
                            isDefault
                        />
                    </div>
                    <div className="max-w-[130px]">
                        <TransactionAmountField
                            className="text-primary font-bold [&_.input]:text-right [&_.input]:font-bold"
                            value={defaultValues?.total_credit || 0}
                            isDefault
                        />
                    </div>
                </div>
                {/* <FormErrorMessage errorMessage={error} /> */}
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    submitText={isUpdate ? 'Update' : 'Create'}
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
    const title = formProps?.journalVoucherId
        ? 'Update Journal Voucher'
        : 'Create Journal Voucher'
    const description = formProps?.journalVoucherId
        ? 'Update the details for this journal voucher.'
        : 'Fill in the details for a new journal voucher.'

    return (
        <Modal
            className={cn('', className)}
            title={title}
            description={description}
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
