import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
    IAccountingLedgerResource,
    TransactionSource,
} from '@/types/coop-types/accounts/accounting-ledger'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { CheckCircle } from 'lucide-react'
import StatusBadge, { BadgeColorMap } from '../status-badge'

type TransactionSourceBadgeProps = {
    source: TransactionSource
    className?: string
}

const transactionColorMap: BadgeColorMap<TransactionSource> = {
    withdrawal: 'bg-red-100 text-red-700',
    deposit: 'bg-blue-100 text-blue-700',
    payment: 'bg-green-100 text-green-700',
}

export const TransactionSourceBadge = ({
    source,
    className,
}: TransactionSourceBadgeProps) => (
    <StatusBadge<TransactionSource>
        text={source}
        colorMap={transactionColorMap}
        className={className}
    />
)

type LedgerCardProps = {
    ledger: IAccountingLedgerResource
}

const LedgerCard = ({ ledger }: LedgerCardProps) => (
    <Card className="flex flex-col gap-4 rounded-2xl p-6 text-gray-800 shadow-lg dark:text-white">
        <CardContent className="relative flex flex-col p-0">
            <div className="flex w-full justify-end">
                <TransactionSourceBadge source={ledger.transactionSource} />
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <h2 className="text-lg font-bold">{ledger.description}</h2>
                    <p className="text-xs text-gray-400">{ledger.notes}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ₱{' '}
                        {ledger.credit === 0
                            ? ledger.debit.toFixed(2)
                            : ledger.credit.toFixed(2)}
                    </p>
                </div>
            </div>
            <Accordion type="single" collapsible>
                <AccordionItem value="1">
                    <AccordionTrigger>
                        <p className="text-sm text-gray-500">
                            Transaction Details
                        </p>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4">
                            <DetailRow
                                label="Transaction Number"
                                value={ledger.orNumber}
                            />
                            <DetailRow
                                label="Status"
                                value={
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                        <CheckCircle size={16} /> Success
                                    </div>
                                }
                            />
                            <DetailRow
                                label="Transaction Date"
                                value={ledger.transactionDate.toLocaleString()}
                            />
                            <DetailRow
                                label="Recipient"
                                value={ledger.memberProfileId}
                            />
                            <DetailRow
                                label="Amount Sent"
                                value={`₱ ${ledger.debit.toFixed(2)}`}
                            />
                            <DetailRow
                                label="Completed On"
                                value={ledger.entryDate.toLocaleString()}
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
    </Card>
)

type DetailRowProps = {
    label: string
    value: React.ReactNode
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="font-medium">{value}</span>
    </div>
)

export default LedgerCard
