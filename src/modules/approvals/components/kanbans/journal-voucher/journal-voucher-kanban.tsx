import { cn } from '@/helpers/tw-utils'
import { IJournalVoucher, TJournalVoucherMode } from '@/modules/journal-voucher'
import { CheckCircle2Icon, PrinterIcon } from 'lucide-react'

import { BadgeCheckFillIcon, DraftIcon } from '@/components/icons'

import { IClassProps } from '@/types'

import { JournalVoucherKanbanMain } from './journal-voucher-kanban-main'

export interface IJournalVoucherStatusDates {
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
}

export interface IJournalVoucherCardProps extends IClassProps {
    journalVoucher: IJournalVoucher
    refetch: () => void
}

export type TJournalVoucherKanbanItem = {
    name: string
    value: TJournalVoucherMode
    icon: React.ReactNode
}
const JournalVoucherMenu: TJournalVoucherKanbanItem[] = [
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
        value: 'release-today',
        icon: <BadgeCheckFillIcon className="mr-2 size-4 text-purple-500" />,
    },
]
const JournalVoucherKanban = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                'w-full flex space-x-5 p-2 ecoop-scroll overflow-auto',
                className
            )}
        >
            {JournalVoucherMenu.map((item) => (
                <JournalVoucherKanbanMain
                    icon={item.icon}
                    key={item.value}
                    mode={item.value}
                />
            ))}
        </div>
    )
}
export default JournalVoucherKanban
