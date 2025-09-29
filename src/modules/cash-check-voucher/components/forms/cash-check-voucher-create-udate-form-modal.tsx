import { useCallback, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    CashCheckVoucherSchema,
    ECashCheckVoucherStatus,
    ICashCheckVoucher,
    ICashCheckVoucherRequest,
    cashCheckVoucherBaseKey,
    useCreateCashCheckVoucher,
    useUpdateCashCheckVoucherById,
} from '@/modules/cash-check-voucher'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import {
    IMemberProfile,
    useGetMemberProfileById,
} from '@/modules/member-profile'
import {
    IQRMemberProfile,
    IQRMemberProfileDecodedResult,
} from '@/modules/qr-crypto'
import { useCashCheckVoucherStore } from '@/store/cash-check-voucher-store'
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

import { CashCheckJournalEntryTable } from './cash-check-voucher-entry-table'

type TCashCheckVoucherFormValues = z.infer<typeof CashCheckVoucherSchema>

export interface ICashCheckVoucherCreateUpdateFormProps
    extends IClassProps,
        IForm<
            ICashCheckVoucher,
            ICashCheckVoucherRequest,
            Error,
            TCashCheckVoucherFormValues
        > {
    cashCheckVoucherId?: TEntityId
}

const CashCheckVoucherCreateUpdateForm = ({
    className,
    cashCheckVoucherId,
    defaultValues,
    ...formProps
}: ICashCheckVoucherCreateUpdateFormProps) => {
    const queryClient = useQueryClient()
    const modalState = useModalState()

    const [defaultMemberId, setDefaultMemberId] = useState<
        TEntityId | undefined
    >(defaultValues?.member_profile?.id)
    const [decodedMemberProfile, setDecodedMemberProfile] = useState<
        IQRMemberProfile | undefined
    >()

    const [editCashCheckVoucherId, setEditCashCheckVoucherId] =
        useState<TEntityId>(cashCheckVoucherId ?? '')
    const isUpdate = !!editCashCheckVoucherId

    const { setSelectedMember } = useMemberPickerStore()
    const { selectedCashCheckVoucherEntry } = useCashCheckVoucherStore()

    const form = useForm<TCashCheckVoucherFormValues>({
        resolver: standardSchemaResolver(CashCheckVoucherSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
        },
    })
    const {
        mutate: createCashCheckVoucher,
        isPending: isCreating,
        error: createError,
        reset: resetCreate,
    } = useCreateCashCheckVoucher({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Cash Check Voucher Created',
                onSuccess: (data) => {
                    formProps.onSuccess?.(data)
                    setEditCashCheckVoucherId(data.id)
                    setDefaultMemberId(data.member_profile?.id)
                },
                onError: formProps.onError,
            }),
        },
    })

    const {
        mutate: updateCashCheckVoucher,
        isPending: isUpdating,
        error: updateError,
        reset: resetUpdate,
    } = useUpdateCashCheckVoucherById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Cash Check Voucher updated',
                onSuccess: (data) => {
                    formProps.onSuccess?.(data)
                },
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TCashCheckVoucherFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })
    const handleDate = (date: string | undefined) => {
        return date ? new Date(date).toISOString() : undefined
    }

    const onSubmit = form.handleSubmit(async (formData) => {
        const payload: ICashCheckVoucherRequest = {
            ...formData,
            printed_date: handleDate(formData.printed_date),
            approved_date: handleDate(formData.approved_date),
            released_date: handleDate(formData.released_date),
            // You may need to adjust the date fields here if they are different from JournalVoucher
        }
        if (isUpdate) {
            updateCashCheckVoucher({
                id: editCashCheckVoucherId,
                payload: {
                    ...payload,
                    cash_check_voucher_entries: selectedCashCheckVoucherEntry,
                },
            })
        } else {
            createCashCheckVoucher(payload)
        }
    }, handleFocusError)

    const isPending = isCreating || isUpdating
    const rawError = isUpdate ? updateError : createError
    const error = serverRequestErrExtractor({ error: rawError })

    const CashCheckEntries =
        defaultValues?.cash_check_voucher_entries?.map((entry) => ({
            id: entry.id,
            account_id: entry.account_id,
            member_profile_id: entry.member_profile_id,
            employee_user_id: entry.employee_user_id,
            cash_check_voucher_number: entry.cash_check_voucher,
            description: entry.description,
            debit: entry.debit,
            credit: entry.credit,
        })) ?? []

    const selectedMember = form.watch('member_profile')

    const handleSetMemberProfile = useCallback(
        (memberProfile: IMemberProfile | null) => {
            form.setValue('member_profile_id', memberProfile?.id ?? '')
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
        handleSetMemberProfile(null)
        setDecodedMemberProfile(undefined)
    }, [handleSetMemberProfile, setDecodedMemberProfile])

    useHotkeys('d', (e) => {
        e.preventDefault()
        handleClearMember()
    })

    console.log(form.formState.errors)

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('!w-full flex flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <MemberProfilePickerWithScanner
                        modalState={modalState}
                        handleClearMember={handleClearMember}
                        className="col-span-1 md:col-span-3 p-2 bg-sidebar"
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
                        className="col-span-1 md:col-span-3"
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
                        name="pay_to"
                        label="Pay To"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Enter payee"
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
                                            ECashCheckVoucherStatus
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
                        name="created_by_user_id"
                        label="Created By"
                        render={({ field }) => (
                            <EmployeePicker
                                {...field}
                                mode="employee"
                                value={form.getValues('created_by_user')}
                                onSelect={(value) => {
                                    field.onChange(value?.id)
                                    form.setValue('created_by_user', value.user)
                                }}
                                placeholder="Select Employee"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="released_by_user_id"
                        label="Released by"
                        render={({ field }) => (
                            <EmployeePicker
                                {...field}
                                mode="employee"
                                value={form.getValues('released_by_user')}
                                onSelect={(value) => {
                                    field.onChange(value?.id)
                                    form.setValue(
                                        'released_by_user',
                                        value.user
                                    )
                                }}
                                placeholder="Select Employee"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="print_count"
                        label="Print Count"
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="number"
                                id={field.name}
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                                value={field.value ?? 0}
                                placeholder="Enter print count"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label="Particulars"
                        className="col-span-1 md:col-span-3 !max-h-xs"
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
                        <CashCheckJournalEntryTable
                            className="col-span-1 md:col-span-3"
                            cashCheckVoucherId={cashCheckVoucherId ?? ''}
                            isUpdateMode={isUpdate}
                            rowData={CashCheckEntries}
                            defaultMemberProfileId={defaultMemberId}
                        />
                    )}
                </fieldset>
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
                        // setSelectedCashCheckVoucherEntry([])
                        setDecodedMemberProfile(undefined)
                        setSelectedMember(null)
                        queryClient.invalidateQueries({
                            queryKey: [cashCheckVoucherBaseKey, 'paginated'],
                        })
                    }}
                />
            </form>
        </Form>
    )
}

export const CashCheckVoucherCreateUpdateFormModal = ({
    formProps,
    className,
    ...props
}: IModalProps & {
    formProps?: Omit<ICashCheckVoucherCreateUpdateFormProps, 'className'>
}) => {
    const title = formProps?.cashCheckVoucherId
        ? 'Update Cash Check Voucher'
        : 'Create Cash Check Voucher'
    const description = formProps?.cashCheckVoucherId
        ? 'Update the details for this cash check voucher.'
        : 'Fill in the details for a new cash check voucher.'

    return (
        <Modal
            className={cn('', className)}
            title={title}
            description={description}
            {...props}
        >
            <CashCheckVoucherCreateUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                }}
            />
        </Modal>
    )
}

export default CashCheckVoucherCreateUpdateFormModal
