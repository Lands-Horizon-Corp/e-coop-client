import { formatNumber } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { IClassProps } from '@/types'

import {
    IAmortizationPayment,
    IAmortizationSummary,
} from '../amortization.types'

const AmortizationTable = ({
    amortizationPayments,
    amortizationSummary,
}: {
    amortizationPayments: IAmortizationPayment[]
    amortizationSummary?: IAmortizationSummary
} & IClassProps) => {
    return (
        <Table
            wrapperClassName="ecoop-scroll max-w-full bg-background/40 px-4 rounded"
            className="table-fixed w-full"
        >
            <TableHeader className="bg-transparent sticky top-0">
                <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[130px]">Date</TableHead>
                    <TableHead className="text-right w-[120px]">
                        Principal
                    </TableHead>
                    <TableHead className="text-right w-[100px]">
                        Interest
                    </TableHead>
                    <TableHead className="text-right w-[120px]">
                        Service Fee
                    </TableHead>
                    <TableHead className="text-right w-[140px]">
                        Total Payment
                    </TableHead>
                    <TableHead className="text-right w-[140px]">
                        Balance
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
                {amortizationPayments?.map((payment, index) => (
                    <TableRow
                        key={index}
                        className="odd:bg-muted/80 odd:hover:bg-muted/50 border-none hover:bg-transparent"
                    >
                        <TableCell className="py-2.5">
                            {toReadableDate(payment.date, 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell className="py-2.5 text-right font-mono">
                            {formatNumber(payment.principal, 2)}
                        </TableCell>
                        <TableCell className="py-2.5 text-right text-orange-400 font-mono">
                            {formatNumber(payment.interest, 2)}
                        </TableCell>
                        <TableCell className="py-2.5 text-right font-mono">
                            {formatNumber(payment.service_fee, 2)}
                        </TableCell>
                        <TableCell className="py-2.5 text-right font-medium font-mono">
                            {formatNumber(payment.total, 2)}
                        </TableCell>
                        <TableCell className="py-2.5 text-right font-mono">
                            {formatNumber(payment.lr, 2)}
                        </TableCell>
                    </TableRow>
                ))}

                {(!amortizationPayments ||
                    amortizationPayments.length === 0) && (
                    <TableRow className="hover:bg-transparent">
                        <TableCell
                            colSpan={7}
                            className="py-8 text-center text-muted-foreground"
                        >
                            No amortization schedule available
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            {amortizationSummary && (
                <TableFooter className="bg-transparent">
                    <TableRow className="hover:bg-transparent">
                        <TableCell className="font-medium">
                            Total ({amortizationSummary.total_terms} terms)
                        </TableCell>
                        <TableCell className="text-right font-medium font-mono">
                            {formatNumber(
                                amortizationSummary.total_principal,
                                2
                            )}
                        </TableCell>
                        <TableCell className="text-right font-medium font-mono text-orange-400">
                            {formatNumber(
                                amortizationSummary.total_interest,
                                2
                            )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                            {formatNumber(
                                amortizationSummary.total_service_fee,
                                2
                            )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                            {formatNumber(amortizationSummary.total_amount, 2)}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            )}
        </Table>
    )
}

export default AmortizationTable
