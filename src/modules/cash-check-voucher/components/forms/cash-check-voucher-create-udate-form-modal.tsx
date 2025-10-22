import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IAccount } from '@/modules/account'
import {
    CashCheckVoucherSchema,
    ICashCheckVoucher,
    ICashCheckVoucherRequest,
    cashCheckVoucherBaseKey,
    useCreateCashCheckVoucher,
    useUpdateCashCheckVoucherById,
} from '@/modules/cash-check-voucher'
import {
    CashCheckVoucherEntrySchema,
    ICashCheckVoucherEntryRequest,
} from '@/modules/cash-check-voucher-entry'
import { CashCheckVoucherTagsManagerPopover } from '@/modules/cash-check-voucher-tag/components/cash-check-voucher-tag-manager'
import CompanyCombobox from '@/modules/company/components/combobox'
import { CurrencyCombobox, currencyFormat } from '@/modules/currency'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { useCashCheckVoucherStore } from '@/store/cash-check-voucher-store'
import { useMemberPickerStore } from '@/store/member-picker-store'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { MoneyCheck2Icon, XIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { CommandShortcut } from '@/components/ui/command'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IForm, TEntityId } from '@/types'

import CashCheckVoucherStatusIndicator from '../cash-check-status-indicator'
import { CashCheckJournalEntryTable } from './cash-check-voucher-entry-table'

type TCashCheckVoucherFormValues = z.infer<typeof CashCheckVoucherSchema>

export type TCashCheckVoucherModalMode = 'create' | 'update' | 'readOnly'

export interface ICashCheckVoucherCreateUpdateFormProps
    extends IClassProps,
        IForm<
            Partial<ICashCheckVoucher>,
            ICashCheckVoucherRequest,
            Error,
            TCashCheckVoucherFormValues
        > {
    cashCheckVoucherId?: TEntityId
    mode?: TCashCheckVoucherModalMode
}

export type TValidateResultCashCheckVoucher = {
    data: ICashCheckVoucherEntryRequest[]
}
type TValidateResult =
    | {
          isValid: true
          validatedEntries: ICashCheckVoucherEntryRequest[]
      }
    | {
          isValid: false
          error: string
      }

const ValidateCashCheckEntry = ({
    data,
}: TValidateResultCashCheckVoucher): TValidateResult => {
    if (data.length === 0) {
        return {
            isValid: true,
            validatedEntries: [],
        }
    }

    const transformedEntries = data.map((entry) => {
        const memberProfile = entry.member_profile as IMemberProfile
        const account = entry.account as IAccount

        return {
            id: entry.id,
            credit: entry.credit,
            debit: entry.debit,
            member_profile_id: memberProfile?.id,
            account_id: account?.id,
            cash_check_voucher_number: entry.cash_check_voucher_number,
        }
    })
    const parsedEntries = z
        .array(CashCheckVoucherEntrySchema)
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
        // validatedEntries: transformedEntries,
        validatedEntries: parsedEntries.data, // Fixed: Use parsedEntries.data instead to get the validated entries since transformedEntries is not validated/not parsed/ not safe /nottransformed
    }
}

