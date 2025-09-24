import { useCallback, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IAccount } from '@/modules/account'
import {
    EJournalVoucherStatus,
    IJournalVoucher,
    IJournalVoucherRequest,
    JournalVoucherSchema,
    journalVoucherBaseKey,
    useCreateJournalVoucher,
    useUpdateJournalVoucherById,
} from '@/modules/journal-voucher'
import {
    IMemberProfile,
    useGetMemberProfileById,
} from '@/modules/member-profile'
import {
    IQRMemberProfile,
    IQRMemberProfileDecodedResult,
} from '@/modules/qr-crypto'
import { TransactionAmountField } from '@/modules/transaction'
import { useJournalVoucherStore } from '@/store/journal-voucher-store'
import { useMemberPickerStore } from '@/store/member-picker-store'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import MemberProfilePickerWithScanner from '@/components/pickers/member-picker-with-scanner'
import { Form, FormControl } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

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
}

const JournalVoucherCreateUpdateForm = ({
    className,
    journalVoucherId,
    defaultValues,
    ...formProps
}: IJournalVoucherCreateUpdateFormProps) => {
    const queryClient = useQueryClient()
    const modalState = useModalState()

    const [defaultMemberId, setDefaultMemberId] = useState<
        TEntityId | undefined
    >(defaultValues?.member_profile?.id)
    const [decodedMemberProfile, setDecodedMemberProfile] = useState<
        IQRMemberProfile | undefined
    >()

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
                    setDefaultMemberId(data.member_profile?.id)
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

        const filterSeledtedEntries = selectedJournalVoucherEntry.map(
            (entry) => {
                const member: IMemberProfile =
                    entry.member_profile as IMemberProfile
                const account: IAccount = entry.account as IAccount

                return {
                    cash_check_voucher_number: entry.cash_check_voucher_number,
                    id: entry.id,
                    credit: entry.credit,
                    debit: entry.debit,
                    member_profile_id: member?.id ?? undefined,
                    account_id: account?.id ?? undefined,
                }
            }
        )
        if (isUpdate) {
            updateJournalVoucher({
                id: editJournalId,
                payload: {
                    ...payload,
                    journal_voucher_entries: filterSeledtedEntries,
                    journal_voucher_entries_deleted:
                        journalVoucherEntriesDeleted,
                },
            })
        } else {
            createJournalVoucher(payload)
        }
    }, handleFocusError)

    const isPending = isCreating || isUpdating
    const rawError = isUpdate ? updateError : createError
    const error = serverRequestErrExtractor({ error: rawError })
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

    const selectedMember = form.watch('member_profile')

    const handleSetMemberProfile = useCallback(
        (memberProfile: IMemberProfile | undefined) => {
            form.setValue('member_profile_id', memberProfile?.id)
            form.setValue('member_profile', memberProfile)
        },
        [form]
    )
    const focusedId = decodedMemberProfile?.member_profile_id

    const {
        data: memberData,
        isLoading: isLoadingScanner,
        isError,
        error: getMemberRawError,
        isSuccess,
    } = useGetMemberProfileById({
        id: focusedId as TEntityId,
        options: { enabled: !!focusedId },
    })

    useQeueryHookCallback({
        data: memberData,
        isSuccess,
        onSuccess: (data: IMemberProfile) => {
            const currentMember = form.getValues('member_profile')
            if (!currentMember || currentMember.id !== data.id) {
                handleSetMemberProfile(data)
            }
        },
        error: getMemberRawError,
        isError,
    })

    const handleScanSuccess = useCallback(
        (decodedResult: IQRMemberProfileDecodedResult) => {
            if (decodedResult.type !== 'member-qr') {
                toast.error('Invalid QR. Please use a valid Member Profile QR.')
                return
            }
            if (
                decodedResult.data.member_profile_id !==
                decodedMemberProfile?.member_profile_id
            ) {
                setDecodedMemberProfile(decodedResult.data)
            }
        },
        [setDecodedMemberProfile, decodedMemberProfile]
    )

    useHotkeys('Enter', (e) => {
        e.preventDefault()
        modalState.onOpenChange(true)
    })

    const handleClearMember = useCallback(() => {
        handleSetMemberProfile(undefined)
        setDecodedMemberProfile(undefined)
    }, [handleSetMemberProfile, setDecodedMemberProfile])

    useHotkeys('d', (e) => {
        e.preventDefault()
        handleClearMember()
    })

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('!w-full flex flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <MemberProfilePickerWithScanner
                        modalState={modalState}
                        handleClearMember={handleClearMember}
                        className="col-span-1 md:col-span-4 p-2 bg-sidebar "
                        value={selectedMember}
                        triggerClassName="hidden"
                        onSelect={handleSetMemberProfile}
                        disabled={isDisabled('member_profile_id')}
                        placeholder="Select member"
                        isLoadingScanner={isLoadingScanner}
                        handleSuccessScan={handleScanSuccess}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="cash_voucher_number"
                        label="CV Number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
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
                        label="Status"
                        name="status"
                        render={({ field }) => (
                            <FormControl>
                                <Select
                                    disabled={isDisabled(field.name)}
                                    onValueChange={(selectedValue) => {
                                        field.onChange(selectedValue)
                                    }}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        {field.value || 'Select Status'}
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(
                                            EJournalVoucherStatus
                                        ).map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
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
                    {isUpdate && (
                        <JournalEntryTable
                            className="col-span-1 md:col-span-4"
                            journalVoucherId={journalVoucherId ?? ''}
                            isUpdateMode={isUpdate}
                            rowData={JournalEntries}
                            defaultMemberProfileId={defaultMemberId}
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
                        setDecodedMemberProfile(undefined)
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
