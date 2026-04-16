import { useCallback, useEffect, useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import CompanyCombobox from '@/modules/company/components/company-combobox'
import { CurrencyCombobox, currencyFormat } from '@/modules/currency'
import {
    IJournalVoucher,
    IJournalVoucherRequest,
    JournalVoucherSchema,
    journalVoucherBaseKey,
    useCreateUpdateJournalVoucher,
} from '@/modules/journal-voucher'
import { IJournalVoucherEntryRequest } from '@/modules/journal-voucher-entry'
import { JournalVoucherTagsManagerPopover } from '@/modules/journal-voucher-tag/components/journal-voucher-tag-management'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { getTimeMachineValue } from '@/modules/user-organization/user-organization-utils'
import { useMemberPickerStore } from '@/store/member-picker-store'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { BookIcon, GearIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { CommandShortcut } from '@/components/ui/command'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
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
import { useSubmitHotkey } from '@/hooks/use-submit-trottle'

import { IClassProps, IForm, TEntityId } from '@/types'

import JournalVoucherStatusIndicator from '../journal-voucher-status-indicator'
import { JournalEntryTable } from './journal-entry-table'

type TJournalVoucherFormValues = z.infer<typeof JournalVoucherSchema>

export interface IJournalVoucherCreateUpdateFormProps
    extends
        IClassProps,
        IForm<
            Partial<IJournalVoucher>,
            IJournalVoucherRequest,
            Error,
            TJournalVoucherFormValues
        > {
    journalVoucherId?: TEntityId
    mode?: 'create' | 'update' | 'readOnly'
}

const JournalVoucherCreateUpdateForm = ({
    className,
    journalVoucherId,
    defaultValues,
    mode = 'create',
    ...formProps
}: IJournalVoucherCreateUpdateFormProps) => {
    const queryClient = useQueryClient()

    const popOverState = useModalState(false)
    const companyState = useModalState(false)

    const { data } = useTransactionBatchStore()

    const [defaultMemberProfile, setDefaultMemberProfile] = useState<
        IMemberProfile | undefined
    >(defaultValues?.member_profile)

    const [journalMode, setJournalVoucherMode] = useState<
        'create' | 'update' | 'readOnly'
    >(mode)

    const isEditMode = journalMode === 'update'

    const [journalVoucher, setJournalVoucher] = useState<
        Partial<IJournalVoucher> | undefined
    >(defaultValues)

    const { setSelectedMember } = useMemberPickerStore()

    const form = useForm<TJournalVoucherFormValues>({
        resolver: standardSchemaResolver(JournalVoucherSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
            date: toInputDateString(
                defaultValues?.date || getTimeMachineValue()
            ),
        },
    })

    const {
        mutate: createUpdateJournalVoucher,
        isPending: isCreating,
        error: createError,
        reset: resetCreate,
    } = useCreateUpdateJournalVoucher({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Journal Voucher Created',
                onSuccess: (data) => {
                    form.reset(data)
                    formProps.onSuccess?.(data)
                    setJournalVoucher(data)
                    setJournalVoucherMode('update')
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

        createUpdateJournalVoucher({
            journalVoucherId: isEditMode
                ? journalVoucher?.id
                : journalVoucherId,
            payload: payload,
        })
    }, handleFocusError)

    const isPending = isCreating
    const rawError = createError

    const error =
        serverRequestErrExtractor({ error: rawError }) ||
        form.formState.errors?.root?.message ||
        form.formState.errors.journal_voucher_entries?.message

    const handleSetMemberProfile = useCallback(
        (memberProfile: IMemberProfile | undefined) => {
            form.setValue('name', memberProfile?.full_name || '')
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

    useSubmitHotkey({
        onSubmit: onSubmit,
        isPending,
        disabled: mode === 'readOnly',
    })

    const isPrinted = !!defaultValues?.printed_date

    useHotkeys(
        'alt + 0',
        (e) => {
            e.preventDefault()
            form.setFocus('name')
        },
        { enableOnFormTags: true },
        [form]
    )
    useHotkeys(
        'alt + 1',
        (e) => {
            e.preventDefault()
            form.setFocus('date')
        },
        { enableOnFormTags: true },
        [form]
    )
    useHotkeys(
        'alt + 2',
        (e) => {
            e.preventDefault()
            form.setFocus('description')
        },
        { enableOnFormTags: true },
        [form]
    )
    useHotkeys(
        'alt + 3',
        (e) => {
            e.preventDefault()
            companyState.onOpenChange(!companyState.open)
        },
        { enableOnFormTags: true },
        [companyState]
    )
    useHotkeys(
        'alt + 4',
        (e) => {
            e.preventDefault()
            form.setFocus('date')
        },
        { enableOnFormTags: true },
        [form]
    )
    useHotkeys(
        'alt + slash',
        (e) => {
            e.preventDefault()
            form.setFocus('reference')
        },
        { enableOnFormTags: true },
        [form]
    )
    useHotkeys(
        'alt + semicolon',
        (e) => {
            e.preventDefault()
            popOverState.onOpenChange(!popOverState.open)
        },
        { enableOnFormTags: true },
        [popOverState]
    )

    const currency = useWatch({
        control: form.control,
        name: 'currency',
    })

    const { replace } = useFieldArray({
        name: 'journal_voucher_entries',
        control: form.control,
    })
    const getCreateDefaults = (): TJournalVoucherFormValues => ({
        name: '',
        date: toInputDateString(getTimeMachineValue()),
        description: '',
        currency: currency,
        currency_id: currency.id ?? '',
        journal_voucher_entries: [
            {
                account_id: '',
            },
        ],
        journal_voucher_entries_deleted: [],
    })

    const handleReset = () => {
        if (isEditMode) {
            form.reset({ ...journalVoucher })
        } else {
            const newRow: IJournalVoucherEntryRequest = {
                debit: 0,
                credit: 0,
                member_profile_id: defaultMemberProfile?.id,
                member_profile: defaultMemberProfile,
                account_id: '' as TEntityId,
                transaction_batch_id: undefined,
            }

            const entries = defaultValues?.journal_voucher_entries ?? [newRow]
            const resetValues = {
                ...getCreateDefaults(),
                ...defaultValues,
                journal_voucher_entries: entries,
            }

            form.reset(resetValues)
            replace([...resetValues.journal_voucher_entries])
        }

        resetCreate()
        setSelectedMember(null)

        queryClient.invalidateQueries({
            queryKey: [journalVoucherBaseKey, 'paginated'],
        })
    }

    const initialValues = useMemo(() => {
        if (mode === 'update' && defaultValues) {
            return {
                ...defaultValues,
                date: toInputDateString(new Date(defaultValues.date ?? '')),
            }
        }

        return getCreateDefaults()
    }, [mode, defaultValues?.id])

    useEffect(() => {
        form.reset(initialValues)
    }, [initialValues, form])

    return (
        <Form {...form}>
            <form
                className={cn('w-full! flex flex-col space-y-5', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset disabled={isPending || formProps.readOnly}>
                    <div className="absolute top-5 right-10 z-10 flex gap-2">
                        {journalVoucherId && (
                            <JournalVoucherTagsManagerPopover
                                journalVoucherId={journalVoucherId}
                                readOnly={isPrinted}
                                size="sm"
                            />
                        )}
                        {isEditMode && defaultValues && (
                            <div>
                                <JournalVoucherStatusIndicator
                                    journalVoucher={
                                        defaultValues as IJournalVoucher
                                    }
                                />
                            </div>
                        )}
                    </div>
                    <div className="gap-3 w-full flex flex-col">
                        <div className="col-span-3 inline-flex gap-2 w-full">
                            <div className="flex col-span-3 space-x-2 w-full ">
                                <Popover {...popOverState}>
                                    <PopoverTrigger asChild>
                                        <div className="flex flex-1 flex-col space-y-1 w-fit!">
                                            <Kbd className="block">alt + ;</Kbd>
                                            <Button
                                                className="px-2"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    popOverState.onOpenChange(
                                                        !popOverState.open
                                                    )
                                                }}
                                                tabIndex={-2}
                                                variant="secondary"
                                            >
                                                <GearIcon className="size-5" />
                                                More Options
                                            </Button>
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="bg-card w-fit">
                                        <FormFieldWrapper
                                            control={form.control}
                                            label={
                                                <Label className="text-xs font-medium text-muted-foreground">
                                                    Company{' '}
                                                    <span>
                                                        <KbdGroup>
                                                            <Kbd>Alt + .</Kbd>
                                                        </KbdGroup>
                                                    </span>
                                                </Label>
                                            }
                                            name="company_id"
                                            render={({ field }) => (
                                                <CompanyCombobox
                                                    {...field}
                                                    {...companyState}
                                                    allowShortcutHotKey
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                    mainTriggerProps={
                                                        {
                                                            // tabIndex: -2,
                                                        }
                                                    }
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
                                                    placeholder="Select a company"
                                                    shortcutHotKey="alt + comma"
                                                    value={field.value}
                                                />
                                            )}
                                        />
                                        <FormFieldWrapper
                                            className="relative"
                                            control={form.control}
                                            label={
                                                <Label className="text-xs font-medium text-muted-foreground">
                                                    Member <Kbd>alt + m</Kbd>
                                                </Label>
                                            }
                                            name="member_id"
                                            render={({ field }) => {
                                                return (
                                                    <>
                                                        <MemberPicker
                                                            allowClear
                                                            allowShortcutHotKey
                                                            disabled={isDisabled(
                                                                field.name
                                                            )}
                                                            mainTriggerProps={
                                                                {
                                                                    // tabIndex: -2,
                                                                }
                                                            }
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
                                                            placeholder="Select a member"
                                                            shortcutHotKey="alt + m"
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
                                            label={
                                                <Label className="text-xs font-medium text-muted-foreground">
                                                    Reference{' '}
                                                    <span>
                                                        <KbdGroup>
                                                            <Kbd>Alt + /</Kbd>
                                                        </KbdGroup>
                                                    </span>
                                                </Label>
                                            }
                                            name="reference"
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                    id={field.name}
                                                    placeholder="Enter reference"
                                                    // tabIndex={-2}
                                                />
                                            )}
                                        />{' '}
                                        <FormFieldWrapper
                                            control={form.control}
                                            label={
                                                <Label className="text-xs font-medium text-muted-foreground">
                                                    Currency *{' '}
                                                    <span>
                                                        <KbdGroup>
                                                            <Kbd>Alt + ,</Kbd>
                                                        </KbdGroup>
                                                    </span>
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
                                                    mainTriggerProps={
                                                        {
                                                            // tabIndex: -2,
                                                        }
                                                    }
                                                    onChange={(currency) => {
                                                        field.onChange(
                                                            currency?.id
                                                        )
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
                                    </PopoverContent>
                                </Popover>
                                <FormFieldWrapper
                                    className="w-full"
                                    control={form.control}
                                    label={
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            Name{' '}
                                            <span>
                                                <KbdGroup>
                                                    <Kbd>Alt + 0</Kbd>
                                                </KbdGroup>
                                            </span>
                                        </Label>
                                    }
                                    name="name"
                                    render={({ field }) => {
                                        return (
                                            <div className="relative w-full">
                                                <Input
                                                    className="text-md! pr-13 font-semibold"
                                                    // tabIndex={-2}
                                                    {...field}
                                                    id={field.name}
                                                    onChange={(item) => {
                                                        if (
                                                            item.target
                                                                .value === ''
                                                        ) {
                                                            form.setValue(
                                                                'member_id',
                                                                undefined
                                                            )
                                                            form.setValue(
                                                                'company_id',
                                                                undefined
                                                            )
                                                            form.setValue(
                                                                'member_profile',
                                                                undefined
                                                            )
                                                        }
                                                        field.onChange(item)
                                                    }}
                                                    value={field.value || ''}
                                                />
                                            </div>
                                        )
                                    }}
                                />{' '}
                                <FormFieldWrapper
                                    className="relative max-w-xs"
                                    control={form.control}
                                    description="mm/dd/yyyy"
                                    descriptionClassName="absolute top-1 right-0"
                                    label={
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            Date{' '}
                                            <span>
                                                <KbdGroup>
                                                    <Kbd>Alt + 1</Kbd>
                                                </KbdGroup>
                                            </span>
                                        </Label>
                                    }
                                    name="date"
                                    render={({ field }) => (
                                        <InputDate
                                            // tabIndex={-2}
                                            {...field}
                                            value={field.value ?? ''}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <FormFieldWrapper
                            className="col-span-3"
                            control={form.control}
                            label={
                                <Label className="text-xs font-medium text-muted-foreground">
                                    Particulars/Description{' '}
                                    <span>
                                        <KbdGroup>
                                            <Kbd>Alt + 2</Kbd>
                                        </KbdGroup>
                                    </span>
                                </Label>
                            }
                            name="description"
                            render={({ field }) => {
                                return (
                                    <div className="relative w-full">
                                        <Textarea
                                            {...field}
                                            className="text-md! w-full pr-13 font-semibold"
                                            value={field.value || ''}
                                        />
                                    </div>
                                )
                            }}
                        />
                    </div>
                    <JournalEntryTable
                        className="col-span-2 md:col-span-4"
                        currency={currency}
                        defaultMemberProfile={defaultMemberProfile}
                        form={form}
                        journalVoucherId={journalVoucherId ?? ''}
                        mode={mode}
                        transactionBatchId={data?.id}
                    />
                </fieldset>
                <div className="w-full flex justify-end gap-5">
                    <div className="max-w-fit flex-col flex justify-end">
                        <p className="text-primary bg-background border text-left rounded-md pl-9 pr-10 py-1 text-lg font-bold">
                            {currencyFormat(form.watch('total_debit') || 0, {
                                currency: form.watch('currency'),
                                showSymbol: !!form.watch('currency'),
                            })}
                        </p>
                    </div>
                    <div className="max-w-fit">
                        <p className="text-primary bg-background border text-left rounded-md pl-9 pr-10 py-1 text-lg font-bold">
                            {currencyFormat(form.watch('total_credit') || 0, {
                                currency: form.watch('currency'),
                                showSymbol: !!form.watch('currency'),
                            })}
                        </p>
                    </div>
                </div>
                <FormFooterResetSubmit
                    disableReset={
                        isEditMode ? !form.formState.isDirty : undefined
                    }
                    error={error}
                    isLoading={isPending}
                    onReset={handleReset}
                    readOnly={formProps.readOnly}
                    submitText={
                        <div className="inline-flex items-center gap-3">
                            <kbd className="text-xs">
                                {isEditMode ? 'Update' : 'Create'}
                            </kbd>
                            <CommandShortcut className="bg-secondary text-xs min-w-fit size-fit px-3 py-0.5 rounded-sm text-primary">
                                Enter
                            </CommandShortcut>
                        </div>
                    }
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
            className={cn('min-w-3xl! max-w-5xl!', className)}
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
