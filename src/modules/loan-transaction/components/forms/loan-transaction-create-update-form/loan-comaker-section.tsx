import { KeyboardEvent, forwardRef, memo, useRef, useState } from 'react'

import { Path, UseFormReturn, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import { formatNumber } from '@/helpers'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import { IComakerCollateralRequest } from '@/modules/comaker-collateral/comaker-collateral.types'
import { ComakerCollateralCreateUpdateModal } from '@/modules/comaker-collateral/components/forms/comaker-collateral-create-update-form'
import { IComakerMemberProfileRequest } from '@/modules/comaker-member-profile'
import { ComakerMemberProfileCreateUpdateModal } from '@/modules/comaker-member-profile/components/forms/comaker-member-profile-create-update-form'
import { TLoanTransactionSchema } from '@/modules/loan-transaction/loan-transaction.validation'
import MemberAccountingLedgerPicker from '@/modules/member-accounting-ledger/components/member-accounting-ledger-picker'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    CheckFillIcon,
    DotsHorizontalIcon,
    HandDepositIcon,
    PencilFillIcon,
    PlusIcon,
    TextFileFillIcon,
    TrashIcon,
    UserIcon,
    XIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import { CommandShortcut } from '@/components/ui/command'
import { FormItem } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

type Props = {
    form: UseFormReturn<TLoanTransactionSchema>
    isDisabled: (fieldName: Path<TLoanTransactionSchema>) => boolean
}

const LoanComakerSection = ({ form, isDisabled }: Props) => {
    const memberProfile = form.watch('member_profile_id')
    const comakerType = form.watch('comaker_type')
    const comaker_deposit_member_accounting_ledger = form.watch(
        'comaker_deposit_member_accounting_ledger'
    )

    const { currentAuth } = useAuthStore()

    return (
        <fieldset
            disabled={!memberProfile}
            className="space-y-4 rounded-xl p-4 bg-popover"
        >
            <div className="justify-between flex items-center">
                <div>
                    <p className="font-medium">
                        <TextFileFillIcon className="inline text-primary" />{' '}
                        Comaker
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Specify comakers for this loan
                    </p>
                </div>
            </div>
            {!memberProfile && (
                <FormErrorMessage errorMessage="Select member profile first to enable this section" />
            )}
            <div className="space-y-2 col-span-5">
                <FormFieldWrapper
                    control={form.control}
                    name="comaker_type"
                    label="Comaker"
                    className="shrink-0"
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                            className="gap-x-8 py-4 flex items-center rounded-xl border-2 px-4"
                        >
                            <FormItem>
                                <div className="flex items-center gap-x-2">
                                    <RadioGroupItem
                                        value="none"
                                        id="comaker-none"
                                    />
                                    <Label
                                        htmlFor="comaker-none"
                                        className="flex items-center cursor-pointer gap-2 min-w-0"
                                    >
                                        <div className="min-w-0">
                                            <span className="text-foreground text-sm font-medium">
                                                None
                                            </span>
                                        </div>
                                    </Label>
                                </div>
                            </FormItem>

                            <FormItem>
                                <div className="flex items-center gap-x-2">
                                    <RadioGroupItem
                                        value="member"
                                        id="comaker-member"
                                    />
                                    <Label
                                        htmlFor="comaker-member"
                                        className="flex items-center cursor-pointer gap-2 min-w-0"
                                    >
                                        <UserIcon
                                            aria-hidden="true"
                                            className="shrink-0 inline opacity-60"
                                        />
                                        <div className="min-w-0">
                                            <span className="text-foreground text-sm font-medium">
                                                Member
                                            </span>
                                        </div>
                                    </Label>
                                </div>
                            </FormItem>

                            <FormItem>
                                <div className="flex items-center gap-x-2">
                                    <RadioGroupItem
                                        value="deposit"
                                        id="comaker-deposit"
                                    />
                                    <Label
                                        htmlFor="comaker-deposit"
                                        className="flex items-center cursor-pointer gap-2 min-w-0"
                                    >
                                        <HandDepositIcon
                                            aria-hidden="true"
                                            className="shrink-0 inline opacity-60"
                                        />
                                        <div className="min-w-0">
                                            <span className="text-foreground text-sm font-medium">
                                                Deposit
                                            </span>
                                        </div>
                                    </Label>
                                </div>
                            </FormItem>

                            <FormItem>
                                <div className="flex items-center gap-x-2">
                                    <RadioGroupItem
                                        value="others"
                                        id="comaker-others"
                                    />
                                    <Label
                                        htmlFor="comaker-others"
                                        className="flex items-center cursor-pointer gap-2 min-w-0"
                                    >
                                        <DotsHorizontalIcon
                                            aria-hidden="true"
                                            className="shrink-0 inline opacity-60"
                                        />
                                        <div className="min-w-0">
                                            <span className="text-foreground text-sm font-medium">
                                                Others
                                            </span>
                                        </div>
                                    </Label>
                                </div>
                            </FormItem>
                        </RadioGroup>
                    )}
                />

                {comakerType === 'member' && (
                    <ComakerMemberProfileField
                        isDisabled={isDisabled}
                        form={form}
                    />
                )}

                {comakerType === 'others' && (
                    <ComakerCollateralField
                        isDisabled={isDisabled}
                        form={form}
                    />
                )}

                {comakerType === 'deposit' && (
                    <>
                        <FormFieldWrapper
                            control={form.control}
                            name="comaker_deposit_member_accounting_ledger_id"
                            label="Comaker Member Deposit Account Ledger"
                            className="shrink-0"
                            render={({ field }) => (
                                <span className="flex gap-x-2 items-center">
                                    <MemberAccountingLedgerPicker
                                        mode="member"
                                        triggerClassName="flex-1"
                                        memberProfileId={memberProfile}
                                        value={
                                            comaker_deposit_member_accounting_ledger
                                        }
                                        onSelect={(memberAccountingLedger) => {
                                            field.onChange(
                                                memberAccountingLedger.id
                                            )

                                            form.setValue(
                                                'comaker_deposit_member_accounting_ledger',
                                                memberAccountingLedger
                                            )

                                            if (
                                                currentAuth.user_organization
                                                    ?.branch?.branch_setting
                                                    ?.loan_applied_equal_to_balance
                                            ) {
                                                form.setValue(
                                                    'applied_1',
                                                    memberAccountingLedger.balance,
                                                    { shouldDirty: true }
                                                )
                                            }
                                        }}
                                    />
                                    {form.getValues(
                                        'comaker_deposit_member_accounting_ledger_id'
                                    ) !== undefined && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => {
                                                field.onChange(undefined)
                                                form.setValue(
                                                    'comaker_deposit_member_accounting_ledger',
                                                    undefined
                                                )
                                            }}
                                            className="shrink-0"
                                            size="icon"
                                        >
                                            <XIcon />
                                        </Button>
                                    )}
                                </span>
                            )}
                        />
                    </>
                )}
            </div>
        </fieldset>
    )
}

