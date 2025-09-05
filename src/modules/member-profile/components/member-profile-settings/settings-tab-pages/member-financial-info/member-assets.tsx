import { useState } from 'react'

import { toast } from 'sonner'

import { toReadableDate } from '@/helpers/date-utils'
import { formatNumber } from '@/helpers/number-utils'
import {
    IMemberAsset,
    useDeleteMemberProfileAsset,
} from '@/modules/member-asset'
import { IMemberProfile } from '@/modules/member-profile'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    CalendarDotsIcon,
    MoneyIcon,
    PencilFillIcon,
    PlusIcon,
    TrashIcon,
    WoodSignsIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextRenderer from '@/components/text-renderer'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { MemberAssetCreateUpdateFormModal } from '../../../../../member-asset/components/forms/member-asset-create-update-form'
import EmptyListIndicator from '../empty-list-indicator'

const MemberAssetCard = ({ asset }: { asset: IMemberAsset }) => {
    const [edit, setEdit] = useState(false)
    const { onOpen } = useConfirmModalStore()

    const { mutate: deleteAsset, isPending: isDeleting } =
        useDeleteMemberProfileAsset({
            options: {
                onSuccess: () => toast.success('Deleted'),
                onError: () => toast.error('Failed to delete'),
            },
        })

    return (
        <div className="flex flex-col gap-y-1 rounded-xl border bg-background p-4">
            <MemberAssetCreateUpdateFormModal
                open={edit}
                onOpenChange={setEdit}
                title="Update Asset"
                description="Modify / Update this asset information."
                formProps={{
                    assetId: asset.id,
                    memberProfileId: asset.member_profile_id,
                    defaultValues: asset,
                }}
            />
            <div className="flex justify-between">
                <p className="font-bold">{asset.name}</p>
                <div className="flex items-center justify-end">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                        disabled={isDeleting}
                        onClick={() => setEdit(true)}
                    >
                        <PencilFillIcon className="size-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        disabled={isDeleting}
                        hoverVariant="destructive"
                        onClick={() =>
                            onOpen({
                                title: 'Delete Asset',
                                description:
                                    'Are you sure to delete this asset?',
                                onConfirm: () =>
                                    deleteAsset({
                                        memberProfileId:
                                            asset.member_profile_id,
                                        assetId: asset.id,
                                    }),
                            })
                        }
                        className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                    >
                        {isDeleting ? (
                            <LoadingSpinner />
                        ) : (
                            <TrashIcon className="size-4" />
                        )}
                    </Button>
                </div>
            </div>
            <Separator className="!my-2" />
            <PreviewMediaWrapper media={asset.media}>
                <ImageDisplay
                    className="mb-4 h-[150px] w-full rounded-lg"
                    src={asset.media?.download_url}
                />
            </PreviewMediaWrapper>
            <div className="space-y-2 text-sm">
                <div>
                    <MoneyIcon className="mr-2 inline size-5 text-muted-foreground/70" />
                    <span className="font-semibold text-muted-foreground/70">
                        Cost:{' '}
                    </span>
                    {formatNumber(asset.cost)}
                </div>
                <div>
                    <CalendarDotsIcon className="mr-2 inline size-5 text-muted-foreground/70" />
                    <span className="font-semibold text-muted-foreground/70">
                        Entry Date:
                    </span>{' '}
                    {toReadableDate(asset.entry_date)}
                </div>
                <div className="!mt-5 space-y-2">
                    <p className="text-muted-foreground/70">Description</p>
                    {asset?.description ? (
                        <TextRenderer
                            content={asset.description ?? 'no description'}
                        />
                    ) : (
                        <p className="text-sm italic text-muted-foreground/60">
                            No Description{' '}
                            <WoodSignsIcon className="ml-1 inline" />
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

interface Props {
    memberProfile: IMemberProfile
}

const MemberAssets = ({ memberProfile }: Props) => {
    const [create, setCreate] = useState(false)

    return (
        <div>
            <MemberAssetCreateUpdateFormModal
                open={create}
                onOpenChange={setCreate}
                title="Create Asset"
                description="Add new asset information."
                formProps={{
                    memberProfileId: memberProfile.id,
                    defaultValues: {
                        branch_id: memberProfile.branch_id,
                        member_profile_id: memberProfile.id,
                    },
                }}
            />
            <div className="mb-2 flex items-start justify-between">
                <p>Assets</p>
                <Button size="sm" onClick={() => setCreate(true)}>
                    Add Asset <PlusIcon className="ml-1" />
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {memberProfile.member_assets?.map((asset) => (
                    <MemberAssetCard key={asset.id} asset={asset} />
                ))}
                {(!memberProfile.member_assets ||
                    memberProfile.member_assets?.length === 0) && (
                    <EmptyListIndicator
                        message="No assets yet"
                        className="col-span-3"
                    />
                )}
            </div>
        </div>
    )
}

export default MemberAssets
