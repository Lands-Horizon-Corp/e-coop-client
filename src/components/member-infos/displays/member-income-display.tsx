import SectionTitle from '../section-title'
import { WalletIcon } from '@/components/icons'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { IMemberIncomeResource } from '@/server'
import { formatNumber, toReadableDate } from '@/utils'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import RawDescription from './raw-description'

interface Props extends IClassProps {
    incomes?: IMemberIncomeResource[]
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
                                <p>{toReadableDate(income.date) ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Date
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>
                                    {income.updatedAt
                                        ? toReadableDate(income.updatedAt)
                                        : '-'}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Updated At
                                </p>
                            </div>
                            <Accordion
                                type="single"
                                collapsible
                                className="col-span-4 w-full"
                            >
                                <AccordionItem
                                    value="item-1"
                                    className="border-b-0"
                                >
                                    <AccordionTrigger className="text-sm text-muted-foreground/60">
                                        Description..
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-4 rounded-xl bg-popover p-4">
                                        <RawDescription
                                            content={income.description}
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    )
                })}
        </div>
    )
}

export default MemberIncomeDisplay