// LOAN COMAKER MEMBER
const ComakerMemberProfileField = ({
    form,
    isDisabled,
}: {
    form: UseFormReturn<TLoanTransactionSchema>
    isDisabled: (fieldName: Path<TLoanTransactionSchema>) => boolean
}) => {
    const addComakerMemberModal = useModalState()
    const comakerMemberRowRefs = useRef<(HTMLTableRowElement | null)[]>([])
    const [focusedIndex, setFocusedIndex] = useState(-1)

    const disabled = isDisabled('loan_clearance_analysis_institution')

    const memberProfileId = form.watch('member_profile_id')

    const {
        fields: comakerMemberProfiles,
        remove,
        update,
        append,
    } = useFieldArray({
        control: form.control,
        name: 'comaker_member_profiles',
        keyName: 'fieldKey',
    })

    const { append: addDeletedComakerMember } = useFieldArray({
        control: form.control,
        name: 'comaker_member_profiles_deleted',
        keyName: 'fieldKey',
    })

    useHotkeys('shift+c+m', (e) => {
        e.stopPropagation()
        e.preventDefault()
        addComakerMemberModal?.onOpenChange(true)
    })

    const handleRemoveInstitution = (index: number, id?: TEntityId) => {
        remove(index)
        if (id) addDeletedComakerMember(id)
        toast.warning(
            <span>Institution Removed. Don&apos;t forget to save changes.</span>
        )
    }

    const handleUpdateInstitution = (
        index: number,
        updatedData: IComakerMemberProfileRequest
    ) => {
        update(index, updatedData)
        toast(
            <span>
                <CheckFillIcon className="mr-1 text-primary inline" /> Comaker
                Member Updated. Don&apos;t forget to save changes.
            </span>
        )
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            const nextIndex = Math.min(
                focusedIndex + 1,
                comakerMemberProfiles.length - 1
            )
            setFocusedIndex(nextIndex)
            comakerMemberRowRefs.current[nextIndex]?.focus()
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            const prevIndex = Math.max(focusedIndex - 1, 0)
            setFocusedIndex(prevIndex)
            comakerMemberRowRefs.current[prevIndex]?.focus()
        }
    }

    return (
        <>
            <ComakerMemberProfileCreateUpdateModal
                {...addComakerMemberModal}
                formProps={{
                    exceptId: memberProfileId,
                    onSuccess: (comakerMember) => {
                        append(comakerMember)
                        toast(
                            <span>
                                <PlusIcon className="mr-1 text-primary inline" />{' '}
                                Comaker Member Added. Don&apos;t forget to save
                                changes.
                            </span>
                        )
                    },
                }}
            />
            <FormFieldWrapper
                control={form.control}
                name="comaker_member_profiles"
                render={({ field }) => (
                    <fieldset
                        disabled={disabled}
                        className="max-w-full min-w-0"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-medium">Comaker Member</p>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    type="button"
                                    tabIndex={0}
                                    className="size-fit px-2 py-0.5 text-xs"
                                    onClick={() =>
                                        addComakerMemberModal.onOpenChange(true)
                                    }
                                >
                                    Add <PlusIcon className="inline" />
                                </Button>
                                <p className="text-xs p-1 px-2 bg-muted text-muted-foreground rounded-sm">
                                    or Press{' '}
                                    <CommandShortcut className="bg-accent p-0.5 px-1 text-primary rounded-sm mr-1">
                                        Shift + C + M
                                    </CommandShortcut>
                                </p>
                            </div>
                        </div>
                        <Table
                            ref={field.ref}
                            onKeyDown={handleKeyDown}
                            tabIndex={0}
                            wrapperClassName="max-h-[50vh] max-w-full min-w-0 min-h-32 bg-secondary rounded-xl ecoop-scroll"
                        >
                            <TableHeader className="sticky top-0 z-10 backdrop-blur-xs">
                                <TableRow className="odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent">
                                    <TableHead className="p-2">
                                        Member
                                    </TableHead>
                                    <TableHead className="p-2">
                                        Description
                                    </TableHead>
                                    <TableHead className="w-44 text-right">
                                        Amount
                                    </TableHead>
                                    <TableHead className="w-36 text-right">
                                        Month Count
                                    </TableHead>
                                    <TableHead className="w-36 text-right">
                                        Year Count
                                    </TableHead>
                                    <TableHead className="w-16" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {comakerMemberProfiles.map((field, index) => (
                                    <ComakerMemberRow
                                        exceptId={memberProfileId}
                                        key={field.fieldKey}
                                        field={field}
                                        index={index}
                                        ref={(el) => {
                                            comakerMemberRowRefs.current[
                                                index
                                            ] = el
                                        }}
                                        onRemove={handleRemoveInstitution}
                                        onUpdate={handleUpdateInstitution}
                                    />
                                ))}

                                {comakerMemberProfiles.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <p className="py-16 text-center text-sm text-muted-foreground/80">
                                                No institutions yet.
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </fieldset>
                )}
            />
        </>
    )
}