const CashCheckVoucherCreateUpdateForm = ({
    className,
    cashCheckVoucherId,
    defaultValues,
    mode = 'create',
    ...formProps
}: ICashCheckVoucherCreateUpdateFormProps) => {
    const queryClient = useQueryClient()
    const modalState = useModalState()
    const { data } = useTransactionBatchStore()

    const [defaultMode, setDefaultMode] = useState<TCashCheckVoucherModalMode>(
        formProps.readOnly ? 'readOnly' : mode
    )

    const [defaultMember, setDefaultMember] = useState<
        IMemberProfile | undefined
    >(defaultValues?.member_profile)

    const [editCashCheckVoucherId, setEditCashCheckVoucherId] =
        useState<TEntityId>(cashCheckVoucherId ?? '')

    const isUpdate = !!editCashCheckVoucherId

    const { setSelectedMember } = useMemberPickerStore()
    const {
        selectedCashCheckVoucherEntry,
        setSelectedCashCheckVoucherEntry,
        cashCheckVoucherEntriesDeleted,
    } = useCashCheckVoucherStore()

    const form = useForm<TCashCheckVoucherFormValues>({
        resolver: standardSchemaResolver(CashCheckVoucherSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
        },
    })
    const CashCheckVoucherTransactionId = form.watch('id') || cashCheckVoucherId

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
                    setSelectedCashCheckVoucherEntry([])
                    setDefaultMode('update')
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
                    form.reset(data)
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
            transaction_batch_id: data?.id,
        }
        const validateResult = ValidateCashCheckEntry({
            data: selectedCashCheckVoucherEntry,
        })
        if (isUpdate) {
            if (validateResult.isValid) {
                updateCashCheckVoucher({
                    id: editCashCheckVoucherId,
                    payload: {
                        ...payload,
                        cash_check_voucher_entries:
                            validateResult.validatedEntries,
                        cash_check_voucher_entries_deleted:
                            cashCheckVoucherEntriesDeleted,
                    },
                })
            } else {
                form.setError('root', {
                    type: 'custom',
                    message: validateResult.error,
                })
                return
            }
        } else {
            createCashCheckVoucher(payload)
        }
    }, handleFocusError)

    const isPending = isCreating || isUpdating
    const rawError = isUpdate ? updateError : createError
    const error =
        serverRequestErrExtractor({ error: rawError }) ||
        form.formState.errors?.root?.message

    const CashCheckEntries =
        defaultValues?.cash_check_voucher_entries?.map((entry) => ({
            id: entry.id,
            account_id: entry.account_id,
            member_profile_id: entry.member_profile_id,
            employee_user_id: entry.employee_user_id,
            cash_check_voucher_number: entry.cash_check_voucher_number,
            description: entry.description,
            member_profile: entry.member_profile,
            account: entry.account,
            debit: entry.debit,
            credit: entry.credit,
        })) ?? []

    useHotkeys('Enter', (e) => {
        e.preventDefault()
        modalState.onOpenChange(true)
    })

    return (
        <Form {...form}>
            <form
                className={cn('!w-full flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="absolute top-4 right-10 z-10 flex gap-2">
                    {CashCheckVoucherTransactionId && (
                        <CashCheckVoucherTagsManagerPopover
                            cashCheckVoucherId={CashCheckVoucherTransactionId}
                            size="sm"
                        />
                    )}
                    {defaultValues && (
                        <CashCheckVoucherStatusIndicator
                            cashCheckVoucher={
                                defaultValues as ICashCheckVoucher
                            }
                            className="max-w-max"
                        />
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
                <fieldset
                    className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <div className="col-span-1 md:col-span-3 flex flex-col">
                        <div className="grid grid-cols-2 gap-x-2">
                            <FormFieldWrapper
                                className="w-full"
                                control={form.control}
                                label="Name *"
                                name="name"
                                render={({ field }) => {
                                    return (
                                        <div className="relative w-full">
                                            <Input
                                                className="!text-md font-semibold pr-10"
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
                                                        member_profile:
                                                            undefined,
                                                        member_profile_id:
                                                            undefined,
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
                            <FormFieldWrapper
                                control={form.control}
                                label="Currency *"
                                name="currency_id"
                                render={({ field }) => (
                                    <CurrencyCombobox
                                        {...field}
                                        disabled={
                                            isDisabled(field.name) ||
                                            !!cashCheckVoucherId
                                        }
                                        onChange={(currency) => {
                                            field.onChange(currency?.id)
                                            form.setValue('currency', currency)
                                        }}
                                        value={field.value}
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-3 mt-2">
                            <FormFieldWrapper
                                control={form.control}
                                label="Member Profile"
                                name="member_profile_id"
                                render={({ field }) => {
                                    return (
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
                                                setDefaultMember(
                                                    selectedMember ?? undefined
                                                )
                                            }}
                                            placeholder="Relative Member Profile"
                                            value={form.getValues(
                                                'member_profile'
                                            )}
                                        />
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
                                            form.setValue(
                                                'member_profile_id',
                                                undefined
                                            )
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
                    </div>
                    <FormFieldWrapper
                        className="col-span-1"
                        control={form.control}
                        label="CV Number"
                        name="cash_voucher_number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Enter CV number"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Pay To"
                        name="pay_to"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Enter payee"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Print Count"
                        name="print_count"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                                placeholder="Enter print count"
                                type="number"
                                value={field.value ?? 0}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        className="col-span-1 md:col-span-3 !max-h-xs"
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
                        <CashCheckJournalEntryTable
                            cashCheckCurrency={form.watch('currency')}
                            cashCheckVoucherId={cashCheckVoucherId ?? ''}
                            className="col-span-1 md:col-span-3"
                            defaultMemberProfile={defaultMember}
                            mode={defaultMode}
                            rowData={CashCheckEntries}
                        />
                    )}
                </fieldset>
                <div className="w-full flex justify-end gap-4">
                    <div className="max-w-[130px] flex-col flex justify-end">
                        <p className="text-primary bg-background border py-1 text-left rounded-md pl-8 pr-10 text-lg font-bold">
                            {currencyFormat(defaultValues?.total_debit || 0, {
                                currency: form.watch('currency'),
                                showSymbol: !!form.watch('currency'),
                            })}
                        </p>
                    </div>
                    <div className="max-w-[130px]">
                        <p className="text-primary bg-background border py-1 text-left rounded-md pl-8 pr-10 text-lg font-bold">
                            {currencyFormat(defaultValues?.total_credit || 0, {
                                currency: form.watch('currency'),
                                showSymbol: !!form.watch('currency'),
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
                            })
                            resetUpdate()
                        } else {
                            form.reset()
                            resetCreate()
                        }
                        setSelectedMember(null)
                        queryClient.invalidateQueries({
                            queryKey: [cashCheckVoucherBaseKey, 'paginated'],
                        })
                    }}
                    readOnly={formProps.readOnly}
                    submitText={isUpdate ? 'Update' : 'Create'}
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
    const description = formProps?.cashCheckVoucherId
        ? 'Update the details for this cash check voucher.'
        : 'Fill in the details for a new cash check voucher.'

    return (
        <Modal
            className={cn('!min-w-2xl !max-w-5xl', className)}
            title={
                <div>
                    <p className="font-medium">
                        <MoneyCheck2Icon className="inline text-primary" /> Cash
                        Check Voucher
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
            }
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
