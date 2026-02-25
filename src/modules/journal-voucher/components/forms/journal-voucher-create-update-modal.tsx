import { useCallback, useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
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
import { JournalVoucherTagsManagerPopover } from '@/modules/journal-voucher-tag/components/journal-voucher-tag-management'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { getTimeMachineValue } from '@/modules/user-organization/user-organization-utils'
import { useMemberPickerStore } from '@/store/member-picker-store'
import { is } from 'date-fns/locale'
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

    const [journalId, setJournalVoucherId] = useState<TEntityId | undefined>(
        journalVoucherId
    )
    const isEditMode = !!journalId

    const [defaultMemberProfile, setDefaultMemberProfile] = useState<
        IMemberProfile | undefined
    >(defaultValues?.member_profile)

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

    useEffect(() => {
        if (isEditMode) return
        form.setValue('journal_voucher_entries', [
            {
                account_id: '',
            },
        ])
    }, [isEditMode, mode, form])

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
                    setJournalVoucherId(data.id)
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
            journalVoucherId: isEditMode ? journalId : journalVoucherId,
            payload: payload,
        })
    }, handleFocusError)

    const isPending = isCreating
    const rawError = createError

    const error =
        serverRequestErrExtractor({ error: rawError }) ||
        form.formState.errors?.root?.message

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

    useHotkeys(
        'ctrl + enter',
        (e) => {
            e.preventDefault()
            if (mode !== 'readOnly') {
                onSubmit()
            }
        },
        { enableOnFormTags: true },
        []
    )

    const isPrinted = !!defaultValues?.printed_date

    useHotkeys(
        'alt + 1',
        (e) => {
            e.preventDefault()
            form.setFocus('name')
        },
        { enableOnFormTags: true },
        [form]
    )

    useHotkeys(
        'alt + 2',
        (e) => {
            e.preventDefault()
            form.setFocus('date')
        },
        { enableOnFormTags: true },
        [form]
    )

    useHotkeys(
        'alt + 3',
        (e) => {
            e.preventDefault()
            form.setFocus('description')
        },
        { enableOnFormTags: true },
        [form]
    )

    useHotkeys(
        'alt + 4',
        (e) => {
            e.preventDefault()
            companyState.onOpenChange(!companyState.open)
        },
        { enableOnFormTags: true },
        [companyState]
    )
    useHotkeys(
        'alt + 5',
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

    return (
        <Form {...form}>
            <form
                className={cn('w-full! flex flex-col space-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset disabled={isPending || formProps.readOnly}>
                    <div className="absolute top-4 right-10 z-10 flex gap-2">
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
                    <div className="gap-2 w-full flex flex-col">
                        <div className="col-span-2 inline-flex gap-2 w-full">
                            <div className="flex col-span-2 space-x-2 w-full ">
                                <Popover {...popOverState}>
                                    <PopoverTrigger asChild>
                                        <div className="flex flex-0 flex-col space-y-1 w-fit!">
                                            <Kbd className="block">alt + ;</Kbd>
                                            <Button
                                                className="px-1"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    popOverState.onOpenChange(
                                                        !popOverState.open
                                                    )
                                                }}
                                                tabIndex={-1}
                                                variant="secondary"
                                            >
                                                <GearIcon className="size-4" />
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
                                                            // tabIndex: -1,
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
                                                                    // tabIndex: -1,
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
                                                    // tabIndex={-1}
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
                                                            // tabIndex: -1,
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
                                                    <Kbd>Alt + 1</Kbd>
                                                </KbdGroup>
                                            </span>
                                        </Label>
                                    }
                                    name="name"
                                    render={({ field }) => {
                                        return (
                                            <div className="relative w-full">
                                                <Input
                                                    className="text-md! pr-12 font-semibold"
                                                    // tabIndex={-1}
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
                                    descriptionClassName="absolute top-0 right-0"
                                    label={
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            Date{' '}
                                            <span>
                                                <KbdGroup>
                                                    <Kbd>Alt + 2</Kbd>
                                                </KbdGroup>
                                            </span>
                                        </Label>
                                    }
                                    name="date"
                                    render={({ field }) => (
                                        <InputDate
                                            // tabIndex={-1}
                                            {...field}
                                            value={field.value ?? ''}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            label={
                                <Label className="text-xs font-medium text-muted-foreground">
                                    Particulars/Description{' '}
                                    <span>
                                        <KbdGroup>
                                            <Kbd>Alt + 3</Kbd>
                                        </KbdGroup>
                                    </span>
                                </Label>
                            }
                            name="description"
                            render={({ field }) => {
                                return (
                                    <div className="relative w-full">
                                        <Textarea
                                            className="text-md! pr-12 font-semibold"
                                            // tabIndex={-1}
                                            {...field}
                                        />
                                    </div>
                                )
                            }}
                        />
                    </div>

                    <>
                        <FormFieldWrapper
                            className="col-span-1 md:col-span-4 max-h-xs!"
                            control={form.control}
                            name="journal_voucher_entries"
                            render={({ field }) => (
                                <JournalEntryTable
                                    className="col-span-1 md:col-span-4"
                                    currency={form.watch('currency')}
                                    defaultMemberProfile={defaultMemberProfile}
                                    form={form}
                                    journalVoucherId={journalVoucherId ?? ''}
                                    mode={mode}
                                    ref={field.ref}
                                    transactionBatchId={data?.id}
                                />
                            )}
                        />
                    </>
                </fieldset>
                <div className="w-full flex justify-end gap-4">
                    <div className="max-w-[130px] flex-col flex justify-end">
                        <p className="text-primary bg-background border text-left rounded-md pl-8 pr-10 py-1 text-lg font-bold">
                            {currencyFormat(form.watch('total_debit') || 0, {
                                currency: form.watch('currency'),
                                showSymbol: !!form.watch('currency'),
                            })}
                        </p>
                    </div>
                    <div className="max-w-[130px]">
                        <p className="text-primary bg-background border text-left rounded-md pl-8 pr-10 py-1 text-lg font-bold">
                            {currencyFormat(form.watch('total_credit') || 0, {
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
                        if (isEditMode) {
                            form.reset({
                                ...defaultValues,
                                date: defaultValues?.date
                                    ? new Date(defaultValues.date).toISOString()
                                    : undefined,
                            })
                        } else {
                            form.reset()
                        }
                        resetCreate()
                        setSelectedMember(null)
                        queryClient.invalidateQueries({
                            queryKey: [journalVoucherBaseKey, 'paginated'],
                        })
                    }}
                    readOnly={formProps.readOnly}
                    submitText={
                        <div className="inline-flex items-center gap-2">
                            <kbd className="text-xs">
                                {isEditMode ? 'Update' : 'Create'}
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
            className={cn('min-w-2xl! max-w-5xl!', className)}
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
