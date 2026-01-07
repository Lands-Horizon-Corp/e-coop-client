import { useMemo, useState } from 'react'

import Fuse from 'fuse.js'
import { toast } from 'sonner'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    FileItemProps,
    MediaUploaderModal,
} from '@/modules/media/components/media-uploader'
import SectionTitle from '@/modules/member-profile/components/member-infos/section-title'
import { PlusIcon } from 'lucide-react'

import RefreshButton from '@/components/buttons/refresh-button'
import {
    FilesIcon,
    FolderFillIcon,
    MagnifyingGlassIcon,
    PencilFillIcon,
} from '@/components/icons'
import Modal from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import ActionTooltip from '@/components/tooltips/action-tooltip'
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

import { TEntityId } from '@/types'

import {
    useDeleteOrganizationMediaById,
    useGetAllOrganizationMediaByOrganization,
} from '../organization-media.service'
import {
    logger,
    useUploadOrganizationBulkMedia,
} from '../organization-media.service'
import { IOrganizationMedia } from '../organization-media.types'
import OrganizationMediaItem from './organization-media-item'
import UpdateOrganizationMediaFormModal from './update-organization-media-modal'

interface OrganizationMediaProps {
    organizationId: TEntityId
}

const OrganizationMedia = ({ organizationId }: OrganizationMediaProps) => {
    const uploaderModalState = useModalState()
    const organizationMediaState = useModalState()
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'upload_date' | 'name'>('upload_date')

    const { mutate: uploadOrganizationMedia, isPending: isUploading } =
        useUploadOrganizationBulkMedia({
            options: {
                onSuccess: () => {
                    toast.success('Upload Finished successfully')
                },
                onError: (e) => {
                    const errorMessage = serverRequestErrExtractor({ error: e })
                    toast.error('Failed to finish upload, try again.')
                    logger.error(errorMessage)
                },
            },
        })

    const {
        data: OrganizationMedias,
        error: rawError,
        isPending,
        refetch,
        isRefetching,
    } = useGetAllOrganizationMediaByOrganization({
        mode: 'org-media',
        organizationId: organizationId,
    })

    const error = serverRequestErrExtractor({ error: rawError })

    const fuse = useMemo(() => {
        if (!OrganizationMedias) return null
        return new Fuse(OrganizationMedias, {
            keys: ['name', 'media.file_name', 'media.file_type', 'description'],
            threshold: 0.3,
            includeScore: true,
        })
    }, [OrganizationMedias])

    const filteredAndSortedData = useMemo(() => {
        if (!OrganizationMedias) return []

        let result = OrganizationMedias

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
    }, [OrganizationMedias, searchQuery, sortBy, fuse])

    return (
        <div>
            <Modal {...organizationMediaState} className="!min-w-[80%]">
                <MediaUploaderModal
                    {...uploaderModalState}
                    uploaderProps={{
                        accept: {
                            'image/png': ['.png'],
                            'image/jpg': ['.jpeg'],
                        },
                        mode: 'multiple',
                        onMultipleUploadComplete: (uploadedMedias) => {
                            uploadOrganizationMedia({
                                ids: uploadedMedias.map((m) => m.id),
                                organizationId: organizationId,
                            })
                        },
                    }}
                />
                <div className="flex justify-between ">
                    <SectionTitle
                        Icon={FolderFillIcon}
                        subTitle="View all medias/files this organization has"
                        title="Organization Medias"
                    />
                    {isUploading || isRefetching ? (
                        <div className="flex items-center gap-2">
                            <LoadingSpinner className="size-4" />
                            <p className="text-sm text-muted-foreground/80">
                                Finishing upload...
                            </p>
                        </div>
                    ) : (
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
                    )}
                </div>
                {!filteredAndSortedData && error && (
                    <FormErrorMessage
                        className="w-fit mx-auto text-xs"
                        errorMessage={error}
                    />
                )}

                <div>
                    {OrganizationMedias && (
                        <div className="space-y-4">
                            {/* Search and Sort Controls */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        className="pl-10"
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Search ( file name, file type, filename + filetype )"
                                        value={searchQuery}
                                    />
                                </div>
                                <Select
                                    onValueChange={(
                                        value: 'upload_date' | 'name'
                                    ) => setSortBy(value)}
                                    value={sortBy}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="upload_date">
                                            Upload date
                                        </SelectItem>
                                        <SelectItem value="name">
                                            Name
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <RefreshButton
                                    isLoading={isRefetching}
                                    onClick={refetch}
                                />
                            </div>
                            {(isPending && organizationId) ||
                                (isRefetching && (
                                    <LoadingSpinner className="mx-auto" />
                                ))}
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
                                        <OrganizationMediaFileItem
                                            id={item.id}
                                            key={item.id}
                                            media={item.media}
                                            orgMedia={item}
                                            searchTerm={searchQuery}
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
                    {!organizationId && (
                        <Empty className="border border-dashed">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <FolderFillIcon />
                                </EmptyMedia>
                                <EmptyTitle>No Organization</EmptyTitle>
                                <EmptyDescription>
                                    We are unable to locate files since this has
                                    no organization.
                                </EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    )}
                </div>
            </Modal>
            <Button
                onClick={() => {
                    organizationMediaState.onOpenChange(true)
                }}
                size={'sm'}
                variant={'secondary'}
            >
                <FilesIcon />
                Files
            </Button>
        </div>
    )
}

export default OrganizationMedia

type MemberMediaFileItemProps = FileItemProps & {
    id: TEntityId
    orgMedia: IOrganizationMedia
    searchTerm: string
}

export const OrganizationMediaFileItem = ({
    id,
    orgMedia,
    searchTerm,
    ...props
}: MemberMediaFileItemProps) => {
    const deleteMutation = useDeleteOrganizationMediaById()
    const editMemberMedia = useModalState()

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

    return (
        <>
            <UpdateOrganizationMediaFormModal
                {...editMemberMedia}
                formProps={{
                    defaultValues: orgMedia,
                }}
            />
            <OrganizationMediaItem
                {...props}
                onRemove={handleDelete}
                organizationMedia={orgMedia}
                otherAction={
                    <ActionTooltip side="left" tooltipContent="Delete file">
                        <Button
                            className="size-fit rounded-md p-1 hover:text-destructive-foreground"
                            hoverVariant="destructive"
                            onClick={() => editMemberMedia.onOpenChange(true)}
                            size="icon"
                            variant="secondary"
                        >
                            <PencilFillIcon className="size-4 cursor-pointer" />
                        </Button>
                    </ActionTooltip>
                }
                searchTerm={searchTerm}
            />
        </>
    )
}
