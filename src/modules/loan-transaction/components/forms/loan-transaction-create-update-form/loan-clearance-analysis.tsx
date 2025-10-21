import { KeyboardEvent, forwardRef, memo, useRef } from 'react'

import { Path, UseFormReturn, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import { formatNumber } from '@/helpers'
import { CurrencyInput } from '@/modules/currency'
import { ILoanClearanceAnalysisRequest } from '@/modules/loan-clearance-analysis'
import { ILoanClearanceAnalysisInstitutionRequest } from '@/modules/loan-clearance-analysis-institution'
import { LoanClearanceAnalysisInstitutionCreateUpdateModal } from '@/modules/loan-clearance-analysis-institution/components/form/loan-clearance-analysis-institution'
import { LoanClearanceAnalysisCreateUpdateModal } from '@/modules/loan-clearance-analysis/components/form/loan-clearance-analysis-create-update-form'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    CheckFillIcon,
    PencilFillIcon,
    PlusIcon,
    TrashIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { CommandShortcut } from '@/components/ui/command'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { TLoanTransactionSchema } from '../../../loan-transaction.validation'

// Tab content section for clearance analysis
const LoanClearanceAnalysis = forwardRef<
    HTMLDivElement,
    {
        form: UseFormReturn<TLoanTransactionSchema>
        isReadOnly?: boolean
        isDisabled: (fieldName: Path<TLoanTransactionSchema>) => boolean
    }
>(({ form, isReadOnly, isDisabled }, ref) => {
    return (
        <div className="space-y-4" ref={ref}>
            <LoanClearanceAnalysisField
                form={form}
                isDisabled={isDisabled}
                isReadOnly={isReadOnly}
            />
            <div className="grid grid-cols-2 gap-x-2">
                <div className="space-y-2">
                    <FormFieldWrapper
                        control={form.control}
                        label="Amount to be closed "
                        name="mount_to_be_closed"
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                disabled={isDisabled(field.name)}
                                onValueChange={(newValue = '') => {
                                    onChange(newValue)
                                }}
                                placeholder="Amount"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Share Capital"
                        name="share_capital"
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                disabled={isDisabled(field.name)}
                                onValueChange={(newValue = '') => {
                                    onChange(newValue)
                                }}
                                placeholder="Share capital amount"
                            />
                        )}
                    />{' '}
                    <FormFieldWrapper
                        control={form.control}
                        label="Damayan Fund"
                        name="damayan_fund"
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                disabled={isDisabled(field.name)}
                                onValueChange={(newValue = '') => {
                                    onChange(newValue)
                                }}
                                placeholder="Amount"
                            />
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <LoanClearanceInstitutionField
                        form={form}
                        isDisabled={isDisabled}
                        isReadOnly={isReadOnly}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Length of Service"
                        name="length_of_service"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder=""
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    )
})

// LOAN CLEARANCE ANALYSIS

