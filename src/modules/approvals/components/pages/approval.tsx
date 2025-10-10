import PageContainer from '@/components/containers/page-container'
import {
    BadgeCheckFillIcon,
    BookOpenIcon,
    MoneyCheck2Icon,
} from '@/components/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import Approval from '../approval'
import CashCheckVoucherKanban from '../kanbans/cash-check-voucher-kanban'
import JournalVoucherKanban from '../kanbans/journal-voucher-kanban'

type journalMenuTriggerType = {
    name: string
    value: string
    icon?: React.ReactNode
}[]

type journalVoucherItemType = {
    value: string
    content: React.ReactNode
}[]

const ApprovalPage = () => {
    const journalMenuTrigger: journalMenuTriggerType = [
        {
            name: 'Approvals Dashboard',
            value: 'approvals',
            icon: (
                <BadgeCheckFillIcon className="size-4 text-muted-foreground" />
            ),
        },
        {
            name: 'Journal Vouchers',
            value: 'journalVouchers',
            icon: <BookOpenIcon className="size-4 text-muted-foreground" />,
        },
        {
            name: 'Cash Vouchers',
            value: 'cashVouchers',
            icon: <MoneyCheck2Icon className="size-4 text-muted-foreground" />,
        },
    ]
    const journalVoucherItem: journalVoucherItemType = [
        {
            value: 'approvals',
            content: <Approval className="min-h-[90dvh]" />,
        },
        {
            value: 'journalVouchers',
            content: <JournalVoucherKanban className="min-h-[91dvh]" />,
        },
        {
            value: 'cashVouchers',
            content: <CashCheckVoucherKanban className="min-h-[91dvh]" />,
        },
    ]

    return (
        <PageContainer className="h-[100vh] lg:h-[90vh] flex overflow-auto flex-col">
            <Tabs
                className="w-full h-full flex flex-col"
                defaultValue="approvals"
            >
                <TabsList className="mb-3 sticky top-[0%] z-50 backdrop-blur-2xl backdrop h-auto min-w-fit justify-start gap-2 rounded-none border-b bg-background/50 px-0 py-1 text-foreground">
                    {journalMenuTrigger.map((item) => (
                        <TabsTrigger
                            className="relative flex items-center gap-x-2 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                            key={item.value}
                            value={item.value}
                        >
                            {item.icon}
                            {item.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <div className="flex-1">
                    {journalVoucherItem.map((item) => (
                        <TabsContent key={item.value} value={item.value}>
                            {item.content}
                        </TabsContent>
                    ))}
                </div>
            </Tabs>
        </PageContainer>
    )
}

export default ApprovalPage
