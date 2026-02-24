import { useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    CashCheckVoucherSchema,
    ICashCheckVoucher,
    ICashCheckVoucherRequest,
    TORCashCheckSettings,
    cashCheckVoucherBaseKey,
    useCreateUpdateCashCheckVoucher,
} from '@/modules/cash-check-voucher'
import { CashCheckVoucherTagsManagerPopover } from '@/modules/cash-check-voucher-tag/components/cash-check-voucher-tag-manager'
import CompanyCombobox from '@/modules/company/components/company-combobox'
import { CurrencyCombobox, currencyFormat } from '@/modules/currency'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { getTimeMachineValue } from '@/modules/user-organization/user-organization-utils'
import { useMemberPickerStore } from '@/store/member-picker-store'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import {
    GearIcon,
    HashIcon,
    MoneyCheck2Icon,
    WandSparkleIcon,
    XIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { CommandShortcut } from '@/components/ui/command'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IForm, TEntityId } from '@/types'

import { buildCashCheckOR } from '../../cash-check-voucher.utils'
import CashCheckVoucherStatusIndicator from '../cash-check-status-indicator'
import { CashCheckJournalEntryTable } from './cash-check-voucher-entry-table'

type TCashCheckVoucherFormValues = z.infer<typeof CashCheckVoucherSchema>

export type TCashCheckVoucherModalMode = 'create' | 'update' | 'readOnly'

export interface ICashCheckVoucherCreateUpdateFormProps
    extends
        IClassProps,
        IForm<
            Partial<ICashCheckVoucher>,
            ICashCheckVoucherRequest,
            Error,
            TCashCheckVoucherFormValues
        > {
    cashCheckVoucherId?: TEntityId
    mode?: TCashCheckVoucherModalMode
    orSettings?: TORCashCheckSettings
}

