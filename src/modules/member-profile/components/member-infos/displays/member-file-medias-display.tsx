import { useMemo, useState } from 'react'

import Fuse from 'fuse.js'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    FileItem,
    FileItemProps,
    MediaUploaderModal,
} from '@/modules/media/components/media-uploader'
import {
    useDeleteMemberProfileMediaById,
    useGetAllMemberProfileMediaByMemberProfile,
    useMemberProfileMediaBulk,
} from '@/modules/member-profile-media'

import {
    FolderFillIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    RefreshIcon,
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
import FormErrorMessage from '@/components/ui/form-error-message'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import { logger } from '../../../'
import SectionTitle from '../section-title'

interface Props extends IClassProps {
    memberProfileId?: TEntityId
}

const MemberFileMediaDisplay = ({ memberProfileId, className }: Props) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'upload_date' | 'name'>('upload_date')
    const uploaderModalState = useModalState()

    const {
        data,
        isPending,
        error: rawError,
        refetch,
        isRefetching,
    } = useGetAllMemberProfileMediaByMemberProfile({
        mode: 'member-profile',
        memberProfileId,
        options: {
            enabled: !!memberProfileId,
        },
    })

    const error = serverRequestErrExtractor({ error: rawError })

    const fuse = useMemo(() => {
        if (!data) return null
        return new Fuse(data, {
            keys: ['name', 'media.file_name', 'media.file_type', 'description'],
            threshold: 0.3,
            includeScore: true,
        })
    }, [data])

    const filteredAndSortedData = useMemo(() => {
        if (!data) return []

        let result = data

        if (searchQuery && fuse) {
            const searchResults = fuse.search(searchQuery)
            result = searchResults.map((r) => r.item)
        }

        return [...result].sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name)
            }
            return (
                new Date(b.created_at || 0).getTime() -
                new Date(a.created_at || 0).getTime()
            )
        })
    }, [data, searchQuery, sortBy, fuse])

    const {
        mutateAsync: bulkUploadMediaForMemberProfile,
        isPending: isBulkUploading,
    } = useMemberProfileMediaBulk({
        options: {
            onSuccess: () => {
                toast.success('Upload finished successfully.')
                uploaderModalState.onOpenChange(false)
            },
            onError: (e) => {
                const errorMessage = serverRequestErrExtractor({ error: e })
                toast.error(`Failed to finish upload, try again.`)
                logger.error(errorMessage)
            },
        },
    })

    return (
        <div className={cn('min-h-[50vh] space-y-4', className)}>
            <MediaUploaderModal
                {...uploaderModalState}
                uploaderProps={{
                    mode: 'multiple',
                    onMultipleUploadComplete: (uploadedMedias) => {
                        bulkUploadMediaForMemberProfile({
                            media_ids: uploadedMedias.map((m) => m.id),
                            memberProfileId: memberProfileId as TEntityId,
                        })
                    },
                }}
            />
            <div className="flex justify-between">
                <SectionTitle
                    Icon={FolderFillIcon}
                    subTitle="View all medias/files this user has"
                    title="Member Medias"
                />
                {isBulkUploading ? (
                    <div className="flex items-center gap-2">
                        <LoadingSpinner className="size-4" />
                        <p className="text-sm text-muted-foreground/80">
                            Finishing upload...
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground/80">
                            {(data ?? []).length} Files
                        </p>
                        <Button
                            disabled={isRefetching}
                            onClick={() => refetch()}
                            size="sm"
                            variant="outline"
                        >
                            {isRefetching ? (
                                <LoadingSpinner className="size-4" />
                            ) : (
                                <RefreshIcon className="size-4" />
                            )}
                        </Button>
                        <Button
                            onClick={() =>
                                uploaderModalState.onOpenChange(true)
                            }
                            size="sm"
                            variant="outline"
                        >
                            <PlusIcon className="size-4" />
                            Upload File
                        </Button>
                    </div>
                )}
            </div>
            {!data && error && (
                <FormErrorMessage
                    className="w-fit mx-auto text-xs"
                    errorMessage={error}
                />
            )}
            {isPending && memberProfileId && (
                <LoadingSpinner className="mx-auto" />
            )}
            {data && (
                <div className="space-y-4">
                    {/* Search and Sort Controls */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                className="pl-10"
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search (with fuse.js) ( file name, file type, filename + filetype )"
                                value={searchQuery}
                            />
                        </div>
                        <Select
                            onValueChange={(value: 'upload_date' | 'name') =>
                                setSortBy(value)
                            }
                            value={sortBy}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="upload_date">
                                    Upload date
                                </SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {filteredAndSortedData.length === 0 ? (
                        <Empty className="border border-dashed">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <FolderFillIcon />
                                </EmptyMedia>
                                <EmptyTitle>No Files Found</EmptyTitle>
                                <EmptyDescription>
                                    {searchQuery
                                        ? 'No files match your search criteria.'
                                        : 'This member has not uploaded any files yet.'}
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <div className="space-y-2">
                            {filteredAndSortedData.map((item) => (
                                <MemberMediaFileItem
                                    id={item.id}
                                    key={item.id}
                                    media={item.media}
                                    uploadedBy={
                                        item.created_by?.full_name ||
                                        'unknown user'
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
            {!memberProfileId && (
                <Empty className="border border-dashed">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FolderFillIcon />
                        </EmptyMedia>
                        <EmptyTitle>No User Account</EmptyTitle>
                        <EmptyDescription>
                            We are unable to locate files since this member
                            profile has no User Account.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}
        </div>
    )
}

type MemberMediaFileItemProps = FileItemProps & {
    id: TEntityId
}

const MemberMediaFileItem = ({ id, ...props }: MemberMediaFileItemProps) => {
    const deleteMutation = useDeleteMemberProfileMediaById()

    const handleDelete = () => {
        toast.promise(deleteMutation.mutateAsync(id), {
            loading: 'Deleting file...',
            success: 'File deleted successfully',
            error: (err) => {
                const errorMessage = serverRequestErrExtractor({ error: err })
                return errorMessage || 'Failed to delete file'
            },
        })
    }

    return <FileItem {...props} onRemoveFile={handleDelete} />
}

export default MemberFileMediaDisplay
