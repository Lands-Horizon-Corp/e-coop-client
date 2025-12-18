import { forwardRef } from 'react'
import { useMemo, useState } from 'react'

import Fuse from 'fuse.js'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import { MediaUploaderModal } from '@/modules/media/components/media-uploader'
import {
    useGetAllMemberProfileMediaByMemberProfile,
    useMemberProfileMediaBulk,
} from '@/modules/member-profile-media'

import {
    FolderFillIcon,
    GridIcon,
    ListUIIcon,
    MagnifyingGlassIcon,
    UploadIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'

import { useModalState } from '@/hooks/use-modal-state'

import { IBaseProps } from '@/types'
import { TEntityId } from '@/types'

import { IMemberProfile, useGetMemberProfileById } from '../..'
import { FileCard } from './file-card'
import { SectionCard } from './section-card'

interface Props extends IBaseProps {
    profileId: TEntityId
    defaultData?: IMemberProfile
}

const UploadTrigger = ({
    memberProfileId,
}: {
    memberProfileId?: TEntityId
}) => {
    const uploaderModal = useModalState()

    const { mutateAsync } = useMemberProfileMediaBulk({
        options: {
            onSuccess: () => {
                toast.success('Upload completed')
                uploaderModal.onOpenChange(false)
            },
        },
    })

    return (
        <>
            <MediaUploaderModal
                {...uploaderModal}
                uploaderProps={{
                    mode: 'multiple',
                    onMultipleUploadComplete: (files) =>
                        mutateAsync({
                            ids: files.map((f) => f.id),
                            memberProfileId: memberProfileId!,
                        }),
                }}
            />
            <Button onClick={() => uploaderModal.onOpenChange(true)} size="sm">
                <UploadIcon className="mr-2 size-4" />
                Upload
            </Button>
        </>
    )
}

const MemberFileMediaDisplay = ({
    memberProfileId,
}: {
    memberProfileId?: TEntityId
}) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const { data, isPending, isRefetching, refetch } =
        useGetAllMemberProfileMediaByMemberProfile({
            mode: 'member-profile',
            memberProfileId,
            options: { enabled: !!memberProfileId },
        })

    const fuse = useMemo(() => {
        if (!data) return null
        return new Fuse(data, {
            keys: ['name', 'media.file_name', 'description'],
            threshold: 0.3,
        })
    }, [data])

    const filteredData = useMemo(() => {
        if (!data) return []
        if (!searchQuery) return data
        return fuse ? fuse.search(searchQuery).map((r) => r.item) : data
    }, [data, searchQuery, fuse])

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            <span className="text-foreground font-medium">
                                Files :
                            </span>{' '}
                            {(data ?? []).length} files
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <UploadTrigger memberProfileId={memberProfileId} />
                    <Button
                        disabled={isRefetching}
                        onClick={() => refetch()}
                        size="sm"
                        variant="outline"
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search files..."
                        value={searchQuery}
                    />
                </div>
                <div className="flex rounded-lg border p-1">
                    <Button
                        onClick={() => setViewMode('grid')}
                        size="icon-sm"
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    >
                        <GridIcon className="size-4" />
                    </Button>
                    <Button
                        onClick={() => setViewMode('list')}
                        size="icon-sm"
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    >
                        <ListUIIcon className="size-4" />
                    </Button>
                </div>
            </div>

            {isPending ? (
                <LoadingSpinner className="mx-auto" />
            ) : filteredData.length === 0 ? (
                <Empty className="border border-dashed">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FolderFillIcon />
                        </EmptyMedia>
                        <EmptyTitle>
                            {searchQuery
                                ? 'No files found'
                                : 'No files uploaded'}
                        </EmptyTitle>
                        <EmptyDescription>
                            {searchQuery
                                ? 'Try adjusting your search'
                                : 'Upload files to get started'}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredData.map((item, i) => (
                        <FileCard
                            index={i}
                            key={item.id}
                            memberMedia={item}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredData.map((item, i) => (
                        <FileCard
                            index={i}
                            key={item.id}
                            memberMedia={item}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

const MemberMediasInfo = forwardRef<HTMLDivElement, Props>(
    ({ profileId, className, defaultData }, ref) => {
        const { data } = useGetMemberProfileById({
            id: profileId,
            options: { initialData: defaultData },
        })

        return (
            <div
                className={cn(
                    'flex flex-1 flex-col gap-y-4 rounded-xl bg-background',
                    className
                )}
                ref={ref}
            >
                <SectionCard
                    icon={<FolderFillIcon className="h-5 w-5" />}
                    subtitle="View all files this member have. Also you can add files for this member"
                    title="Member Files/Media's"
                >
                    <MemberFileMediaDisplay memberProfileId={data?.id} />
                </SectionCard>
            </div>
        )
    }
)

MemberMediasInfo.displayName = 'MemberMediasInfo'

export default MemberMediasInfo
