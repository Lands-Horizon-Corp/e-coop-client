import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { formatNumber } from '@/helpers/number-utils'
import { IMemberExpense } from '@/modules/member-expense'

import { HandCoinsIcon } from '@/components/icons'
import TextRenderer from '@/components/text-renderer'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'

import { IClassProps } from '@/types'

import SectionTitle from '../section-title'

interface Props extends IClassProps {
    expenses?: IMemberExpense[]
}

const MemberExpensesDisplay = ({ expenses, className }: Props) => {
    return (
        <div className={cn('space-y-4', className)}>
            <SectionTitle
                Icon={HandCoinsIcon}
                subTitle="Different expenses"
                title="Expenses"
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
                            className="boreder grid grid-cols-4 rounded-xl bg-popover/60 p-4"
                            key={expense.id}
                        >
                            <div className="space-y-2">
                                <p>{expense.name ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Name
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p>{formatNumber(expense.amount) || '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Amount
                                </p>
                            </div>
                            {/* <div className="space-y-2">
                                <p>{toReadableDate(expense.created_at) ?? '-'}</p>
                                <p className="text-xs text-muted-foreground/70">
                                    Date
                                </p>
                            </div> */}
                            <div className="space-y-2">
                                <p>
                                    {expense.created_at
                                        ? toReadableDate(expense.created_at)
                                        : '-'}
                                </p>
                                <p className="text-xs text-muted-foreground/70">
                                    Updated At
                                </p>
                            </div>
                            <Accordion
                                className="col-span-4 w-full"
                                collapsible
                                type="single"
                            >
                                <AccordionItem
                                    className="border-b-0"
                                    value="item-1"
                                >
                                    <AccordionTrigger className="text-sm text-muted-foreground/60">
                                        Description..
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-4 rounded-xl bg-popover p-4">
                                        <TextRenderer
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
