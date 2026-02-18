import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import FeedCreatePostHeader from '../feed-create-post-header'
import Feeds from '../feeds'

const FeedPage = () => {
    // const parentRef = useRef(null)
    return (
        <PageContainer
        // className="!max-h-[94vh] overflow-y-scroll grid"
        // ref={parentRef}
        >
            <PermissionGuard action="Read" resourceType="Feed">
                <div className="max-w-xl w-full mx-auto pt-8 pb-16">
                    <FeedCreatePostHeader />
                    <Feeds />
                </div>
            </PermissionGuard>
        </PageContainer>
    )
}

export default FeedPage
