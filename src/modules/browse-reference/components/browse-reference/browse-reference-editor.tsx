import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { PAGINATION_INITIAL_INDEX, PICKERS_SELECT_PAGE_SIZE } from '@/constants'
import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    useGetPaginatedMemberProfileByMemberType,
    useLinkMemberProfileMemberType,
    useUnlinkMemberProfileMemberType,
} from '@/modules/member-profile'
import { MemberOverallInfoModal } from '@/modules/member-profile/components/member-infos/view-member-info'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { IMemberProfile } from '@/modules/member-profile/member-profile.types'
import { PaginationState } from '@tanstack/react-table'
import { PiIdentificationBadgeFill } from 'react-icons/pi'

import {
    ErrorIcon,
    LinkIcon,
    MagnifyingGlassIcon,
    UnlinkIcon,
    Users3Icon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
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
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import useFilterState from '@/hooks/use-filter-state'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import { useGetBrowseReferenceById } from '../../browse-reference.service'
import BrowseReferenceUpdateForm from '../forms/browse-update-form/browse-reference-update-form'
import BrowseReferenceSidebar from './browse-reference-sidebar'

interface Props extends IClassProps {
    defaultExpandedMemberTypeId?: TEntityId
}

const BrowseReferenceSchemeEditor = ({
    className,
    defaultExpandedMemberTypeId,
}: Props) => {
    const [selectedReferenceId, setSelectedReferenceId] = useState<
        TEntityId | undefined
    >()

    const {
        data,
        isLoading,
        error: responseError,
    } = useGetBrowseReferenceById({
        id: selectedReferenceId!,
        options: { enabled: !!selectedReferenceId },
    })

    const error = serverRequestErrExtractor({ error: responseError })

    return (
        <div
            className={cn(
                'py-2 w-full min-h-[90vh] max-w-full min-w-0 flex items-start gap-x-2',
                className
            )}
        >
            <BrowseReferenceSidebar
                className="sticky top-0"
                defaultExpandedMemberTypeId={defaultExpandedMemberTypeId}
                onDeleteReference={(referenceId) => {
                    if (selectedReferenceId === referenceId)
                        setSelectedReferenceId(undefined)
                }}
                onSelectReference={(referenceId) =>
                    setSelectedReferenceId(referenceId)
                }
                selectedReferenceId={selectedReferenceId}
            />

            {selectedReferenceId === undefined ? (
                <div className="flex-1 min-h-full flex items-center justify-center">
                    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiIdentificationBadgeFill />
                            </EmptyMedia>
                            <EmptyTitle>No Member Type Reference</EmptyTitle>
                            <EmptyDescription>
                                No member type reference selected, please select
                                or create.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            ) : isLoading ? (
                <div className="flex-1 min-h-full flex items-center justify-center">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            ) : error || !data ? (
                <div className="flex-1 min-h-full flex items-center justify-center">
                    <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
                        <EmptyHeader>
                            <EmptyTitle>Error</EmptyTitle>
                            <EmptyDescription>{error}</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            ) : (
                <>
                    <BrowseReferenceUpdateForm
                        className="flex-1 p-4 rounded-xl bg-popover/70"
                        defaultValues={data}
                        key={selectedReferenceId}
                        memberTypeReferenceId={selectedReferenceId!}
                    />
                    <ConnectedAccountBar memberTypeId={data?.member_type_id} />
                </>
            )}
        </div>
    )
}

const SearchInput = ({ onChange }: { onChange: (value: string) => void }) => {
    const [value, setValue] = useState('')

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            onChange(value)
        }, 300)

        return () => clearTimeout(delayDebounce)
    }, [value, onChange])

    return (
        <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 inline text-muted-foreground" />
            <Input
                className="pl-9"
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search members..."
                value={value}
            />
        </div>
    )
}

