import { useEffect, useMemo, useState } from 'react'

import Fuse from 'fuse.js'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import { MemberTypeCreateUpdateFormModal } from '@/modules/member-type/components/forms/member-type-create-update-form'
import { useGetAllMemberTypes } from '@/modules/member-type/member-type.service'
import { IMemberType } from '@/modules/member-type/member-type.types'

import {
    DotsVerticalIcon,
    MagnifyingGlassIcon,
    PencilFillIcon,
    PlusIcon,
    RefreshIcon,
    TrashIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import { useDeleteBrowseReferenceById } from '../../browse-reference.service'
import { IBrowseReference } from '../../browse-reference.types'
import { BrowseReferenceCreateUpdateFormModal } from '../forms/browse-reference-create-update-form'

interface Props extends IClassProps {
    selectedReferenceId?: TEntityId
    defaultExpandedMemberTypeId?: TEntityId
    onSelectReference?: (referenceId: TEntityId) => void
    onDeleteReference?: (referenceId: TEntityId) => void
}

const BrowseReferenceSearchInput = ({
    onSearchChanged,
}: {
    onSearchChanged: (val: string) => void
}) => {
    const [search, setSearch] = useState('')

    useEffect(() => {
        const debouncer = setTimeout(() => {
            onSearchChanged(search)
        }, 500)

        return () => clearTimeout(debouncer)
    }, [search, onSearchChanged])

    return (
        <Input
            className="shrink-0 pr-10"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member type"
            value={search}
        />
    )
}

const BrowseReferenceSidebar = ({
    className,
    selectedReferenceId,
    defaultExpandedMemberTypeId,
    onSelectReference,
    onDeleteReference,
}: Props) => {
    const createModal = useModalState()
    const [debouncedSearch, setDebouncedSearch] = useState('')

    const { data = [], isPending, refetch } = useGetAllMemberTypes()

    const fuse = useMemo(
        () =>
            new Fuse(data, {
                keys: ['name', 'prefix'],
                threshold: 0.3,
            }),
        [data]
    )

    const filteredData = useMemo(() => {
        if (!debouncedSearch) return data

        return fuse.search(debouncedSearch).map((result) => result.item)
    }, [fuse, data, debouncedSearch])

    const handleSelectReference = (reference: TEntityId) => {
        onSelectReference?.(reference)
    }

    return (
        <div
            className={cn(
                'p-2 flex max-w-[200px] rounded-xl shrink-0 max-h-full flex-col gap-y-2 bg-popover',
                className
            )}
        >
            <div className="relative group">
                <BrowseReferenceSearchInput
                    onSearchChanged={setDebouncedSearch}
                />
                <MagnifyingGlassIcon className="inline text-muted-foreground/70 duration-200 ease-out group-hover:text-foreground absolute top-1/2 -translate-y-1/2 right-4" />
            </div>
            <div className="flex items-center justify-between gap-x-2">
                <MemberTypeCreateUpdateFormModal
                    {...createModal}
                    formProps={{
                        defaultValues: {},
                        onSuccess: () => {
                            refetch()
                        },
                    }}
                />
                <Button
                    className="flex-1"
                    disabled={
                        !hasPermissionFromAuth({
                            action: 'Create',
                            resourceType: 'MemberTypeBrowseReference',
                        })
                    }
                    onClick={() => createModal.onOpenChange(true)}
                    size="sm"
                    variant="secondary"
                >
                    Add Type <PlusIcon className="inline ml-2" />
                </Button>

                <Button
                    className="shrink-0"
                    disabled={isPending}
                    onClick={() => refetch()}
                    size="icon"
                    variant="secondary"
                >
                    {isPending ? <LoadingSpinner /> : <RefreshIcon />}
                </Button>
            </div>
            <Separator />
            <div className="space-y-2 flex-1 ecoop-scroll overflow-auto">
                {isPending && (data === undefined || data.length === 0) && (
                    <p className="mx-auto w-fit py-2 text-xs text-muted-foreground/60">
                        loading member types...
                    </p>
                )}
                {filteredData.length === 0 && !isPending && (
                    <p className="text-center w-full text-xs text-muted-foreground/60 py-2">
                        No member type found{' '}
                        {debouncedSearch.length > 0 && (
                            <>
                                based on search{' '}
                                <span className="inline text-foreground/80">
                                    &apos;{debouncedSearch}&apos;
                                </span>{' '}
                            </>
                        )}
                    </p>
                )}
                <Accordion
                    className="w-full min-w-0 space-y-2"
                    defaultValue={`member-type-${defaultExpandedMemberTypeId}`}
                    type="single"
                >
                    {filteredData.map((memberType) => (
                        <MemberTypeAccordionItem
                            key={memberType.id}
                            memberType={memberType}
                            onDeleteReference={onDeleteReference}
                            onSelectReference={handleSelectReference}
                            selectedReferenceId={selectedReferenceId}
                        />
                    ))}
                </Accordion>
            </div>
        </div>
    )
}

const MemberTypeAccordionItem = ({
    memberType,
    selectedReferenceId,
    onSelectReference,
    onDeleteReference,
}: {
    memberType: IMemberType
    selectedReferenceId?: TEntityId
    onSelectReference: (reference: TEntityId) => void
    onDeleteReference?: (referenceId: TEntityId) => void
}) => {
    const createReferenceModal = useModalState()
    const memberTypeModal = useModalState()

    const references = memberType.browse_references || []

    return (
        <>
            <MemberTypeCreateUpdateFormModal
                {...memberTypeModal}
                description="Update the details of this member type."
                formProps={{
                    defaultValues: memberType,
                }}
                title="Edit Member Type"
            />
            <BrowseReferenceCreateUpdateFormModal
                {...createReferenceModal}
                formProps={{
                    defaultValues: {
                        member_type_id: memberType.id,
                    },
                }}
            />
            <AccordionItem
                className="min-w-0 border-b-0 space-y-2 bg-card"
                value={`member-type-${memberType.id}`}
            >
                <AccordionTrigger className="px-3 py-2 min-w-0 bg-background/50 border border-border/40 hover:no-underline hover:bg-primary/5 rounded-lg">
                    <div className="flex items-center justify-between flex-1 mr-2 min-w-0 gap-x-2">
                        <div className="text-left min-w-0 flex-1">
                            <p className="font-medium truncate text-sm">
                                {memberType.name}
                            </p>
                        </div>
                        <span
                            className={cn(
                                'size-6 p-0 opacity-60 rounded-md hover:bg-popover flex items-center justify-center duration-300 hover:opacity-100 shrink-0',
                                !hasPermissionFromAuth({
                                    action: ['Update', 'OwnUpdate'],
                                    resourceType: 'MemberTypeBrowseReference',
                                    resource: memberType,
                                }) && 'pointer-events-none cursor-not-allowed'
                            )}
                            onClick={(e) => {
                                e.stopPropagation()

                                if (
                                    !hasPermissionFromAuth({
                                        action: ['Update', 'OwnUpdate'],
                                        resourceType:
                                            'MemberTypeBrowseReference',
                                        resource: memberType,
                                    })
                                )
                                    return toast.warning(
                                        "You don't have permission to update this"
                                    )

                                memberTypeModal.onOpenChange(true)
                            }}
                        >
                            <PencilFillIcon className="size-3" />
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 mx-0 bg-background rounded-md py-2">
                    <div className="mb-2 px-1">
                        <Button
                            className="h-7 text-xs w-full"
                            disabled={
                                !hasPermissionFromAuth({
                                    action: 'Create',
                                    resourceType: 'MemberTypeBrowseReference',
                                })
                            }
                            onClick={(e) => {
                                e.stopPropagation()
                                createReferenceModal.onOpenChange(true)
                            }}
                            size="sm"
                            variant="outline"
                        >
                            <PlusIcon className="size-3.5 mr-1" />
                            Add Reference
                        </Button>
                    </div>

                    {references.length === 0 && (
                        <p className="text-xs text-muted-foreground/60 text-center py-2">
                            No references found
                        </p>
                    )}
                    <div className="space-y-1 px-1">
                        {references.map((reference) => (
                            <BrowseReferenceItem
                                key={reference.id}
                                onDelete={onDeleteReference}
                                onSelect={onSelectReference}
                                reference={reference}
                                selected={selectedReferenceId === reference.id}
                            />
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </>
    )
}

// Component for individual member type reference items
const BrowseReferenceItem = ({
    reference,
    selected,
    onSelect,
    onDelete,
}: {
    reference: IBrowseReference
    selected: boolean
    onSelect: (referenceId: TEntityId) => void
    onDelete?: (referenceId: TEntityId) => void
}) => {
    const { mutateAsync: deleteBrowseReference, isPending: isDeleting } =
        useDeleteBrowseReferenceById({
            options: {
                onSuccess: () => {
                    onDelete?.(reference.id)
                },
            },
        })

    const handleDelete = () => {
        toast.promise(deleteBrowseReference(reference.id), {
            loading: 'Deleting browse reference...',
            success: 'Browse reference deleted successfully',
            error: 'Failed to delete browse reference',
        })
    }

    return (
        <div
            className={cn(
                'flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors group',
                selected && 'bg-primary/10 hover:bg-primary/15'
            )}
            onClick={() => onSelect(reference.id)}
        >
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                    {reference.name || 'Unnamed Account'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {reference.description || 'No description'}
                </p>
                <div className="flex gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                        Rate: {reference.interest_rate}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Min: ${reference.minimum_balance}
                    </span>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="opacity-40 hover:opacity-100 size-fit shrink-0 p-1 rounded-full"
                        onClick={(e) => e.stopPropagation()}
                        size="icon"
                        variant="ghost"
                    >
                        <DotsVerticalIcon />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="space-y-1">
                    <DropdownMenuLabel className="text-muted-foreground/80">
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="bg-destructive/05 text-destructive focus:bg-destructive focus:text-destructive-foreground"
                        disabled={
                            isDeleting ||
                            !hasPermissionFromAuth({
                                action: ['Delete', 'OwnDelete'],
                                resourceType: 'MemberTypeBrowseReference',
                                resource: reference,
                            })
                        }
                        onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            handleDelete()
                        }}
                    >
                        <TrashIcon className="opacity-60 mr-1" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default BrowseReferenceSidebar
