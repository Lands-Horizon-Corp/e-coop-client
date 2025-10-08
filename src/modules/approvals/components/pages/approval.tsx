import PageContainer from '@/components/containers/page-container'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

import Approval from '../approval'

const ApprovalPage = () => {
    return (
        <PageContainer className="h-[100vh]">
            <ResizablePanelGroup
                className="w-full rounded-lg "
                direction="vertical"
            >
                <ResizablePanel
                    className="!overflow-auto h-fit"
                    defaultSize={50}
                >
                    <Approval className="min-h-[91dvh] " />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className=" h-fit " defaultSize={50}>
                    <div className="flex h-full items-center justify-center p-6">
                        <span className="font-semibold">Content</span>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </PageContainer>
    )
}

export default ApprovalPage
