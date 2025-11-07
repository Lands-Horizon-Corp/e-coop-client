import { toast } from 'sonner'

import { formatNumber } from '@/helpers'
import { cn } from '@/helpers'
import MockLoanInputForm from '@/modules/calculator/components/forms/mock-loan-input-form'

import { RenderIcon, TIcon } from '@/components/icons'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { IClassProps, TEntityId } from '@/types'

import {
    IComputationSheetAmortizationResponse,
    IComputationSheetAmortizationResponseDeduction,
    useCalculateSchemeAmortization,
} from '..'
import { TMockCloanInputSchema } from '../../calculator'

interface ComputationSheetCalculatorProps extends IClassProps {
    computationSheetId?: TEntityId
    defaultResult?: IComputationSheetAmortizationResponse
    defaultInput?: Partial<TMockCloanInputSchema>
    onSubmitData?: (data: TMockCloanInputSchema) => void
    onCalculatorResult?: (data: IComputationSheetAmortizationResponse) => void
}

const ComputationSheetCalculator = ({
    className,
    defaultInput,
    defaultResult,
    computationSheetId,
    onSubmitData,
    onCalculatorResult,
}: ComputationSheetCalculatorProps) => {
    const {
        data: schemeCalculatorResponse = defaultResult,
        mutateAsync,
        isPending,
    } = useCalculateSchemeAmortization({
        options: {
            onSuccess: onCalculatorResult,
        },
    })

    const handleCompute = async (data: TMockCloanInputSchema) => {
        onSubmitData?.(data)
        toast.promise(
            mutateAsync({ data, id: computationSheetId as TEntityId }),
            {
                loading: 'Computing amortization...',
                success: 'Amortization computed!',
                error: (err) => `Error: ${err.message}`,
            }
        )
    }

    return (
        <div
            className={cn(
                'grid max-h-full overflow-y-auto ecoop-scroll pb-4 gap-4 px-4 max-w-7xl',
                className
            )}
        >
            <div className="grid grid-cols-12 gap-4">
                <div className="space-y-2 col-span-7 bg-secondary dark:bg-transparent p-4 dark:p-0 rounded">
                    <p>Mock Loan Input</p>
                    <MockLoanInputForm
                        className="max-h-[60vh] overflow-y-auto ecoop-scroll"
                        initialData={defaultInput}
                        loading={isPending}
                        onSubmit={handleCompute}
                    />
                </div>
                <div className="space-y-2 col-span-5 rounded">
                    <p>Deductions</p>
                    <DeductionTable
                        deductionEntries={
                            schemeCalculatorResponse?.entries || []
                        }
                        totalCredit={
                            schemeCalculatorResponse?.total_credit || 0
                        }
                        totalDebit={schemeCalculatorResponse?.total_debit || 0}
                    />
                </div>
            </div>
            <div className="bg-popover p-4 space-y-2 rounded-xl">
                <p>Amortization</p>
                {/* <AmortizationTable
                    sce={
                        schemeCalculatorResponse?.schedule || []
                    }
                /> */}
            </div>
        </div>
    )
}

const DeductionTable = ({
    deductionEntries,
    totalCredit = 0,
    totalDebit = 0,
}: {
    deductionEntries: IComputationSheetAmortizationResponseDeduction[]
    totalCredit: number
    totalDebit: number
}) => {
    return (
        <Table
            tabIndex={0}
            wrapperClassName="max-h-[60vh] bg-secondary rounded-xl ecoop-scroll"
        >
            <TableHeader>
                <TableRow className="bg-secondary/40">
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {deductionEntries.map((entry, index) => (
                    <TableRow
                        className="focus:bg-background/20"
                        key={index}
                        tabIndex={0}
                    >
                        <TableCell className="py-2 h-fit">
                            <div className="flex flex-col">
                                <span className="font-medium flex gap-x-1 items-center">
                                    {entry.account?.icon && (
                                        <RenderIcon
                                            icon={entry.account.icon as TIcon}
                                        />
                                    )}
                                    {entry.account?.name ||
                                        entry.name ||
                                        'Unknown'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {entry.account?.description ||
                                        entry.description ||
                                        '...'}
                                </span>
                                <div className="flex gap-2 mt-1">
                                    {entry.type === 'add-on' && (
                                        <span className="text-xs text-green-600 font-medium">
                                            • Add-on Interest
                                        </span>
                                    )}
                                    {entry.type === 'deduction' && (
                                        <span className="text-xs text-orange-600 font-medium">
                                            • Deduction
                                        </span>
                                    )}
                                    {entry.type === 'deduction' &&
                                        entry.is_add_on && (
                                            <span className="text-xs text-green-600 font-medium">
                                                • Add-On
                                            </span>
                                        )}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right py-2 h-fit">
                            {entry.debit ? `${formatNumber(entry.debit)}` : ''}
                        </TableCell>
                        <TableCell className="text-right py-2 h-fit">
                            {entry.credit
                                ? `${formatNumber(entry.credit)}`
                                : ''}
                        </TableCell>
                    </TableRow>
                ))}
                {deductionEntries.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4}>
                            <p className="py-16 text-center text-sm text-muted-foreground/80">
                                No entries yet.
                            </p>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            <TableFooter className="sticky bottom-0">
                <TableRow className="bg-muted/50 text-xl">
                    <TableCell className="font-semibold" />
                    <TableCell className="text-right font-semibold">
                        {formatNumber(totalDebit, 2)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                        {formatNumber(totalCredit, 2)}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}

export default ComputationSheetCalculator
