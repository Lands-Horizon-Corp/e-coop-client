import { cn } from '@/helpers/tw-utils'
import { TCashCheckVoucherMode } from '@/modules/cash-check-voucher'
import { CheckCircle2Icon, PrinterIcon } from 'lucide-react'

import { BadgeCheckFillIcon, DraftIcon } from '@/components/icons'

import { CashCheckVoucherKanbanMain } from './cash-check-voucher-kanban-main'

type TCashCheckVoucherKanbanItem = {
    name: string
    value: TCashCheckVoucherMode
    icon: React.ReactNode
}
const CashCheckVoucherMenu: TCashCheckVoucherKanbanItem[] = [
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

const CashCheckVoucherKanban = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                'w-full flex space-x-5 p-2 ecoop-scroll overflow-auto',
                className
            )}
        >
            {CashCheckVoucherMenu.map((item) => {
                return (
                    <CashCheckVoucherKanbanMain
                        icon={item.icon}
                        key={item.value}
                        mode={item.value}
                    />
                )
            })}
        </div>
    )
}

export default CashCheckVoucherKanban
