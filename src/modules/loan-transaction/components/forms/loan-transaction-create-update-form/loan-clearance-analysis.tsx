import { KeyboardEvent, forwardRef, memo, useRef } from 'react'

import { Path, UseFormReturn, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import { formatNumber } from '@/helpers'
import { ILoanClearanceAnalysisRequest } from '@/modules/loan-clearance-analysis'
import { ILoanClearanceAnalysisInstitutionRequest } from '@/modules/loan-clearance-analysis-institution'
import { LoanClearanceAnalysisInstitutionCreateUpdateModal } from '@/modules/loan-clearance-analysis-institution/components/form/loan-clearance-analysis-institution'
import { LoanClearanceAnalysisCreateUpdateModal } from '@/modules/loan-clearance-analysis/components/form/loan-clearance-analysis-create-update-form'

import { PencilFillIcon, PlusIcon, TrashIcon } from '@/components/icons'
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
import { useSimpleShortcut } from '@/hooks/use-simple-shortcut'

import { TEntityId } from '@/types'

import { TLoanTransactionSchema } from '../../../loan-transaction.validation'

// Tab content section for clearance analysis
const LoanClearanceAnalysis = forwardRef<
    HTMLDivElement,
    {
        form: UseFormReturn<TLoanTransactionSchema>
        isDisabled: (fieldName: Path<TLoanTransactionSchema>) => boolean
    }
>(({ form, isDisabled }, ref) => {
    return (
        <div ref={ref} className="space-y-4">
            <LoanClearanceAnalysisField form={form} isDisabled={isDisabled} />
            <div className="grid grid-cols-2 gap-x-2">
                <div className="space-y-2">
                    <FormFieldWrapper
                        control={form.control}
                        name="mount_to_be_closed"
                        label="Amount to be closed "
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Amount"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="share_capital"
                        label="Share Capital"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Share capital amount"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />{' '}
                    <FormFieldWrapper
                        control={form.control}
                        name="damayan_fund"
                        label="Damayan Fund"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Amount"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                </div>
                <div className="space-y-2">
                    <LoanClearanceInstitutionField
                        form={form}
                        isDisabled={isDisabled}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="length_of_service"
                        label="Length of Service"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Amount"
                                disabled={isDisabled(field.name)}
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
    isDisabled,
}: {
    form: UseFormReturn<TLoanTransactionSchema>
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

    useSimpleShortcut(['Shift', 'N'], () => {
        addLoanClearanceAnalysisModal?.onOpenChange(true)
    })

    const disabled = isDisabled('loan_clearance_analysis')

    const handleRemoveAnalysis = (index: number, id?: TEntityId) => {
        remove(index)
        if (id) addDeletedClearanceAnalysis(id)
        toast.success('Analysis removed')
    }

    const handleUpdateAnalysis = (
        index: number,
        updatedData: ILoanClearanceAnalysisRequest
    ) => {
        update(index, updatedData)
        toast.success('Analysis updated')
    }

    return (
        <>
            <LoanClearanceAnalysisCreateUpdateModal
                {...addLoanClearanceAnalysisModal}
                formProps={{
                    onSuccess: (analysis) => {
                        append(analysis)
                        toast.success('Analysis added')
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
                                    size="sm"
                                    type="button"
                                    tabIndex={0}
                                    className="size-fit px-2 py-0.5 text-xs"
                                    onClick={() =>
                                        addLoanClearanceAnalysisModal.onOpenChange(
                                            true
                                        )
                                    }
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
                            {...field}
                            wrapperClassName="max-h-[50vh] min-h-32 bg-secondary rounded-xl ecoop-scroll"
                            className="border-separate rounded-xl border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none"
                        >
                            <TableHeader className="sticky top-0 z-10 backdrop-blur-xs">
                                <TableRow className="*:border-border [&>:not(:last-child)]:border-r">
                                    <TableHead
                                        colSpan={2}
                                        className="text-center font-bold"
                                    >
                                        Regular Deductions
                                    </TableHead>
                                    <TableHead
                                        colSpan={3}
                                        className="text-center font-bold"
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
                                        key={field.fieldKey}
                                        field={field}
                                        index={index}
                                        ref={(el) => {
                                            rowRefs.current[index] = el
                                        }}
                                        onRemove={handleRemoveAnalysis}
                                        onUpdate={handleUpdateAnalysis}
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
                        className="*:border-border focus:bg-background/20 focus:outline-0 [&>:not(:last-child)]:border-r"
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
                                        Edit analysis
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
                                        Remove analysis
                                    </span>
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>

                    <LoanClearanceAnalysisCreateUpdateModal
                        {...editModalState}
                        onOpenChange={(state) => {
                            if (!state) {
                                rowRef.current?.focus()
                            }
                            editModalState.onOpenChange(state)
                        }}
                        title="Edit Clearance Analysis"
                        description="Update the clearance analysis details."
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

LoanClearanceAnalysisRow.displayName = 'LoanClearanceAnalysisRow'

LoanClearanceAnalysis.displayName = 'LoanClearanceAnalysis'

// LOAN CLEARANCE ANALYSIS INSTITUTION
const LoanClearanceInstitutionField = ({
    form,
    isDisabled,
}: {
    form: UseFormReturn<TLoanTransactionSchema>
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

    useSimpleShortcut(['Shift', 'I'], () => {
        addLoanClearanceAnalysisInstitutionModal?.onOpenChange(true)
    })

    const handleRemoveInstitution = (index: number, id?: TEntityId) => {
        remove(index)
        if (id) addDeletedClearanceAnalysisInstitution(id)
        toast.success('Institution removed')
    }

    const handleUpdateInstitution = (
        index: number,
        updatedData: ILoanClearanceAnalysisInstitutionRequest
    ) => {
        update(index, updatedData)
        toast.success('Institution updated')
    }

    return (
        <>
            <LoanClearanceAnalysisInstitutionCreateUpdateModal
                {...addLoanClearanceAnalysisInstitutionModal}
                formProps={{
                    onSuccess: (institution) => {
                        append(institution)
                        toast.success('Institution added')
                    },
                }}
            />
            <FormFieldWrapper
                control={form.control}
                name="loan_clearance_analysis_institution"
                render={({ field }) => (
                    <fieldset
                        disabled={disabled}
                        className="max-w-full min-w-0"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-medium">Institution</p>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    type="button"
                                    tabIndex={0}
                                    className="size-fit px-2 py-0.5 text-xs"
                                    onClick={() =>
                                        addLoanClearanceAnalysisInstitutionModal.onOpenChange(
                                            true
                                        )
                                    }
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
                            {...field}
                            wrapperClassName="max-h-[50vh] max-w-full min-w-0 min-h-32 bg-secondary rounded-xl ecoop-scroll"
                            className="border-separate rounded-xl border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none"
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
                                            key={field.fieldKey}
                                            field={field}
                                            index={index}
                                            ref={(el) => {
                                                institutionRowRefs.current[
                                                    index
                                                ] = el
                                            }}
                                            onRemove={handleRemoveInstitution}
                                            onUpdate={handleUpdateInstitution}
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
                        className="*:border-border focus:bg-background/20 focus:outline-0 [&>:not(:last-child)]:border-r"
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

                    <LoanClearanceAnalysisInstitutionCreateUpdateModal
                        {...editModalState}
                        onOpenChange={(state) => {
                            if (!state) {
                                rowRef.current?.focus()
                            }
                            editModalState.onOpenChange(state)
                        }}
                        title="Edit Institution"
                        description="Update the institution details."
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

LoanClearanceAnalysisInstitutionRow.displayName =
    'LoanClearanceAnalysisInstitutionRow'

export default LoanClearanceAnalysis
