import { TJournalVoucherMode } from '@/modules/journal-voucher'

import PageContainer from '@/components/containers/page-container'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

import Approval from '../approval'
import JournalVoucherKanban from '../kanbans/journal-voucher'

const ApprovalPage = () => {
    return (
        <PageContainer className="h-[100vh]">
            <ResizablePanelGroup
                direction="vertical"
                className="w-full rounded-lg "
            >
                <ResizablePanel
                    defaultSize={50}
                    className="!overflow-auto h-fit"
                >
                    <Approval className="min-h-[91dvh] " />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} className=" h-fit ">
                    <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">Content</span>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </PageContainer>
    )
}

export default ApprovalPage
