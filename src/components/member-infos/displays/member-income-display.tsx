import { cn } from '@/lib'
import { formatNumber, toReadableDate } from '@/utils'

import { WalletIcon } from '@/components/icons'

import { IClassProps } from '@/types'
import { IMemberIncome } from '@/types'

import SectionTitle from '../section-title'

interface Props extends IClassProps {
    incomes?: IMemberIncome[]
}

const MemberIncomeDisplay = ({ incomes, className }: Props) => {
    return (
        <div className={cn('space-y-4', className)}>
            <SectionTitle
                Icon={WalletIcon}
                title="Income"
                subTitle="Different source of income of this member"
            />
            {(!incomes || incomes.length === 0) && (
                <p className="w-full text-center text-xs text-muted-foreground/70">
                    No income details found
                </p>
            )}
            {incomes &&
                incomes.map((income) => {
                    return (
                        <div
                            key={income.id}
                            className="boreder grid grid-cols-4 rounded-xl bg-popover/60 p-4"
                        >
                            <div className="space-y-2">
                                <p>{income.name ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Name
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>{formatNumber(income.amount) ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Amount
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>
                                    {toReadableDate(income.release_date) ?? '-'}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Date
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>
                                    {income.created_at
                                        ? toReadableDate(income.created_at)
                                        : '-'}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Updated At
                                </p>
                            </div>
                        </div>
                    )
                })}
        </div>
    )
}

export default MemberIncomeDisplay
