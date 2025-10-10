import { useMemo } from 'react'

import { cn } from '@/helpers/tw-utils'
import { TCashCheckVoucherStatus } from '@/modules/cash-check-voucher'
import { CheckCircle2Icon, PrinterIcon } from 'lucide-react'

import { BadgeCheckFillIcon, DraftIcon } from '@/components/icons'

import { CashCheckVoucherKanbanMain } from './cash-check-voucher-kanban-main'

type TCashCheckVoucherKanbanItem = {
    name: string
    value: TCashCheckVoucherStatus
    icon: React.ReactNode
}

const CashCheckVoucherKanban = ({ className }: { className?: string }) => {
    const CashCheckVoucherMenu: TCashCheckVoucherKanbanItem[] = useMemo(
        () => [
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
                icon: (
                    <BadgeCheckFillIcon className="mr-2 size-4 text-purple-500" />
                ),
            },
        ],
        []
    )

    return (
        <div
            className={cn(
                'w-full flex space-x-5 p-2 ecoop-scroll overflow-auto',
                className
            )}
        >
            {CashCheckVoucherMenu.map((item) => (
                <CashCheckVoucherKanbanMain
                    icon={item.icon}
                    key={item.value}
                    mode={item.value}
                />
            ))}
        </div>
    )
}

export default CashCheckVoucherKanban
