import { toast } from 'sonner'

import { formatNumber } from '@/helpers'
import { cn } from '@/helpers'
import AmortizationTable from '@/modules/amortization/components/amortization-table'
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
    IComputationSheetCalculator,
    IComputationSheetCalculatorDeduction,
    useCalculateSchemeAmortization,
} from '..'
import { TMockCloanInputSchema } from '../../calculator'

interface ComputationSheetCalculatorProps extends IClassProps {
    computationSheetId?: TEntityId
    defaultResult?: IComputationSheetCalculator
    defaultInput?: Partial<TMockCloanInputSchema>
    onSubmitData?: (data: TMockCloanInputSchema) => void
    onCalculatorResult?: (data: IComputationSheetCalculator) => void
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
            <div className="grid grid-cols-2 gap-4">
                <MockLoanInputForm
                    autoSubmit
                    loading={isPending}
                    onSubmit={handleCompute}
                    initialData={defaultInput}
                    className="max-h-[60vh] overflow-y-auto ecoop-scroll"
                />
                <div className="space-y-2">
                    <p>Deductions</p>
                    <DeductionTable
                        deductionEntries={
                            schemeCalculatorResponse?.entries || []
                        }
                    />
                </div>
            </div>
            <div className="bg-popover p-4 space-y-2 rounded-xl">
                <p>Amortization</p>
                <AmortizationTable
                    amortizationSummary={
                        schemeCalculatorResponse?.amortization
                            .amortization_summary
                    }
                    amortizationPayments={
                        schemeCalculatorResponse?.amortization.amortizations ||
                        []
                    }
                />
            </div>
        </div>
    )
}

const DeductionTable = ({
    deductionEntries,
}: {
    deductionEntries: IComputationSheetCalculatorDeduction[]
}) => {
    const totalDebit = deductionEntries.reduce(
        (acc, entry) => acc + (entry.debit || 0),
        0
    )
    const totalCredit = deductionEntries.reduce(
        (acc, entry) => acc + (entry.credit || 0),
        0
    )
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
                        tabIndex={0}
                        key={index}
                        className="focus:bg-background/20"
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
                        {formatNumber(totalDebit)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                        {formatNumber(totalCredit)}
                    </TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    )
}

export default ComputationSheetCalculator