interface IComakerMemberRowProps {
    field: IComakerMemberProfileRequest & { fieldKey: string }
    index: number
    exceptId: TEntityId
    onRemove: (index: number, id?: TEntityId) => void
    onUpdate: (index: number, updatedData: IComakerMemberProfileRequest) => void
}

const ComakerMemberRow = memo(
    forwardRef<HTMLTableRowElement, IComakerMemberRowProps>(
        ({ field, exceptId, index, onRemove, onUpdate }, ref) => {
            const rowRef = useRef<HTMLTableRowElement>(null)
            const editModalState = useModalState()

            const handleRowKeyDown = (
                e: KeyboardEvent<HTMLTableRowElement>
            ) => {
                if (e.key === 'Delete') {
                    e.preventDefault()
                    e.stopPropagation()
                    onRemove(index, field.id)
                } else if (e.key === 'F2') {
                    e.preventDefault()
                    e.stopPropagation()
                    editModalState.onOpenChange(true)
                }
            }

            return (
                <>
                    <TableRow
                        ref={(el) => {
                            rowRef.current = el
                            if (typeof ref === 'function') {
                                ref(el)
                            } else if (ref) {
                                ref.current = el
                            }
                        }}
                        key={field.id}
                        onKeyDown={handleRowKeyDown}
                        tabIndex={-1}
                        className="*:border-border focus:bg-background focus:outline-0 odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent"
                    >
                        <TableCell>
                            <div className="flex gap-x-4">
                                <PreviewMediaWrapper
                                    media={field.member_profile?.media}
                                >
                                    <div className="flex items-center gap-x-2">
                                        <ImageDisplay
                                            src={
                                                field.member_profile?.media
                                                    ?.download_url
                                            }
                                        />
                                        <span>
                                            {field.member_profile?.full_name ||
                                                'unknown name'}
                                        </span>
                                    </div>
                                </PreviewMediaWrapper>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground/80">
                                    {field.description || '-'}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="text-sm font-mono text-right">
                            {formatNumber(field.amount, 2)}
                        </TableCell>
                        <TableCell className="text-sm font-mono text-right">
                            {formatNumber(field.months_count)}
                        </TableCell>
                        <TableCell className="text-sm font-mono text-right">
                            {formatNumber(field.year_count)}
                        </TableCell>
                        <TableCell>
                            <div className="flex justify-end gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        editModalState.onOpenChange(true)
                                    }
                                    className="size-8 p-0"
                                >
                                    <PencilFillIcon className="size-4" />
                                    <span className="sr-only">
                                        Edit institution
                                    </span>
                                </Button>
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onRemove(index, field.id)}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    <span className="sr-only">
                                        Remove institution
                                    </span>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>

                    <ComakerMemberProfileCreateUpdateModal
                        {...editModalState}
                        onOpenChange={(state) => {
                            if (!state) {
                                rowRef.current?.focus()
                            }
                            editModalState.onOpenChange(state)
                        }}
                        title="Edit Comaker Member"
                        description="Update Comaker Member."
                        formProps={{
                            exceptId,
                            defaultValues: field,
                            onSuccess: (updatedData) => {
                                onUpdate(index, { ...field, ...updatedData })
                            },
                        }}
                    />
                </>
            )
        }
    )
)

