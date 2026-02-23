import { useState } from 'react'

import PermissionGuard from '@/modules/permission/components/permission-guard'
import { IUserBase } from '@/modules/user'

import PageContainer from '@/components/containers/page-container'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { IFeed } from '../../feed.types'
import FeedCreatePostHeader from '../feed-create-post-header'
import Feeds, { TFeedInfiniteFetchMode } from '../feeds'

const FeedPage = () => {
    const [tab, setTab] = useState<TFeedInfiniteFetchMode>('public')
    const [user, setUser] = useState<IUserBase | undefined>(undefined)

    const handleClickAuthor = (feed: IFeed) => {
        setTab('user')
        setUser(feed.created_by)
    }

    return (
        <PageContainer className="bg-muted min-h-screen dark:bg-background">
            <PermissionGuard action="Read" resourceType="Feed">
                <div className="max-w-xl w-full mx-auto pt-8 space-y-2 pb-0">
                    <Tabs
                        onValueChange={(val) => {
                            setUser(undefined)
                            setTab(val as unknown as TFeedInfiniteFetchMode)
                        }}
                        value={tab}
                    >
                        <TabsList>
                            <TabsTrigger value="public">
                                Public Feed
                            </TabsTrigger>
                            <TabsTrigger value="my">My Feed</TabsTrigger>
                            {user && (
                                <TabsTrigger disabled value="user">
                                    {user.first_name}'s Feed
                                </TabsTrigger>
                            )}
                        </TabsList>
                    </Tabs>
                    {tab !== 'user' && <FeedCreatePostHeader />}
                    <Feeds
                        mode={tab}
                        onClickFeedAuthor={handleClickAuthor}
                        userId={user?.id}
                    />
                </div>
            </PermissionGuard>
        </PageContainer>
    )
}

export default FeedPage
