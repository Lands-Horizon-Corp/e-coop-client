import { cn } from '@/helpers/tw-utils'
import { ILoanTransaction, TLoanStatusType } from '@/modules/loan-transaction'
import { CheckCircle2Icon, PrinterIcon } from 'lucide-react'

import { BadgeCheckFillIcon, DraftIcon } from '@/components/icons'

import { IClassProps } from '@/types'

import { LoanKanbanMain } from './loan-kanban-main'

export interface ILoanStatusDates {
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
}

export interface ILoanCardProps extends IClassProps {
    loan: ILoanTransaction
    refetch: () => void
}

export type TLoanKanbanItem = {
    name: string
    value: TLoanStatusType
    icon: React.ReactNode
}
const LoanKanbanMenu: TLoanKanbanItem[] = [
    {
        name: 'Draft',
        value: 'draft',
        icon: <DraftIcon className="mr-2 size-4 text-primary" />,
    },
    {
        name: 'Printed',
        value: 'printed',
        icon: <PrinterIcon className="mr-2 size-4 text-blue-500" />,
    },
    {
        name: 'Approved',
        value: 'approved',
        icon: (
            <CheckCircle2Icon className="mr-2 size-4 text-success-foreground" />
        ),
    },
    {
        name: 'Released',
        value: 'released',
        icon: <BadgeCheckFillIcon className="mr-2 size-4 text-purple-500" />,
    },
]

const LoanKanban = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                'w-full flex space-x-5 p-2 ecoop-scroll overflow-auto',
                className
            )}
        >
            {LoanKanbanMenu.map((item) => (
                <LoanKanbanMain
                    icon={item.icon}
                    key={item.value}
                    mode={item.value}
                />
            ))}
        </div>
    )
}
export default LoanKanban
