import { useMemo, useState } from 'react'

import Fuse from 'fuse.js'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { CurrencyBadge } from '@/modules/currency/components/currency-badge'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    DotsVerticalIcon,
    MagnifyingGlassIcon,
    PencilFillIcon,
    PlusIcon,
    RefreshIcon,
    TrashIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Button } from '@/components/ui/button'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
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

import useDebounce from '@/hooks/use-debounce'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import {
    useDeleteComputationSheetById,
    useGetAllComputationSheet,
} from '../../computation-sheet.service'
import { IComputationSheet } from '../../computation-sheet.types'
import { ComputationSheetCreateUpdateFormModal } from '../forms/computation-sheet-create-update-form'

interface Props extends IClassProps {
    selectedId?: TEntityId
    defaultCurrencyId?: TEntityId
    onDeletedScheme?: (scheme: IComputationSheet) => void
    onSelect?: (selectedComputationSheet: IComputationSheet) => void
}

const ComputationSchemesSidebar = ({
    className,
    selectedId,
    defaultCurrencyId,
    onSelect,
    onDeletedScheme,
}: Props) => {
    const createModal = useModalState()
    const [selected, setSelected] = useState(selectedId)
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 400)

    const { data = [], isPending, refetch } = useGetAllComputationSheet()

    const fuse = useMemo(() => {
        return new Fuse(data, {
            keys: ['name', 'description'],
            threshold: 0.3,
        })
    }, [data])

    const filteredData = useMemo(() => {
        if (!debouncedSearch) return data
        return fuse.search(debouncedSearch).map((r) => r.item)
    }, [fuse, data, debouncedSearch])

    const handleSelect = (scheme: IComputationSheet) => {
        setSelected(scheme.id)
        onSelect?.(scheme)
    }

    return (
        <div
            className={cn(
                'p-2 flex min-w-[100px] max-w-[200px] rounded-xl shrink-0 max-h-full flex-col gap-y-2 bg-popover',
                className
            )}
        >
            <div className="relative group">
                <Input
                    className="shrink-0 pr-10"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search scheme"
                    value={search}
                />
                <MagnifyingGlassIcon className="inline text-muted-foreground/70 duration-200 ease-out group-hover:text-foreground absolute top-1/2 -translate-y-1/2 right-4" />
            </div>
            <div className="flex items-center justify-between gap-x-2">
                <ComputationSheetCreateUpdateFormModal
                    {...createModal}
                    formProps={{
                        defaultValues: {
                            currency_id: defaultCurrencyId,
                        },
                        onSuccess: (createdScheme) => {
                            handleSelect(createdScheme)
                        },
                    }}
                />
                <Button
                    className="flex-1"
                    onClick={() => createModal.onOpenChange(true)}
                    size="sm"
                    variant="secondary"
                >
                    Add Scheme <PlusIcon className="inline ml-2" />
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
                        loading schemes...
                    </p>
                )}
                {filteredData.length === 0 && !isPending && (
                    <p className="text-center w-full text-xs text-muted-foreground/60 py-2">
                        No scheme found{' '}
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
                {filteredData.map((scheme) => (
                    <LoanComputationSheet
                        handleSelect={handleSelect}
                        key={scheme.id}
                        onDeletedScheme={onDeletedScheme}
                        scheme={scheme}
                        selected={selected === scheme.id}
                    />
                ))}
            </div>
        </div>
    )
}

const LoanComputationSheet = ({
    selected,
    scheme,
    handleSelect,
    onDeletedScheme,
}: {
    selected: boolean
    scheme: IComputationSheet
    handleSelect: (scheme: IComputationSheet) => void
    onDeletedScheme?: (scheme: IComputationSheet) => void
}) => {
    const editModal = useModalState()
    const { onOpen } = useConfirmModalStore()

    const { mutate: deleteScheme, isPending: isDeleting } =
        useDeleteComputationSheetById({
            options: {
                ...withToastCallbacks({
                    onSuccess: () => onDeletedScheme?.(scheme),
                }),
            },
        })

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <InfoTooltip
                    content={
                        <p className="text-pretty text-xs max-w-[400px]">
                            {scheme.description || 'No description available'}
                        </p>
                    }
                    side="right"
                >
                    <div
                        className={cn(
                            'p-2 rounded-lg bg-card border flex focus:bg-primary focus:outline-none focus:ring focus:ring-ring focus:text-primary-foreground justify-between relative duration-200 ease-in-out cursor-pointer hover:border-primary/40 hover:bg-primary/20',
                            selected &&
                                'border-primary/60 text-primary-foreground bg-primary/80'
                        )}
                        key={scheme.id}
                        onClick={() => handleSelect(scheme)}
                        tabIndex={0}
                    >
                        <ComputationSheetCreateUpdateFormModal
                            {...editModal}
                            formProps={{
                                computationSheetId: scheme?.id,
                                defaultValues: scheme,
                            }}
                            hideOnSuccess={false}
                        />
                        <div className=" flex-1">
                            <p className="truncate">
                                <span>{scheme.name}</span>
                            </p>
                            <CurrencyBadge
                                currency={scheme.currency}
                                displayFormat="symbol-code"
                                size="sm"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="opacity-40 hover:opacity-100 size-fit shrink-0 p-1 rounded-full"
                                    size="icon"
                                    variant="ghost"
                                >
                                    <DotsVerticalIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="space-y-1">
                                <DropdownMenuLabel className="text-muted-foreground/80">
                                    Action
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => editModal.onOpenChange(true)}
                                >
                                    <PencilFillIcon className="opacity-60 mr-1" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="bg-destructive/05 text-destructive focus:bg-destructive focus:text-destructive-foreground"
                                    disabled={isDeleting}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()

                                        onOpen({
                                            title: 'Delete loan computation sheet cheme',
                                            description: `You are about to delete '${scheme.name}'. Are you sure to proceed?`,
                                            confirmString: 'Delete',
                                            onConfirm: () =>
                                                deleteScheme(scheme.id),
                                        })
                                    }}
                                >
                                    <TrashIcon className="opacity-60 mr-1" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </InfoTooltip>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuLabel className="text-muted-foreground/80">
                    Action
                </ContextMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => editModal.onOpenChange(true)}>
                    <PencilFillIcon className="opacity-60 mr-1" />
                    Edit
                </ContextMenuItem>
                <ContextMenuItem
                    className="bg-destructive/05 text-destructive focus:bg-destructive focus:text-destructive-foreground"
                    disabled={isDeleting}
                    onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onOpen({
                            title: 'Delete loan computation sheet cheme',
                            description: `You are about to delete '${scheme.name}'. Are you sure to proceed?`,
                            confirmString: 'Delete',
                            onConfirm: () => deleteScheme(scheme.id),
                        })
                    }}
                >
                    <TrashIcon className="opacity-60 mr-1" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default ComputationSchemesSidebar
