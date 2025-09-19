import { orgBannerList } from '@/assets/pre-organization-banner-background'
import { IBranch } from '@/modules/branch'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import ImageDisplay from '@/components/image-display'
import MapPicker from '@/components/map/map-picker/map-picker'
import { Button } from '@/components/ui/button'
import { PlainTextEditor } from '@/components/ui/text-editor'

type BranchProps = {
    branch: IBranch
    isUserCanJoin: boolean
    onJoinClick: (branch: IBranch) => void
}

export const BranchItem = ({
    branch,
    isUserCanJoin,
    onJoinClick,
}: BranchProps) => {
    const mediaUrl = branch?.media?.url ?? orgBannerList[0]

    return (
        <div className="flex max-h-96 flex-col gap-y-2 overflow-y-auto">
            <GradientBackground gradientOnly>
                <div
                    key={branch.id}
                    className="relative flex min-h-16 w-full cursor-pointer items-center gap-x-2 rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline"
                >
                    <ImageDisplay
                        className="size-10 rounded-xl"
                        src={mediaUrl}
                    />
                    <div className="flex grow flex-col">
                        <h1>{branch?.name}</h1>
                        <PlainTextEditor
                            className="text-xs"
                            content={branch.description ?? ''}
                        />
                        {branch.latitude && branch.longitude && (
                            <div className="mt-2">
                                <MapPicker
                                    value={{
                                        lat: branch.latitude,
                                        lng: branch.longitude,
                                    }}
                                    onChange={() => {}}
                                    variant="outline"
                                    size="sm"
                                    placeholder="View Branch Location"
                                    title={`${branch.name} Location`}
                                    hideButtonCoordinates={true}
                                    disabled={false}
                                    viewOnly={true}
                                    className="text-xs"
                                />
                            </div>
                        )}
                    </div>
                    <Button
                        disabled={!isUserCanJoin}
                        onClick={() => onJoinClick(branch)}
                        size={'sm'}
                        variant={'secondary'}
                    >
                        {isUserCanJoin ? 'Join' : 'Joined'}
                    </Button>
                </div>
            </GradientBackground>
        </div>
    )
}

export default BranchItem