ComakerMemberRow.displayName = 'LoanClearanceAnalysisInstitutionRow'

// LOAN COMAKER COLLATERAL
const ComakerCollateralField = ({
    form,
    isDisabled,
}: {
    form: UseFormReturn<TLoanTransactionSchema>
    isDisabled: (fieldName: Path<TLoanTransactionSchema>) => boolean
}) => {
    const addComakerCollateralModal = useModalState()
    const comakerCollateralRowRefs = useRef<(HTMLTableRowElement | null)[]>([])
    const [focusedIndex, setFocusedIndex] = useState(-1)

    const disabled = isDisabled('loan_clearance_analysis_institution')

    const {
        fields: comakerCollaterals,
        remove,
        update,
        append,
    } = useFieldArray({
        control: form.control,
        name: 'comaker_collaterals',
        keyName: 'fieldKey',
    })

    const { append: addDeletedComakerCollateral } = useFieldArray({
        control: form.control,
        name: 'comaker_collaterals_deleted',
        keyName: 'fieldKey',
    })

    useHotkeys('shift+c+o', (e) => {
        e.stopPropagation()
        e.preventDefault()
        addComakerCollateralModal?.onOpenChange(true)
    })

    const handleRemoveCollateral = (index: number, id?: TEntityId) => {
        remove(index)
        if (id) addDeletedComakerCollateral(id)
        toast.warning(
            <span>Collateral Removed. Don&apos;t forget to save changes.</span>
        )
    }

    const handleUpdateCollateral = (
        index: number,
        updatedData: IComakerCollateralRequest
    ) => {
        update(index, updatedData)
        toast(
            <span>
                <CheckFillIcon className="mr-1 text-primary inline" /> Comaker
                Collateral Updated. Don&apos;t forget to save changes.
            </span>
        )
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            const nextIndex = Math.min(
                focusedIndex + 1,
                comakerCollaterals.length - 1
            )
            setFocusedIndex(nextIndex)
            comakerCollateralRowRefs.current[nextIndex]?.focus()
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            const prevIndex = Math.max(focusedIndex - 1, 0)
            setFocusedIndex(prevIndex)
            comakerCollateralRowRefs.current[prevIndex]?.focus()
        }
    }

    return (
        <>
            <ComakerCollateralCreateUpdateModal
                {...addComakerCollateralModal}
                formProps={{
                    onSuccess: (comakerCollateral) => {
                        append(comakerCollateral)
                        toast(
                            <span>
                                <PlusIcon className="mr-1 text-primary inline" />{' '}
                                Comaker Collateral Added. Don&apos;t forget to
                                save changes.
                            </span>
                        )
                    },
                }}
            />
            <FormFieldWrapper
                control={form.control}
                name="comaker_collaterals"
                render={({ field }) => (
                    <fieldset
                        disabled={disabled}
                        className="max-w-full min-w-0"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-medium">Comaker Collateral</p>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    type="button"
                                    tabIndex={0}
                                    className="size-fit px-2 py-0.5 text-xs"
                                    onClick={() =>
                                        addComakerCollateralModal.onOpenChange(
                                            true
                                        )
                                    }
                                >
                                    Add <PlusIcon className="inline" />
                                </Button>
                                <p className="text-xs p-1 px-2 bg-muted text-muted-foreground rounded-sm">
                                    or Press{' '}
                                    <CommandShortcut className="bg-accent p-0.5 px-1 text-primary rounded-sm mr-1">
                                        Shift + C + O
                                    </CommandShortcut>
                                </p>
                            </div>
                        </div>
                        <Table
                            ref={field.ref}
                            onKeyDown={handleKeyDown}
                            tabIndex={0}
                            wrapperClassName="max-h-[50vh] max-w-full min-w-0 min-h-32 bg-secondary rounded-xl ecoop-scroll"
                        >
                            <TableHeader className="sticky top-0 z-10 backdrop-blur-xs">
                                <TableRow className="odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent">
                                    <TableHead className="p-2">
                                        Collateral
                                    </TableHead>
                                    <TableHead className="p-2">
                                        Description
                                    </TableHead>
                                    <TableHead className="w-44 text-right">
                                        Amount
                                    </TableHead>
                                    <TableHead className="w-36 text-right">
                                        Month Count
                                    </TableHead>
                                    <TableHead className="w-36 text-right">
                                        Year Count
                                    </TableHead>
                                    <TableHead className="w-16" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {comakerCollaterals.map((field, index) => (
                                    <ComakerCollateralRow
                                        key={field.fieldKey}
                                        field={field}
                                        index={index}
                                        ref={(el) => {
                                            comakerCollateralRowRefs.current[
                                                index
                                            ] = el
                                        }}
                                        onRemove={handleRemoveCollateral}
                                        onUpdate={handleUpdateCollateral}
                                    />
                                ))}

                                {comakerCollaterals.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <p className="py-16 text-center text-sm text-muted-foreground/80">
                                                No collaterals yet.
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </fieldset>
                )}
            />
        </>
    )
}

