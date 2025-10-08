import { TJournalVoucherMode } from '@/modules/journal-voucher'

import PageContainer from '@/components/containers/page-container'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

import Approval from '../approval'
import JournalVoucherKanban from '../kanbans/journal-voucher-kanban'

const ApprovalPage = () => {
    return (
        <PageContainer className="h-[100vh]">
            <ResizablePanelGroup
                className="w-full rounded-lg "
                direction="vertical"
            >
                <ResizablePanel
                    defaultSize={33}
                    className="!overflow-auto h-fit"
                >
                    <Approval className="min-h-[91dvh] " />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    defaultSize={33}
                    className=" h-fit flex p-5 space-x-5 !overflow-auto "
                >
                    {['draft', 'printed', 'approved', 'released'].map(
                        (status) => (
                            <JournalVoucherKanban
                                key={status}
                                mode={status as TJournalVoucherMode}
                            />
                        )
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </PageContainer>
    )
}

export default ApprovalPage
