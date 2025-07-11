import CopyWrapper from '@/components/elements/copy-wrapper'
import ImageDisplay from '@/components/image-display'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IUserBase } from '@/types'

type Props = {
    user: IUserBase
}

const UserAccountCardMini = ({ user }: Props) => {
    return (
        <div className="flex max-w-md items-center gap-x-4 rounded-2xl border-2 bg-background p-1">
            <PreviewMediaWrapper media={user.media}>
                <ImageDisplay
                    src={user.media?.download_url}
                    fallback={user.user_name?.charAt(0) ?? '-'}
                    className="size-20 rounded-xl"
                />
            </PreviewMediaWrapper>
            <div className="flex-1 space-y-1 pr-4">
                <p className="inline-flex w-full items-center justify-between font-medium">
                    <span>{user.full_name}</span>
                    <span className="ml-1 text-xs font-normal text-primary">
                        @{user.user_name}
                    </span>
                </p>
                <p className="text-xs text-muted-foreground">
                    <CopyWrapper>{user.email}</CopyWrapper>
                </p>
                <p className="!mt-2 text-xs text-muted-foreground/40">
                    <CopyWrapper>{user.id}</CopyWrapper>
                </p>
            </div>
        </div>
    )
}

export default UserAccountCardMini