interface IComakerCollateralRowProps {
    field: IComakerCollateralRequest & { fieldKey: string }
    index: number
    onRemove: (index: number, id?: TEntityId) => void
    onUpdate: (index: number, updatedData: IComakerCollateralRequest) => void
}

const ComakerCollateralRow = memo(
    forwardRef<HTMLTableRowElement, IComakerCollateralRowProps>(
        ({ field, index, onRemove, onUpdate }, ref) => {
            const rowRef = useRef<HTMLTableRowElement>(null)
            const editModalState = useModalState()

            const handleRowKeyDown = (
                e: KeyboardEvent<HTMLTableRowElement>
            ) => {
                if (e.key === 'Delete') {
                    e.preventDefault()
                    e.stopPropagation()
                    onRemove(index, field.id)
                } else if (e.key === 'F2') {
                    e.preventDefault()
                    e.stopPropagation()
                    editModalState.onOpenChange(true)
                }
            }

            return (
                <>
                    <TableRow
                        ref={(el) => {
                            rowRef.current = el
                            if (typeof ref === 'function') {
                                ref(el)
                            } else if (ref) {
                                ref.current = el
                            }
                        }}
                        key={field.id}
                        onKeyDown={handleRowKeyDown}
                        tabIndex={-1}
                        className="*:border-border focus:bg-background focus:outline-0 odd:bg-muted/50 odd:hover:bg-muted/50 border-none hover:bg-transparent"
                    >
                        <TableCell>
                            <div className="flex gap-x-4">
                                <span>
                                    {field.collateral?.name || 'unknown'}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground/80">
                                    {field.description || '-'}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="text-sm font-mono text-right">
                            {formatNumber(field.amount, 2)}
                        </TableCell>
                        <TableCell className="text-sm font-mono text-right">
                            {formatNumber(field.months_count)}
                        </TableCell>
                        <TableCell className="text-sm font-mono text-right">
                            {formatNumber(field.year_count)}
                        </TableCell>
                        <TableCell>
                            <div className="flex justify-end gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        editModalState.onOpenChange(true)
                                    }
                                    className="size-8 p-0"
                                >
                                    <PencilFillIcon className="size-4" />
                                    <span className="sr-only">
                                        Edit collateral
                                    </span>
                                </Button>
                                <Button
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onRemove(index, field.id)}
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    <span className="sr-only">
                                        Remove collateral
                                    </span>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>

                    <ComakerCollateralCreateUpdateModal
                        {...editModalState}
                        onOpenChange={(state) => {
                            if (!state) {
                                rowRef.current?.focus()
                            }
                            editModalState.onOpenChange(state)
                        }}
                        title="Edit Comaker Collateral"
                        description="Update Comaker Collateral."
                        formProps={{
                            defaultValues: field,
                            onSuccess: (updatedData) => {
                                onUpdate(index, { ...field, ...updatedData })
                            },
                        }}
                    />
                </>
            )
        }
    )
)

ComakerCollateralRow.displayName = 'ComakerCollateralRow'

export default LoanComakerSection