const MemberCard = ({
    member,
    onUnlink,
}: {
    member: IMemberProfile
    onUnlink: (memberId: TEntityId) => void
}) => {
    const viewInfoState = useModalState()

    return (
        <div className="group relative bg-background border border-border rounded-lg p-3 hover:bg-accent/50 transition-colors">
            <MemberOverallInfoModal
                {...viewInfoState}
                overallInfoProps={{
                    memberProfileId: member.id,
                    defaultMemberProfile: member,
                }}
            />
            <div
                className="flex items-center cursor-pointer gap-x-3"
                onClick={(e) => {
                    e.stopPropagation()
                    viewInfoState.onOpenChange(true)
                }}
                role="button"
            >
                <PreviewMediaWrapper media={member.media}>
                    <ImageDisplay
                        className="size-10 rounded-full object-cover flex-shrink-0"
                        src={member.media?.download_url}
                    />
                </PreviewMediaWrapper>

                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                        {member.full_name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                        {member.passbook || '-'}
                    </p>
                </div>
            </div>

            <Button
                className="absolute -right-3 top-1/2 -translate-y-1/2 size-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                onClick={() => onUnlink(member.id)}
                size="icon"
                variant="destructive"
            >
                <UnlinkIcon className="size-4" />
            </Button>
        </div>
    )
}

const ConnectedAccountBar = ({
    memberTypeId,
}: {
    memberTypeId?: TEntityId
}) => {
    const memberPickerState = useModalState()
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: PICKERS_SELECT_PAGE_SIZE,
    })

    const { finalFilterPayloadBase64, bulkSetFilter } = useFilterState({
        defaultFilterMode: 'OR',
        debounceFinalFilterMs: 300,
        onFilterChange: () =>
            setPagination((prev) => ({
                ...prev,
                pageIndex: PAGINATION_INITIAL_INDEX,
            })),
    })

    const { data, isPending, isError, error, isFetching } =
        useGetPaginatedMemberProfileByMemberType({
            memberTypeId: memberTypeId!,
            query: {
                filter: finalFilterPayloadBase64,
                ...pagination,
            },
            options: { enabled: !!memberTypeId },
        })

    const { mutateAsync: unlinkMember } = useUnlinkMemberProfileMemberType()
    const { mutateAsync: linkMember } = useLinkMemberProfileMemberType()

    const handleUnlink = (memberId: TEntityId) => {
        toast.promise(unlinkMember({ memberId }), {
            loading: 'Unlinking member...',
            success: 'Member unlinked successfully',
            error: (err) =>
                serverRequestErrExtractor({ error: err }) ||
                'Failed to unlink member',
        })
    }

    const handleLink = (memberId: TEntityId, memberTypeId: TEntityId) => {
        toast.promise(linkMember({ memberId, memberTypeId }), {
            loading: 'Linking member...',
            success: 'Member linked successfully',
            error: (err) =>
                serverRequestErrExtractor({ error: err }) ||
                'Failed to link member',
        })
    }

    return (
        <div className="w-[300px] sticky top-0 h-fit">
            <MemberPicker
                modalState={memberPickerState}
                onSelect={(memberProfile) =>
                    handleLink(memberProfile.id, memberTypeId!)
                }
                triggerClassName="hidden"
            />
            <div className="bg-popover border border-border rounded-xl p-3.5 space-y-4">
                {/* Header */}
                <div className="space-y-1 flex justify-between">
                    <h3 className="font-semibold text-sm flex items-center gap-x-2">
                        <Users3Icon className="size-4" />
                        Connected Members
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        {data?.totalSize || 0} member(s)
                    </p>
                </div>

                <div className="flex gap-x-2">
                    <SearchInput
                        onChange={(searchValue) => {
                            bulkSetFilter(
                                [
                                    {
                                        displayText: 'full name',
                                        field: 'fullName',
                                    },
                                    {
                                        displayText: 'PB',
                                        field: 'memberProfile.passbookNumber',
                                    },
                                ],
                                {
                                    displayText: '',
                                    mode: 'equal',
                                    dataType: 'text',
                                    value: searchValue,
                                }
                            )
                        }}
                    />
                    <Button
                        className="border-e-none"
                        hoverVariant="primary"
                        onClick={() => memberPickerState.onOpenChange(true)}
                        size="icon-sm"
                        variant="outline"
                    >
                        <LinkIcon className="size-4" />
                    </Button>
                </div>

                <div className="space-y-2 ">
                    {!memberTypeId ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Users3Icon className="size-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">
                                No Member Type
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Select a member type to view connected members
                            </p>
                        </div>
                    ) : isPending ? (
                        <div className="flex items-center justify-center py-8">
                            <LoadingSpinner className="size-6" />
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <ErrorIcon className="size-8 text-destructive mb-2" />
                            <p className="text-sm font-medium">Error</p>
                            <p className="text-xs text-muted-foreground">
                                {error.message}
                            </p>
                        </div>
                    ) : !data?.data || data.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Users3Icon className="size-8 text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">No Members</p>
                            <p className="text-xs text-muted-foreground">
                                {finalFilterPayloadBase64
                                    ? 'No members match your search'
                                    : 'No connected members yet'}
                            </p>
                        </div>
                    ) : (
                        data.data.map((member) => (
                            <MemberCard
                                key={member.id}
                                member={member}
                                onUnlink={handleUnlink}
                            />
                        ))
                    )}
                </div>

                {data && data.totalPage > 1 && (
                    <MiniPaginationBar
                        disablePageMove={isFetching}
                        onNext={({ pageIndex }) =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex,
                            }))
                        }
                        onPrev={({ pageIndex }) =>
                            setPagination((prev) => ({
                                ...prev,
                                pageIndex,
                            }))
                        }
                        pagination={{
                            pageIndex: pagination.pageIndex,
                            pageSize: pagination.pageSize,
                            totalPage: data.totalPage,
                            totalSize: data.totalSize,
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default BrowseReferenceSchemeEditor
