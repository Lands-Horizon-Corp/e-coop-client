import PageContainer from '@/components/containers/page-container'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

import Approval from '../approval'
import CashCheckVoucherKanban from '../kanbans/cash-check-voucher-kanban'
import JournalVoucherKanban from '../kanbans/journal-voucher-kanban'

const ApprovalPage = () => {
    return (
        <PageContainer className="h-[100vh]">
            <ResizablePanelGroup
                className="w-full rounded-lg "
                direction="vertical"
            >
                <ResizablePanel
                    className="!overflow-auto h-fit ecoop-scroll"
                    defaultSize={33}
                >
                    <Approval className="min-h-[91dvh] " />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    className="!h-fit flex p-5 space-x-5 !overflow-auto ecoop-scroll"
                    defaultSize={33}
                >
                    <JournalVoucherKanban />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    className="!h-fit flex p-5 space-x-5 !overflow-auto  ecoop-scroll"
                    defaultSize={33}
                >
                    <CashCheckVoucherKanban />
                </ResizablePanel>
            </ResizablePanelGroup>
        </PageContainer>
    )
}

export default ApprovalPage
