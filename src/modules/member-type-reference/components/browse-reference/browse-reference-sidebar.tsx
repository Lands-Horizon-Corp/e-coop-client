import { useEffect, useMemo, useState } from 'react'

import Fuse from 'fuse.js'

import { cn } from '@/helpers'
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

import { IMemberTypeReference } from '../../member-type-reference.types'
import { MemberTypeReferenceCreateUpdateFormModal } from '../forms/member-type-reference-create-update-form'

interface Props extends IClassProps {
    selectedReferenceId?: TEntityId
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

// Component for each accordion item representing a member type
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

    // Use preloaded browse_references from memberType
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
            <MemberTypeReferenceCreateUpdateFormModal
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
                <AccordionTrigger
                    className="px-3 py-2 min-w-0 bg-background/50 border border-border/40 hover:no-underline hover:bg-primary/5 rounded-lg"
                >
                    <div className="flex items-center justify-between flex-1 mr-2 min-w-0 gap-x-2">
                        <div className="text-left min-w-0 flex-1">
                            <p className="font-medium truncate text-sm">
                                {memberType.name}
                            </p>
                        </div>
                        <Button
                            className="h-6 w-6 p-0 opacity-60 hover:opacity-100 shrink-0"
                            onClick={(e) => {
                                e.stopPropagation()
                                memberTypeModal.onOpenChange(true)
                            }}
                            size="icon-sm"
                            type="button"
                            variant="ghost"
                        >
                            <PencilFillIcon className="size-3" />
                        </Button>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-0 mx-0 bg-background rounded-md py-2">
                    {/* Add Reference button - only visible when expanded */}
                    <div className="mb-2 px-1">
                        <Button
                            className="h-7 text-xs w-full"
                            onClick={(e) => {
                                e.stopPropagation()
                                createReferenceModal.onOpenChange(true)
                            }}
                            size="sm"
                            variant="outline"
                        >
                            <PlusIcon className="h-3.5 w-3.5 mr-1" />
                            Add Reference
                        </Button>
                    </div>

                    {references.length === 0 && (
                        <p className="text-xs text-muted-foreground/60 text-center py-2">
                            No references found
                        </p>
                    )}
                    <div className="space-y-1">
                        {references.map((reference) => (
                            <MemberTypeReferenceItem
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
const MemberTypeReferenceItem = ({
    reference,
    selected,
    onSelect,
    onDelete,
}: {
    reference: IMemberTypeReference
    selected: boolean
    onSelect: (referenceId: TEntityId) => void
    onDelete?: (referenceId: TEntityId) => void
}) => {
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
                    {reference.account?.name || 'Unnamed Account'}
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
                    {/* TODO: Add edit functionality */}
                    {onDelete && (
                        <DropdownMenuItem
                            className="bg-destructive/05 text-destructive focus:bg-destructive focus:text-destructive-foreground"
                            onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                // TODO: Add confirmation modal
                                onDelete(reference?.id)
                            }}
                        >
                            <TrashIcon className="opacity-60 mr-1" />
                            Delete
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default BrowseReferenceSidebar
