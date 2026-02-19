import { useAuthStore } from '@/modules/authentication/authgentication.store'

import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'

import { CreateFeedPostFormModal } from './forms/create-update-feed-post-form'

const FeedCreatePostHeader = () => {
    const createModalState = useModalState()

    const {
        currentAuth: { user },
    } = useAuthStore()

    return (
        <>
            <div className="transition-shadow bg-card rounded-xl duration-200 w-full">
                <p className="p-4">Post something</p>
                <Separator />
                <div className="flex items-center gap-3 p-4">
                    <ImageDisplay src={user?.media?.download_url} />
                    <Button
                        className="prompt-input flex-1 justify-start rounded-full border border-border/70 px-4 py-2.5 text-left text-sm text-muted-foreground hover:border-primary/30 transition-all duration-150 h-auto"
                        onClick={() => createModalState.onOpenChange(true)}
                        variant="ghost"
                    >
                        What's on your mind,{' '}
                        {(user?.full_name || 'User').split(' ')[0]}?
                    </Button>
                </div>
            </div>

            <CreateFeedPostFormModal {...createModalState} />
        </>
    )
}

export default FeedCreatePostHeader