const LoanClearanceAnalysisField = ({
    form,
    isReadOnly,
    isDisabled,
}: {
    form: UseFormReturn<TLoanTransactionSchema>
    isReadOnly?: boolean
    isDisabled: (fieldName: Path<TLoanTransactionSchema>) => boolean
}) => {
    const addLoanClearanceAnalysisModal = useModalState()
    const rowRefs = useRef<(HTMLTableRowElement | null)[]>([])

    const {
        fields: loanClearanceAnalysis,
        remove,
        update,
        append,
    } = useFieldArray({
        control: form.control,
        name: 'loan_clearance_analysis',
        keyName: 'fieldKey',
    })

    const { append: addDeletedClearanceAnalysis } = useFieldArray({
        control: form.control,
        name: 'loan_clearance_analysis_deleted',
        keyName: 'fieldKey',
    })

    useHotkeys(
        'shift+n',
        (e) => {
            e.stopPropagation()
            e.preventDefault()
            addLoanClearanceAnalysisModal?.onOpenChange(true)
        },
        { enabled: !isReadOnly }
    )

    const disabled = isDisabled('loan_clearance_analysis')

    const handleRemoveAnalysis = (index: number, id?: TEntityId) => {
        remove(index)
        if (id) addDeletedClearanceAnalysis(id)
        toast.warning(
            <span>
                <TrashIcon className="mr-1 text-destructive inline" /> Analysis
                Removed. Don&apos;t forget to save changes.
            </span>
        )
    }

    const handleUpdateAnalysis = (
        index: number,
        updatedData: ILoanClearanceAnalysisRequest
    ) => {
        update(index, updatedData)
        toast(
            <span>
                <CheckFillIcon className="mr-1 text-primary inline" /> Analysis
                Updated. Don&apos;t forget to save changes.
            </span>
        )
    }

    return (
        <>
            <LoanClearanceAnalysisCreateUpdateModal
                {...addLoanClearanceAnalysisModal}
                formProps={{
                    onSuccess: (analysis) => {
                        append(analysis)
                        toast(
                            <span>
                                <PlusIcon className="mr-1 text-primary inline" />{' '}
                                Analysis Added. Don&apos;t forget to save
                                changes.
                            </span>
                        )
                    },
                }}
            />
            <FormFieldWrapper
                control={form.control}
                name="loan_clearance_analysis"
                render={({ field }) => (
                    <fieldset disabled={disabled}>
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-medium">
                                Loan Clearance Analysis
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    className="size-fit px-2 py-0.5 text-xs"
                                    onClick={() =>
                                        addLoanClearanceAnalysisModal.onOpenChange(
                                            true
                                        )
                                    }
                                    size="sm"
                                    tabIndex={0}
                                    type="button"
                                >
                                    Add <PlusIcon className="inline" />
                                </Button>
                                <p className="text-xs p-1 px-2 bg-muted text-muted-foreground rounded-sm">
                                    or Press{' '}
                                    <CommandShortcut className="bg-accent p-0.5 px-1 text-primary rounded-sm mr-1">
                                        Shift + N
                                    </CommandShortcut>
                                </p>
                            </div>
                        </div>
                        <Table
                            className="border-separate rounded-xl border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none"
                            ref={field?.ref}
                            wrapperClassName="max-h-[50vh] min-h-32 bg-secondary rounded-xl ecoop-scroll"
                        >
                            <TableHeader className="sticky top-0 z-10 backdrop-blur-xs">
                                <TableRow className="*:border-border [&>:not(:last-child)]:border-r">
                                    <TableHead
                                        className="text-center font-bold"
                                        colSpan={2}
                                    >
                                        Regular Deductions
                                    </TableHead>
                                    <TableHead
                                        className="text-center font-bold"
                                        colSpan={3}
                                    >
                                        Balances
                                    </TableHead>
                                    <TableHead />
                                </TableRow>
                                <TableRow className="*:border-border [&>:not(:last-child)]:border-r">
                                    <TableHead className="p-2">
                                        Description
                                    </TableHead>
                                    <TableHead className="p-2">
                                        Amount
                                    </TableHead>
                                    <TableHead className="p-2">
                                        Description
                                    </TableHead>
                                    <TableHead className="p-2">
                                        Amount
                                    </TableHead>
                                    <TableHead className="text-right p-2">
                                        Cnt.
                                    </TableHead>
                                    <TableHead className="w-16" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loanClearanceAnalysis.map((field, index) => (
                                    <LoanClearanceAnalysisRow
                                        field={field}
                                        index={index}
                                        key={field.fieldKey}
                                        onRemove={handleRemoveAnalysis}
                                        onUpdate={handleUpdateAnalysis}
                                        ref={(el) => {
                                            rowRefs.current[index] = el
                                        }}
                                    />
                                ))}

                                {loanClearanceAnalysis.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <p className="py-16 text-center text-sm text-muted-foreground/80">
                                                No clearance analysis yet.
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

interface ILoanClearanceAnalysisRowProps {
    field: ILoanClearanceAnalysisRequest & { fieldKey: string }
    index: number
    onRemove: (index: number, id?: TEntityId) => void
    onUpdate: (
        index: number,
        updatedData: ILoanClearanceAnalysisRequest
    ) => void
}

const LoanClearanceAnalysisRow = memo(
    forwardRef<HTMLTableRowElement, ILoanClearanceAnalysisRowProps>(
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
                        className="*:border-border focus:bg-background/20 focus:outline-0 [&>:not(:last-child)]:border-r"
                        key={field.id}
                        onKeyDown={handleRowKeyDown}
                        ref={(el) => {
                            rowRef.current = el
                            if (typeof ref === 'function') {
                                ref(el)
                            } else if (ref) {
                                ref.current = el
                            }
                        }}
                        tabIndex={-1}
                    >
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-medium">
                                    {field.regular_deduction_description || '-'}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            {formatNumber(field.regular_deduction_amount || 0)}
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-medium">
                                    {field.balances_description || '-'}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            {formatNumber(field.balances_amount || 0)}
                        </TableCell>
                        <TableCell className="text-right">
                            {field.balances_count || 0}
                        </TableCell>
                        <TableCell>
                            <div className="flex justify-end gap-1">
                                <Button
                                    className="size-8 p-0"
                                    onClick={() =>
                                        editModalState.onOpenChange(true)
                                    }
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                >
                                    <PencilFillIcon className="size-4" />
                                    <span className="sr-only">
                                        Edit analysis
                                    </span>
                                </Button>
                                <Button
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                    onClick={() => onRemove(index, field.id)}
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    <span className="sr-only">
                                        Remove analysis
                                    </span>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>

                    <LoanClearanceAnalysisCreateUpdateModal
                        {...editModalState}
                        description="Update the clearance analysis details."
                        formProps={{
                            defaultValues: field,
                            onSuccess: (updatedData) => {
                                onUpdate(index, { ...field, ...updatedData })
                            },
                        }}
                        onOpenChange={(state) => {
                            if (!state) {
                                rowRef.current?.focus()
                            }
                            editModalState.onOpenChange(state)
                        }}
                        title="Edit Clearance Analysis"
                    />
                </>
            )
        }
    )
)

LoanClearanceAnalysisRow.displayName = 'LoanClearanceAnalysisRow'

LoanClearanceAnalysis.displayName = 'LoanClearanceAnalysis'

// LOAN CLEARANCE ANALYSIS INSTITUTION
const LoanClearanceInstitutionField = ({
    form,
    isReadOnly,
    isDisabled,
}: {
    form: UseFormReturn<TLoanTransactionSchema>
    isReadOnly?: boolean
    isDisabled: (fieldName: Path<TLoanTransactionSchema>) => boolean
}) => {
    const addLoanClearanceAnalysisInstitutionModal = useModalState()
    const institutionRowRefs = useRef<(HTMLTableRowElement | null)[]>([])

    const disabled = isDisabled('loan_clearance_analysis_institution')

    const {
        fields: loanClearanceAnalysisInstitution,
        remove,
        update,
        append,
    } = useFieldArray({
        control: form.control,
        name: 'loan_clearance_analysis_institution',
        keyName: 'fieldKey',
    })

    const { append: addDeletedClearanceAnalysisInstitution } = useFieldArray({
        control: form.control,
        name: 'loan_clearance_analysis_institution_deleted',
        keyName: 'fieldKey',
    })

    useHotkeys(
        'shift+i',
        (e) => {
            e.stopPropagation()
            e.preventDefault()
            addLoanClearanceAnalysisInstitutionModal?.onOpenChange(true)
        },
        { enabled: !isReadOnly }
    )

    const handleRemoveInstitution = (index: number, id?: TEntityId) => {
        remove(index)
        if (id) addDeletedClearanceAnalysisInstitution(id)
        toast.warning(
            <span>Institution Removed. Don&apos;t forget to save changes.</span>
        )
    }

    const handleUpdateInstitution = (
        index: number,
        updatedData: ILoanClearanceAnalysisInstitutionRequest
    ) => {
        update(index, updatedData)
        toast(
            <span>
                <CheckFillIcon className="mr-1 text-primary inline" />{' '}
                Institution Updated. Don&apos;t forget to save changes.
            </span>
        )
    }

    return (
        <>
            <LoanClearanceAnalysisInstitutionCreateUpdateModal
                {...addLoanClearanceAnalysisInstitutionModal}
                formProps={{
                    onSuccess: (institution) => {
                        append(institution)
                        toast(
                            <span>
                                <PlusIcon className="mr-1 text-primary inline" />{' '}
                                Institution Added. Don&apos;t forget to save
                                changes.
                            </span>
                        )
                    },
                }}
            />
            <FormFieldWrapper
                control={form.control}
                name="loan_clearance_analysis_institution"
                render={({ field }) => (
                    <fieldset
                        className="max-w-full min-w-0"
                        disabled={disabled}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-medium">Institution</p>
                            <div className="flex items-center gap-2">
                                <Button
                                    className="size-fit px-2 py-0.5 text-xs"
                                    onClick={() =>
                                        addLoanClearanceAnalysisInstitutionModal.onOpenChange(
                                            true
                                        )
                                    }
                                    size="sm"
                                    tabIndex={0}
                                    type="button"
                                >
                                    Add <PlusIcon className="inline" />
                                </Button>
                                <p className="text-xs p-1 px-2 bg-muted text-muted-foreground rounded-sm">
                                    or Press{' '}
                                    <CommandShortcut className="bg-accent p-0.5 px-1 text-primary rounded-sm mr-1">
                                        Shift + I
                                    </CommandShortcut>
                                </p>
                            </div>
                        </div>
                        <Table
                            className="border-separate rounded-xl border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none"
                            ref={field.ref}
                            wrapperClassName="max-h-[50vh] max-w-full min-w-0 min-h-32 bg-secondary rounded-xl ecoop-scroll"
                        >
                            <TableHeader className="sticky top-0 z-10 backdrop-blur-xs">
                                <TableRow className="*:border-border [&>:not(:last-child)]:border-r">
                                    <TableHead className="p-2">
                                        Institution Name
                                    </TableHead>
                                    <TableHead className="p-2">
                                        Description
                                    </TableHead>
                                    <TableHead className="w-16" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loanClearanceAnalysisInstitution.map(
                                    (field, index) => (
                                        <LoanClearanceAnalysisInstitutionRow
                                            field={field}
                                            index={index}
                                            key={field.fieldKey}
                                            onRemove={handleRemoveInstitution}
                                            onUpdate={handleUpdateInstitution}
                                            ref={(el) => {
                                                institutionRowRefs.current[
                                                    index
                                                ] = el
                                            }}
                                        />
                                    )
                                )}

                                {loanClearanceAnalysisInstitution.length ===
                                    0 && (
                                    <TableRow>
                                        <TableCell colSpan={3}>
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

interface ILoanClearanceAnalysisInstitutionRowProps {
    field: ILoanClearanceAnalysisInstitutionRequest & { fieldKey: string }
    index: number
    onRemove: (index: number, id?: TEntityId) => void
    onUpdate: (
        index: number,
        updatedData: ILoanClearanceAnalysisInstitutionRequest
    ) => void
}

const LoanClearanceAnalysisInstitutionRow = memo(
    forwardRef<HTMLTableRowElement, ILoanClearanceAnalysisInstitutionRowProps>(
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
                        className="*:border-border focus:bg-background/20 focus:outline-0 [&>:not(:last-child)]:border-r"
                        key={field.id}
                        onKeyDown={handleRowKeyDown}
                        ref={(el) => {
                            rowRef.current = el
                            if (typeof ref === 'function') {
                                ref(el)
                            } else if (ref) {
                                ref.current = el
                            }
                        }}
                        tabIndex={-1}
                    >
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-medium">
                                    {field.name || '-'}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground">
                                    {field.description || '-'}
                                </span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex justify-end gap-1">
                                <Button
                                    className="size-8 p-0"
                                    onClick={() =>
                                        editModalState.onOpenChange(true)
                                    }
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                >
                                    <PencilFillIcon className="size-4" />
                                    <span className="sr-only">
                                        Edit institution
                                    </span>
                                </Button>
                                <Button
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                    onClick={() => onRemove(index, field.id)}
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    <span className="sr-only">
                                        Remove institution
                                    </span>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>

                    <LoanClearanceAnalysisInstitutionCreateUpdateModal
                        {...editModalState}
                        description="Update the institution details."
                        formProps={{
                            defaultValues: field,
                            onSuccess: (updatedData) => {
                                onUpdate(index, { ...field, ...updatedData })
                            },
                        }}
                        onOpenChange={(state) => {
                            if (!state) {
                                rowRef.current?.focus()
                            }
                            editModalState.onOpenChange(state)
                        }}
                        title="Edit Institution"
                    />
                </>
            )
        }
    )
)

LoanClearanceAnalysisInstitutionRow.displayName =
    'LoanClearanceAnalysisInstitutionRow'

export default LoanClearanceAnalysis
