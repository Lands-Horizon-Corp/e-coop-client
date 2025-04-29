import {
    Accordion,
    AccordionItem,
    AccordionContent,
    AccordionTrigger,
} from '@/components/ui/accordion'
import SectionTitle from '../section-title'
import RawDescription from './raw-description'
import { HandCoinsIcon } from '@/components/icons'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { IMemberExpenses } from '@/types'
import { formatNumber, toReadableDate } from '@/utils'

interface Props extends IClassProps {
    expenses?: IMemberExpenses[]
}

const MemberExpensesDisplay = ({ expenses, className }: Props) => {
    return (
        <div className={cn('space-y-4', className)}>
            <SectionTitle
                title="Expenses"
                Icon={HandCoinsIcon}
                subTitle="Different expenses"
            />
            {(!expenses || expenses.length === 0) && (
                <p className="w-full text-center text-xs text-muted-foreground/70">
                    No income details found
                </p>
            )}
            {expenses &&
                expenses.map((expense) => {
                    return (
                        <div
                            key={expense.id}
                            className="boreder grid grid-cols-4 rounded-xl bg-popover/60 p-4"
                        >
                            <div className="space-y-2">
                                <p>{expense.name ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Name
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>{formatNumber(expense.amount) ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Amount
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>{toReadableDate(expense.date) ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Date
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>
                                    {expense.updatedAt
                                        ? toReadableDate(expense.updatedAt)
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
                                            content={expense.description}
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

export default MemberExpensesDisplay
