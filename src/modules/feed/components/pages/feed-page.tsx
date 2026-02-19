import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import FeedCreatePostHeader from '../feed-create-post-header'
import Feeds from '../feeds'

const FeedPage = () => {
    return (
        <PageContainer className="bg-muted dark:bg-background">
            <PermissionGuard action="Read" resourceType="Feed">
                <div className="max-w-xl w-full mx-auto pt-8 pb-0">
                    <FeedCreatePostHeader />
                    <Feeds />
                </div>
            </PermissionGuard>
        </PageContainer>
    )
}

export default FeedPage
