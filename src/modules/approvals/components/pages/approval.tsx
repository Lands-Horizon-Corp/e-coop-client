import { TJournalVoucherMode } from '@/modules/journal-voucher'

import PageContainer from '@/components/containers/page-container'

import Approval from '../approval'
import JournalVoucherKanban from '../kanbans/journal-voucher'

const ApprovalPage = () => {
    return (
<<<<<<< Updated upstream
        <PageContainer className="">
            <Approval className="min-h-[91dvh]" />
=======
        <PageContainer className="h-[100vh]">
            <ResizablePanelGroup
                direction="vertical"
                className="w-full rounded-lg "
            >
                <ResizablePanel
                    defaultSize={33}
                    className="!overflow-auto h-fit"
                >
                    <Approval className="min-h-[91dvh] " />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={33} className=" h-fit p-5">
                    <div className="flex flex-row space-x-10 overflow-auto  min-h-[91dvh]">
                        {['draft', 'printed', 'approved', 'released'].map(
                            (mode) => (
                                <div key={mode} className="mb-8">
                                    <JournalVoucherKanban
                                        mode={mode as TJournalVoucherMode}
                                    />
                                </div>
                            )
                        )}
                    </div>
                </ResizablePanel>
                {/* <ResizableHandle withHandle /> */}
                {/* <ResizablePanel
                    defaultSize={33}
                    className=" h-fit "
                ></ResizablePanel> */}
            </ResizablePanelGroup>
>>>>>>> Stashed changes
        </PageContainer>
    )
}

export default ApprovalPage
