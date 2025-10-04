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
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { TransactionAmountField } from '@/modules/transaction'
import { useCashCheckVoucherStore } from '@/store/cash-check-voucher-store'
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
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IForm, TEntityId } from '@/types'

import CashCheckVoucherStatusIndicator from '../cash-check-status-indicator'
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
        validatedEntries: transformedEntries,
    }
}

const CashCheckVoucherCreateUpdateForm = ({
    className,
    cashCheckVoucherId,
    defaultValues,
    ...formProps
}: ICashCheckVoucherCreateUpdateFormProps) => {
    const queryClient = useQueryClient()
    const modalState = useModalState()

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
    
    const isPrinted = !!defaultValues?.printed_date
    const isApproved = !!defaultValues?.approved_date
    const isReleased = !!defaultValues?.released_date

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('!w-full flex flex-col gap-y-4', className)}
            >
                <div className="absolute top-4 right-10 z-10 flex gap-2">
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
                    {CashCheckVoucherTransactionId && (
                        <CashCheckVoucherTagsManagerPopover
                            size="sm"
                            cashCheckVoucherId={CashCheckVoucherTransactionId}
                        />
                    )}
                </div>
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <div className="col-span-1 md:col-span-3 flex flex-col">
                        <FormFieldWrapper
                            className="w-full"
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
                                                    member_profile_id:
                                                        undefined,
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
                                            name="member_profile_id"
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
                                                            setDefaultMember(
                                                                selectedMember ??
                                                                    undefined
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
                                                            'member_profile_id',
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
                        className="col-span-1"
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
                            defaultMemberProfile={defaultMember}
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
                                // date: defaultValues?.date
                                //     ? new Date(defaultValues.date).toISOString()
                                //     : undefined,
                            })
                            resetUpdate()
                        } else {
                            form.reset()
                            resetCreate()
                        }
                        // setSelectedCashCheckVoucherEntry([])
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
