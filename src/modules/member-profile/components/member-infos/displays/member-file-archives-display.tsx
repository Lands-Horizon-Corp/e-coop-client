import { useMemo, useState } from 'react'

import Fuse from 'fuse.js'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import { FileItemProps } from '@/modules/media/components/media-uploader'
import {
    IMemberProfileArchive,
    useDeleteMemberProfileArchiveById,
    useGetAllMemberProfileArchiveByMemberProfile,
    useGetMemberProfileArchiveCategory,
} from '@/modules/member-profile-archive'
import { UpdateMemberProfileArchiveFormModal } from '@/modules/member-profile-archive/components/form/update-member-profile-archive-form'
import { MemberProfileArchiveUploadFormModal } from '@/modules/member-profile-archive/components/form/updatemember-profile-archive-upload-form'
import MemberArchiveItem from '@/modules/member-profile-archive/components/member-archive-item'
import PermissionGuard from '@/modules/permission/components/permission-guard'
import { stringNormalizer } from '@/modules/timesheet/components/worktimer/utils'

import {
    CompressedFileFillIcon,
    FolderFillIcon,
    MagnifyingGlassIcon,
    PencilFillIcon,
    PlusIcon,
    RefreshIcon,
    SortIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import FormErrorMessage from '@/components/ui/form-error-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import { SectionCard } from '../section-card'

interface Props extends IClassProps {
    profileId: TEntityId
}

type TSortBy = 'upload_date' | 'name' | 'category'

const MemberFileArchiveContent = ({ profileId, className }: Props) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<TSortBy>('upload_date')
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])

    const uploaderModalState = useModalState()

    const {
        data: memberProfileArchives,
        isPending,
        error: rawError,
        refetch,
        isRefetching,
    } = useGetAllMemberProfileArchiveByMemberProfile({
        mode: 'member-profile',
        memberProfileId: profileId,
        options: {
            enabled: !!profileId,
        },
    })

    const { data: categories, isPending: isPendingCategories } =
        useGetMemberProfileArchiveCategory({ memberProfileId: profileId })

    const data = useMemo(() => {
        if (selectedCategories.length === 0) return memberProfileArchives

        return memberProfileArchives?.filter((archive) =>
            selectedCategories
                .map((cats) => stringNormalizer(cats))
                .includes(stringNormalizer(archive.category))
        )
    }, [memberProfileArchives, selectedCategories])

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

    const handleCategoryToggle = (categoryName: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryName)
                ? prev.filter((c) => c !== categoryName)
                : [...prev, categoryName]
        )
    }

    return (
        <SectionCard
            icon={<CompressedFileFillIcon className="h-5 w-5" />}
            subtitle="View all archived files of this member."
            title="Archives"
        >
            <div className={cn('min-h-[50vh] space-y-2', className)}>
                <MemberProfileArchiveUploadFormModal
                    {...uploaderModalState}
                    formProps={{
                        memberProfileId: profileId,
                        onSuccess: () => {
                            uploaderModalState.onOpenChange(false)
                        },
                    }}
                    key={uploaderModalState.open ? 'open' : 'closed'}
                />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="h-10 pl-10 pr-4 bg-background border-border focus-visible:ring-primary"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search (file name, file type, category, description)"
                            type="text"
                            value={searchQuery}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-sm font-medium">Sort</p>
                        <Select
                            onValueChange={(sortVal) =>
                                setSortBy(sortVal as TSortBy)
                            }
                            value={sortBy}
                        >
                            <SelectTrigger className="h-10 w-[150px] border-border bg-background">
                                <SortIcon className="mr-2 size-4 text-muted-foreground" />
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="upload_date">
                                    Upload date
                                </SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="category">
                                    Category
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                                {memberProfileArchives?.length || 0}
                            </span>
                            <span>Files</span>
                        </div>

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
                            disabled={
                                !hasPermissionFromAuth({
                                    action: 'Create',
                                    resourceType: 'MemberProfileFileArchives',
                                })
                            }
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
                </div>
                <div className=" flex gap-x-2">
                    <div className="w-[250px] max-h-[90vh] overflow-auto ecoop-scroll rounded-xl border border-border/60">
                        {!isPendingCategories ? (
                            <ul className="flex w-full flex-col divide-y rounded-md border">
                                {categories
                                    ?.sort((a, b) => b.count - a.count)
                                    .map(({ name, count }) => (
                                        <li key={name}>
                                            <Label
                                                className={cn(
                                                    'flex items-center duration-200 ease-in-out text-muted-foreground hover:text-foreground justify-between gap-2 px-5 py-3 cursor-pointer',
                                                    selectedCategories.includes(
                                                        name
                                                    ) &&
                                                        'bg-primary/10 text-primary hover:text-primary/70'
                                                )}
                                                htmlFor={name}
                                            >
                                                <p className="flex items-center gap-2">
                                                    {name}
                                                </p>
                                                <span className="flex items-center gap-x-2">
                                                    <span className="bg-muted p-1 rounded-full">
                                                        {count}
                                                    </span>
                                                    <Checkbox
                                                        checked={selectedCategories.includes(
                                                            name
                                                        )}
                                                        id={name}
                                                        onCheckedChange={() =>
                                                            handleCategoryToggle(
                                                                name
                                                            )
                                                        }
                                                    />
                                                </span>
                                            </Label>
                                        </li>
                                    ))}
                            </ul>
                        ) : (
                            <ul className="flex w-full flex-col divide-y rounded-md border">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <li className="px-5 py-3" key={index}>
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="size-4" />
                                                <Skeleton className="h-4 w-24" />
                                            </div>
                                            <Skeleton className="size-4 rounded" />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="space-y-4 max-h-[70vh] overflow-auto ecoop-scroll flex-1">
                        {!data && error && (
                            <FormErrorMessage
                                className="w-fit mx-auto text-xs"
                                errorMessage={error}
                            />
                        )}
                        {isPending && profileId && (
                            <LoadingSpinner className="mx-auto" />
                        )}
                        {data && (
                            <div className="space-y-4">
                                {filteredAndSortedData.length === 0 ? (
                                    <Empty className="border border-dashed">
                                        <EmptyHeader>
                                            <EmptyMedia variant="icon">
                                                <FolderFillIcon />
                                            </EmptyMedia>
                                            <EmptyTitle>
                                                No Archives Found
                                            </EmptyTitle>
                                            <EmptyDescription>
                                                {searchQuery
                                                    ? 'No archives match your search criteria.'
                                                    : 'This member has not archived any files yet.'}
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredAndSortedData.map((item) => (
                                            <MemberArchiveFileItem
                                                id={item.id}
                                                key={item.id}
                                                media={item.media}
                                                memberArchive={item}
                                                uploadedBy={
                                                    item.created_by
                                                        ?.full_name ||
                                                    'unknown user'
                                                }
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {!profileId && (
                            <Empty className="border border-dashed">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <FolderFillIcon />
                                    </EmptyMedia>
                                    <EmptyTitle>No User Account</EmptyTitle>
                                    <EmptyDescription>
                                        We are unable to locate archives since
                                        this member profile has no User Account.
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        )}
                    </div>
                </div>
            </div>
        </SectionCard>
    )
}

const MemberFileArchiveDisplay = (props: Props) => {
    return (
        <PermissionGuard action="Read" resourceType="MemberProfileFileArchives">
            <MemberFileArchiveContent {...props} />
        </PermissionGuard>
    )
}

type MemberArchiveFileItemProps = FileItemProps & {
    id: TEntityId
    memberArchive: IMemberProfileArchive
}

const MemberArchiveFileItem = ({
    id,
    memberArchive,
    ...props
}: MemberArchiveFileItemProps) => {
    const deleteMutation = useDeleteMemberProfileArchiveById()
    const editMemberArchive = useModalState()

    const handleDelete = () => {
        toast.promise(deleteMutation.mutateAsync(id), {
            loading: 'Deleting archive...',
            success: 'Archive deleted successfully',
            error: (err) => {
                const errorMessage = serverRequestErrExtractor({ error: err })
                return errorMessage || 'Failed to delete archive'
            },
        })
    }

    return (
        <>
            <UpdateMemberProfileArchiveFormModal
                {...editMemberArchive}
                formProps={{
                    defaultValues: memberArchive,
                }}
            />
            <MemberArchiveItem
                {...props}
                memberArchive={memberArchive}
                onRemove={
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'MemberProfileFileArchives',
                        resource: memberArchive,
                    })
                        ? handleDelete
                        : undefined
                }
                otherAction={
                    <ActionTooltip side="bottom" tooltipContent="Edit archive">
                        <Button
                            className="size-fit rounded-md p-1 hover:text-destructive-foreground"
                            disabled={
                                !hasPermissionFromAuth({
                                    action: ['OwnUpdate', 'Update'],
                                    resourceType: 'MemberProfileFileArchives',
                                    resource: memberArchive,
                                })
                            }
                            hoverVariant="destructive"
                            onClick={() => editMemberArchive.onOpenChange(true)}
                            size="icon"
                            variant="secondary"
                        >
                            <PencilFillIcon className="size-4 cursor-pointer" />
                        </Button>
                    </ActionTooltip>
                }
            />
        </>
    )
}

export default MemberFileArchiveDisplay
