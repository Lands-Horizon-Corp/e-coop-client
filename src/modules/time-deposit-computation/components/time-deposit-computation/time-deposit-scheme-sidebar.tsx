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
    useDeleteTimeDepositComputationById,
    useGetAllTimeDepositComputation,
} from '../../time-deposit-computation.service'
import { ITimeDepositComputation } from '../../time-deposit-computation.types'
import { TimeDepositComputationCreateUpdateFormModal } from '../forms/time-deposit-computation-create-update-form'

// import { TimeDepositComputationCreateUpdateFormModal } from '../forms/time-deposit-computation-create-update-form'

interface Props extends IClassProps {
    selectedId?: TEntityId
    defaultCurrencyId?: TEntityId
    onDeletedComputation?: (computation: ITimeDepositComputation) => void
    onSelect?: (selectedTimeDepositComputation: ITimeDepositComputation) => void
}

const TimeDepositComputationsSidebar = ({
    className,
    selectedId,
    onSelect,
    onDeletedComputation,
}: Props) => {
    const createModal = useModalState()
    const [selected, setSelected] = useState(selectedId)
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 400)

    const { data = [], isPending, refetch } = useGetAllTimeDepositComputation()

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

    const handleSelect = (computation: ITimeDepositComputation) => {
        setSelected(computation.id)
        onSelect?.(computation)
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
                    placeholder="Search computation"
                    value={search}
                />
                <MagnifyingGlassIcon className="inline text-muted-foreground/70 duration-200 ease-out group-hover:text-foreground absolute top-1/2 -translate-y-1/2 right-4" />
            </div>
            <div className="flex items-center justify-between gap-x-2">
                {/* <TimeDepositComputationCreateUpdateFormModal
                    {...createModal}
                    formProps={{
                        defaultValues: {
                            currency_id: defaultCurrencyId,
                        },
                        onSuccess: (createdComputation) => {
                            handleSelect(createdComputation)
                        },
                    }}
                /> */}
                <Button
                    className="flex-1"
                    onClick={() => createModal.onOpenChange(true)}
                    size="sm"
                    variant="secondary"
                >
                    Add <PlusIcon className="inline ml-2" />
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
                        loading computations...
                    </p>
                )}
                {filteredData.length === 0 && !isPending && (
                    <p className="text-center w-full text-xs text-muted-foreground/60 py-2">
                        No computation found{' '}
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
                {filteredData.map((computation) => (
                    <TimeDepositComputation
                        computation={computation}
                        handleSelect={handleSelect}
                        key={computation.id}
                        onDeletedComputation={onDeletedComputation}
                        selected={selected === computation.id}
                    />
                ))}
            </div>
        </div>
    )
}

const TimeDepositComputation = ({
    selected,
    computation,
    handleSelect,
    onDeletedComputation,
}: {
    selected: boolean
    computation: ITimeDepositComputation
    handleSelect: (computation: ITimeDepositComputation) => void
    onDeletedComputation?: (computation: ITimeDepositComputation) => void
}) => {
    const editModal = useModalState()
    const { onOpen } = useConfirmModalStore()

    const { mutate: deleteComputation, isPending: isDeleting } =
        useDeleteTimeDepositComputationById({
            options: {
                ...withToastCallbacks({
                    onSuccess: () => onDeletedComputation?.(computation),
                }),
            },
        })

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <InfoTooltip
                    content={
                        <p className="text-pretty text-xs max-w-[400px]">
                            {/* {computation.description || */}
                            {'No description available'}
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
                        key={computation.id}
                        onClick={() => handleSelect(computation)}
                        tabIndex={0}
                    >
                        <TimeDepositComputationCreateUpdateFormModal
                            {...editModal}
                            formProps={{
                                timeDepositComputationId: computation?.id,
                                defaultValues: computation,
                            }}
                            hideOnSuccess={false}
                        />
                        <div className=" flex-1">
                            <p className="truncate">
                                <span>{computation.name}</span>
                            </p>
                            <CurrencyBadge
                                currency={computation.currency}
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
                                            title: 'Delete time deposit computation',
                                            description: `You are about to delete '${computation.name}'. Are you sure to proceed?`,
                                            confirmString: 'Delete',
                                            onConfirm: () =>
                                                deleteComputation(
                                                    computation.id
                                                ),
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
                            title: 'Delete time deposit computation',
                            description: `You are about to delete '${computation.name}'. Are you sure to proceed?`,
                            confirmString: 'Delete',
                            onConfirm: () => deleteComputation(computation.id),
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

export default TimeDepositComputationsSidebar