const CashCheckVoucherCreateUpdateForm = ({
    className,
    cashCheckVoucherId,
    defaultValues,
    mode = 'create',
    orSettings,
    ...formProps
}: ICashCheckVoucherCreateUpdateFormProps) => {
    const queryClient = useQueryClient()
    const modalState = useModalState()
    const { data } = useTransactionBatchStore()
    const popOverState = useModalState()
    const [defaultMember, setDefaultMember] = useState<
        IMemberProfile | undefined
    >(defaultValues?.member_profile)

    const [editCashCheckVoucherId, setEditCashCheckVoucherId] =
        useState<TEntityId>(cashCheckVoucherId ?? '')

    const isUpdate = !!editCashCheckVoucherId

    const { setSelectedMember } = useMemberPickerStore()

    const form = useForm<TCashCheckVoucherFormValues>({
        resolver: standardSchemaResolver(CashCheckVoucherSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
            released_date: toInputDateString(
                defaultValues?.entry_date || getTimeMachineValue()
            ),
        },
    })
    const CashCheckVoucherTransactionId = form.watch('id') || cashCheckVoucherId

    const {
        mutate: createUpdateCashCheckVoucher,
        isPending: isCreating,
        error: createError,
        reset: resetCreate,
    } = useCreateUpdateCashCheckVoucher({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Cash Check Voucher Created',
                onSuccess: (data) => {
                    formProps.onSuccess?.(data)
                    setEditCashCheckVoucherId(data.id)
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

        createUpdateCashCheckVoucher({
            id: editCashCheckVoucherId,
            payload: {
                ...payload,
            },
        })
    }, handleFocusError)

    const isPending = isCreating
    const rawError = createError
    const error =
        serverRequestErrExtractor({ error: rawError }) ||
        form.formState.errors?.root?.message

    useHotkeys('Enter', (e) => {
        e.preventDefault()
        modalState.onOpenChange(true)
    })

    useHotkeys(
        'ctrl+enter',
        (e) => {
            e.preventDefault()
            if (mode !== 'readOnly') {
                onSubmit()
            }
        },
        { enableOnFormTags: true },
        [mode, onSubmit]
    )
    useHotkeys(
        'alt+1',
        (e) => {
            e.preventDefault()
            form.setFocus('name')
        },
        { enableOnFormTags: true },
        [form]
    )
    useHotkeys(
        'alt+3',
        (e) => {
            e.preventDefault()
            form.setFocus('pay_to')
        },
        { enableOnFormTags: true },
        [form]
    )
    useHotkeys(
        'alt+4',
        (e) => {
            e.preventDefault()
            form.setFocus('print_count')
        },
        { enableOnFormTags: true },
        [form]
    )
    useHotkeys(
        'alt+2',
        (e) => {
            e.preventDefault()
            form.setFocus('description')
        },
        { enableOnFormTags: true },
        [form]
    )

    useHotkeys(
        'shift+3',
        (e) => {
            e.preventDefault()
            form.setFocus('cash_voucher_number')
        },
        { enableOnFormTags: true },
        [form]
    )

    useHotkeys(
        'alt + comma',
        (e) => {
            e.preventDefault()
            form.setFocus('cash_voucher_number')
        },
        { enableOnFormTags: true },
        [form]
    )
    const handleGenerateVoucherNumber = () => {
        if (!orSettings)
            return toast.warning('OR Generate Failed - could not load settings')

        const constructedCV = buildCashCheckOR(orSettings)

        form.setValue('cash_voucher_number', constructedCV, {
            shouldDirty: true,
        })
        toast.info(`Set Check Voucher Number to ${constructedCV}`)
    }

    useHotkeys(
        'alt+r',
        (e) => {
            e.preventDefault()
            handleGenerateVoucherNumber()
        },
        { enableOnFormTags: true },
        [handleGenerateVoucherNumber]
    )
    useHotkeys(
        'alt+semicolon',
        (e) => {
            e.preventDefault()
            popOverState.onOpenChange(!popOverState.open)
        },
        {
            enableOnFormTags: true,
        },
        [popOverState]
    )
    useEffect(() => {
        if (isUpdate) return
        form.setValue('cash_check_voucher_entries', [
            {
                account_id: '',
                debit: 0,
                credit: 0,
            },
        ])
    }, [cashCheckVoucherId, isUpdate, form])

    return (
        <Form {...form}>
            <form
                className={cn('w-full! flex flex-col gap-y-4', className)}
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
                </div>
                <fieldset
                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                    disabled={isPending || formProps.readOnly}
                >
                    {/* ================= NAME ================= */}
                    <div className="col-span-2 inline-flex gap-x-2">
                        <div className="flex items-end justify-end">
                            <Popover {...popOverState}>
                                <PopoverTrigger asChild className="">
                                    <div className="flex flex-col w-fit!">
                                        <Kbd className="block">alt + ;</Kbd>
                                        <Button
                                            className="px-1"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                popOverState.onOpenChange(
                                                    !popOverState.open
                                                )
                                            }}
                                            variant="secondary"
                                        >
                                            <GearIcon className="size-4" />
                                            More Options
                                        </Button>
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-full">
                                    {/* ================= PAY TOO ================= */}
                                    <FormFieldWrapper
                                        control={form.control}
                                        label={
                                            <Label className="text-xs font-medium text-muted-foreground">
                                                Pay To{' '}
                                                <KbdGroup>
                                                    <Kbd>Alt + 3</Kbd>
                                                </KbdGroup>
                                            </Label>
                                        }
                                        name="pay_to"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                id={field.name}
                                                placeholder="Enter payee"
                                                // tabIndex={-1}
                                            />
                                        )}
                                    />
                                    {/* ================= COMPANY ================= */}
                                    <FormFieldWrapper
                                        control={form.control}
                                        label={
                                            <Label className="text-xs font-medium text-muted-foreground">
                                                Company{' '}
                                                <KbdGroup>
                                                    <Kbd>Alt + 4</Kbd>
                                                </KbdGroup>
                                            </Label>
                                        }
                                        name="company_id"
                                        render={({ field }) => (
                                            <CompanyCombobox
                                                {...field}
                                                allowShortcutHotKey
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                // mainTriggerProps={{
                                                //     tabIndex: -1,
                                                // }}
                                                onChange={(selectedCompany) => {
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
                                                placeholder="Select a company"
                                                shortcutHotKey="alt + 4"
                                                value={field.value}
                                            />
                                        )}
                                    />{' '}
                                    {/* ================= MEMBER ================= */}
                                    <FormFieldWrapper
                                        className="col-span-2"
                                        control={form.control}
                                        label={
                                            <Label className="text-xs font-medium text-muted-foreground">
                                                Member <Kbd>Alt + M</Kbd>
                                            </Label>
                                        }
                                        name="member_profile_id"
                                        render={({ field }) => (
                                            <MemberPicker
                                                allowShortcutHotKey
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                mainTriggerProps={{
                                                    tabIndex: -1,
                                                }}
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
                                                        selectedMember ??
                                                            undefined
                                                    )
                                                }}
                                                placeholder="Relative Member Profile"
                                                shortcutHotKey="alt + m"
                                                value={form.getValues(
                                                    'member_profile'
                                                )}
                                            />
                                        )}
                                    />
                                    {/* ================= REFERENCE ================= */}
                                    <FormFieldWrapper
                                        control={form.control}
                                        label={
                                            <span className="flex items-center justify-between pb-2">
                                                <span className="inline-flex gap-x-1 items-center">
                                                    Reference Number
                                                    <HashIcon className="inline text-muted-foreground" />
                                                </span>
                                                <button
                                                    className="text-xs disabled:pointer-events-none text-muted-foreground duration-150 cursor-pointer hover:text-foreground underline-offset-4 underline"
                                                    onClick={
                                                        handleGenerateVoucherNumber
                                                    }
                                                    tabIndex={-1}
                                                    type="button"
                                                >
                                                    <span className="text-xs font-medium text-muted-foreground mr-2">
                                                        <Kbd>Alt + ,</Kbd>
                                                    </span>
                                                    {form.watch(
                                                        'cash_voucher_number'
                                                    )
                                                        ? 'Re-generate Voucher'
                                                        : 'Generate Voucher'}
                                                    <WandSparkleIcon className="inline ml-1" />
                                                </button>
                                            </span>
                                        }
                                        name="cash_voucher_number"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                // tabIndex={-1}
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className="mt-2"
                                        control={form.control}
                                        label={
                                            <Label className="text-xs font-medium text-muted-foreground">
                                                Currency *{' '}
                                                <KbdGroup>
                                                    <Kbd>Alt + .</Kbd>
                                                </KbdGroup>
                                            </Label>
                                        }
                                        name="currency_id"
                                        render={({ field }) => (
                                            <CurrencyCombobox
                                                {...field}
                                                allowShortcutHotKey
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                // mainTriggerProps={{
                                                //     tabIndex: -1,
                                                // }}
                                                onChange={(currency) => {
                                                    field.onChange(currency?.id)
                                                    form.setValue(
                                                        'currency',
                                                        currency
                                                    )
                                                }}
                                                shortcutHotKey="alt + period"
                                                value={field.value}
                                            />
                                        )}
                                    />
                                    {/* ================= PRINT COUNT ================= */}
                                    <FormFieldWrapper
                                        control={form.control}
                                        label={
                                            <Label className="text-xs font-medium text-muted-foreground">
                                                Print Count{' '}
                                                <KbdGroup>
                                                    <Kbd>Alt + /</Kbd>
                                                </KbdGroup>
                                            </Label>
                                        }
                                        name="print_count"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                id={field.name}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                placeholder="Enter print count"
                                                // tabIndex={-1}
                                                type="number"
                                                value={field.value ?? 0}
                                            />
                                        )}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            label={
                                <Label className="text-xs font-medium text-muted-foreground">
                                    Name *{' '}
                                    <KbdGroup>
                                        <Kbd>Alt + 1</Kbd>
                                    </KbdGroup>
                                </Label>
                            }
                            name="name"
                            render={({ field }) => (
                                <div className="relative w-full">
                                    <Input
                                        className="text-md! font-semibold pr-10"
                                        // tabIndex={-1}
                                        {...field}
                                        id={field.name}
                                        value={field.value || ''}
                                    />
                                    <Button
                                        className="absolute m-auto top-0 bottom-0 right-1 hover:bg-primary/20!"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            form.reset({
                                                company_id: undefined,
                                                member_profile: undefined,
                                                member_profile_id: undefined,
                                                name: '',
                                            })
                                        }}
                                        size="sm"
                                        // tabIndex={-1}
                                        variant="ghost"
                                    >
                                        <XIcon />
                                    </Button>
                                </div>
                            )}
                        />
                    </div>

                    {/* ================= DESCRIPTION ================= */}
                    <FormFieldWrapper
                        className="col-span-1 md:col-span-2 max-h-xs!"
                        control={form.control}
                        label={
                            <Label className="text-xs font-medium text-muted-foreground">
                                Particulars{' '}
                                <KbdGroup>
                                    <Kbd>Alt + 2</Kbd>
                                </KbdGroup>
                            </Label>
                        }
                        name="description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                className="max-h-[100px]! h-[70px] resize-y"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Particulars"
                                // tabIndex={-1}
                            />
                        )}
                    />
                    {/* ================= ENTRIES ================= */}
                    <FormFieldWrapper
                        className="col-span-1 md:col-span-2 max-h-xs!"
                        control={form.control}
                        name="cash_check_voucher_entries"
                        render={({ field }) => (
                            <CashCheckJournalEntryTable
                                cashCheckCurrency={form.watch('currency')}
                                cashCheckVoucherId={cashCheckVoucherId ?? ''}
                                className="col-span-1 md:col-span-2"
                                defaultMemberProfile={defaultMember}
                                form={form}
                                mode={mode}
                                ref={field.ref}
                            />
                        )}
                    />
                </fieldset>
                <div className="w-full flex justify-end gap-4">
                    <div className="max-w-[130px] flex-col flex justify-end">
                        <p className="text-primary bg-background border py-1 text-left rounded-md pl-8 pr-10 text-lg font-bold">
                            {currencyFormat(form.watch('total_debit'), {
                                currency: form.watch('currency'),
                                showSymbol: !!form.watch('currency'),
                            })}
                        </p>
                    </div>
                    <div className="max-w-[130px]">
                        <p className="text-primary bg-background border py-1 text-left rounded-md pl-8 pr-10 text-lg font-bold">
                            {currencyFormat(form.watch('total_credit'), {
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
                        } else {
                            form.reset()
                        }
                        resetCreate()
                        setSelectedMember(null)
                        queryClient.invalidateQueries({
                            queryKey: [cashCheckVoucherBaseKey, 'paginated'],
                        })
                    }}
                    readOnly={formProps.readOnly}
                    submitText={
                        <div className="inline-flex items-center gap-2">
                            <kbd className="text-xs">
                                {isUpdate ? 'Update' : 'Create'}
                            </kbd>
                            <CommandShortcut className="bg-accent text-xs min-w-fit size-fit px-2 py-0.5 rounded-sm text-primary">
                                Ctrl + Enter
                            </CommandShortcut>
                        </div>
                    }
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
            className={cn('min-w-2xl! max-w-5xl!', className)}
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
