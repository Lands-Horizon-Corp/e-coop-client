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
    useCreateJournalVoucher,
    useUpdateJournalVoucherById,
} from '@/modules/journal-voucher'
import { JournalVoucherTagsManagerPopover } from '@/modules/journal-voucher-tag/components/journal-voucher-tag-management'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { getTimeMachineValue } from '@/modules/user-organization/user-organization-utils'
import { useMemberPickerStore } from '@/store/member-picker-store'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { BookIcon, ChevronDownIcon, XIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { CommandShortcut } from '@/components/ui/command'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
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

    const othersAccordionState = useModalState(false)
    const companyState = useModalState(false)

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
        if (editJournalId) return
        form.setValue('journal_voucher_entries', [
            {
                account_id: '',
            },
        ])
    }, [defaultMode, form])

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
                    form.reset(data)
                    formProps.onSuccess?.(data)
                    setEditJournalId(data.id)
                    setDefaultMode('update')
                    form.reset(data)
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
                    form.reset(data)
                    formProps.onSuccess?.(data)
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

        if (isUpdate) {
            updateJournalVoucher({
                id: editJournalId,
                payload: payload,
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
            if (defaultMode !== 'readOnly') {
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
        'alt + 6',
        (e) => {
            e.preventDefault()
            form.setFocus('reference')
        },
        { enableOnFormTags: true },
        [form]
    )

    useHotkeys(
        'alt + w',
        (e) => {
            e.preventDefault()
            othersAccordionState.onOpenChange(!othersAccordionState.open)
        },
        { enableOnFormTags: true },
        [othersAccordionState]
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
                        {isUpdate && (
                            <JournalVoucherTagsManagerPopover
                                journalVoucherId={editJournalId}
                                readOnly={isPrinted}
                                size="sm"
                            />
                        )}
                        {editJournalId && defaultValues && (
                            <div>
                                <JournalVoucherStatusIndicator
                                    journalVoucher={
                                        defaultValues as IJournalVoucher
                                    }
                                />
                            </div>
                        )}
                        <div className=" bg-muted p-1 rounded-sm -top-1 right-0 z-10 flex items-center">
                            <Button
                                className="size-fit px-2 py-0.5 mr-1 text-xs"
                                size="sm"
                                tabIndex={-1}
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
                    <div className="gap-2 w-full flex flex-col">
                        <FormFieldWrapper
                            className="col-span-4"
                            control={form.control}
                            label={
                                <Label className="text-xs font-medium text-muted-foreground">
                                    Amount{' '}
                                    <span>
                                        <KbdGroup>
                                            <Kbd>Alt</Kbd>
                                            <span>+</span>
                                            <Kbd>1</Kbd>
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
                                            tabIndex={-1}
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
                                                    member_id: undefined,
                                                    name: '',
                                                })
                                            }}
                                            size={'sm'}
                                            tabIndex={-1}
                                            variant="ghost"
                                        >
                                            <XIcon />
                                        </Button>
                                    </div>
                                )
                            }}
                        />
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            label={
                                <Label className="text-xs font-medium text-muted-foreground">
                                    Particulars/Description{' '}
                                    <span>
                                        <KbdGroup>
                                            <Kbd>Alt</Kbd>
                                            <span>+</span>
                                            <Kbd>2</Kbd>
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
                                            tabIndex={-1}
                                            {...field}
                                        />
                                    </div>
                                )
                            }}
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <FormFieldWrapper
                                className="relative"
                                control={form.control}
                                label={
                                    <Label className="text-xs font-medium text-muted-foreground">
                                        Member Profile <Kbd>Enter</Kbd>
                                    </Label>
                                }
                                name="member_id"
                                render={({ field }) => {
                                    return (
                                        <>
                                            <MemberPicker
                                                allowShorcutCommand
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
                                                    setDefaultMemberProfile(
                                                        selectedMember
                                                    )
                                                }}
                                                placeholder="Relative Member Profile"
                                                // shorcutHotKey="Alt + 3"
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
                                        Company{' '}
                                        <span>
                                            <KbdGroup>
                                                <Kbd>Alt</Kbd>
                                                <span>+</span>
                                                <Kbd>4</Kbd>
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
                                        disabled={isDisabled(field.name)}
                                        mainTriggerProps={{
                                            tabIndex: -1,
                                        }}
                                        onChange={(selectedCompany) => {
                                            field.onChange(selectedCompany.id)
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
                                        shortcutHotkey="alt + 4"
                                        value={field.value}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="relative"
                                control={form.control}
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                label={
                                    <Label className="text-xs font-medium text-muted-foreground">
                                        Date{' '}
                                        <span>
                                            <KbdGroup>
                                                <Kbd>Alt</Kbd>
                                                <span>+</span>
                                                <Kbd>5</Kbd>
                                            </KbdGroup>
                                        </span>
                                    </Label>
                                }
                                name="date"
                                render={({ field }) => (
                                    <InputDate
                                        tabIndex={-1}
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label={
                                    <Label className="text-xs font-medium text-muted-foreground">
                                        Reference{' '}
                                        <span>
                                            <KbdGroup>
                                                <Kbd>Alt</Kbd>
                                                <span>+</span>
                                                <Kbd>6</Kbd>
                                            </KbdGroup>
                                        </span>
                                    </Label>
                                }
                                name="reference"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Enter reference"
                                        tabIndex={-1}
                                    />
                                )}
                            />
                        </div>
                        <Collapsible
                            {...othersAccordionState}
                            className="w-full col-span-4 justify-end mb-1"
                        >
                            <CollapsibleTrigger
                                className={cn(
                                    'text-sm justify-start w-full flex text-primary gap-x-2'
                                )}
                                tabIndex={-1}
                            >
                                <div className="flex items-center flex-col justify-between w-full">
                                    <div className="w-full inline-flex py-2">
                                        <span className="ml-1 text-xs font-medium text-muted-foreground">
                                            others
                                            <KbdGroup>
                                                <Kbd>Alt</Kbd>
                                                <span>+</span>
                                                <Kbd>w</Kbd>
                                            </KbdGroup>
                                        </span>
                                        <ChevronDownIcon
                                            className={cn(
                                                'ml-auto ease-in-out duration-200',
                                                !othersAccordionState.open &&
                                                    ' rotate-180'
                                            )}
                                        />
                                    </div>
                                    <Separator />
                                </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="w-full py-1 ecoop-scroll flex flex-col gap-x-2 ">
                                <FormFieldWrapper
                                    className="mt-2"
                                    control={form.control}
                                    label={
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            Currency *{' '}
                                            <span>
                                                <KbdGroup>
                                                    <Kbd>Alt</Kbd>
                                                    <span>+</span>
                                                    <Kbd>E</Kbd>
                                                </KbdGroup>
                                            </span>
                                        </Label>
                                    }
                                    name="currency_id"
                                    render={({ field }) => (
                                        <CurrencyCombobox
                                            {...field}
                                            allowShortcutHotKey
                                            disabled={isDisabled(field.name)}
                                            mainTriggerProps={{
                                                tabIndex: -1,
                                            }}
                                            onChange={(currency) => {
                                                field.onChange(currency?.id)
                                                form.setValue(
                                                    'currency',
                                                    currency
                                                )
                                            }}
                                            shortcutHotkey="alt + e"
                                            value={field.value}
                                        />
                                    )}
                                />
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    <>
                        <FormFieldWrapper
                            className="col-span-1 md:col-span-4 max-h-xs!"
                            control={form.control}
                            label="Particulars"
                            name="journal_voucher_entries"
                            render={({ field }) => (
                                <JournalEntryTable
                                    className="col-span-1 md:col-span-4"
                                    currency={form.watch('currency')}
                                    defaultMemberProfile={defaultMemberProfile}
                                    form={form}
                                    journalVoucherId={journalVoucherId ?? ''}
                                    mode={defaultMode}
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
