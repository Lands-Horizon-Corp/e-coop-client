import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import {
    AccountCreateUpdateFormModal,
    AccountPicker,
    GeneralLedgerTypeEnum,
    IAccount,
    useDeleteAccountFromGLFS,
    useUpdateAccountIndex,
} from '@/modules/account'
import {
    GeneralLedgerDefinitionCreateUpdateFormModal,
    GeneralLedgerDefinitionNode,
    IGeneralLedgerDefinition,
    useConnectAccount,
    useDeleteById,
    useUpdateIndex,
} from '@/modules/general-ledger-definition'
import { useGeneralLedgerAccountsGroupingStore } from '@/store/general-ledger-accounts-groupings-store'
import { useGLFSStore } from '@/store/gl-fs-store'
import {
    DndContext,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PlusIcon } from 'lucide-react'

import { CollapseIcon, MagnifyingGlassIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { TEntityId, UpdateIndexRequest } from '@/types'

type GeneralLedgerTreeViewerProps = {
    treeData: IGeneralLedgerDefinition[]
    refetch?: () => void
    isRefetchingGeneralLedgerAccountsGrouping?: boolean
}

const findNodePathByGlIdOnly = (
    nodes: IGeneralLedgerDefinition[],
    path: string[] = [],
    glId: string
): string[] | null => {
    for (const node of nodes) {
        const newPath = [...path, node.id]

        if (node.id === glId) {
            return newPath
        }

        if (node.general_ledger_definition) {
            const found = findNodePathByGlIdOnly(
                node.general_ledger_definition,
                newPath,
                glId
            )
            if (found) return found
        }
    }

    return null
}

const findNodePathWithAccounts = (
    nodes: IGeneralLedgerDefinition[],
    path: string[] = [],
    searchTerm: string
): string[] | null => {
    for (const node of nodes) {
        const newPath = [...path, node.id]

        if (
            searchTerm &&
            (node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                node.accounts?.some((account) =>
                    account.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                ))
        ) {
            return newPath
        }

        if (node.general_ledger_definition) {
            const foundPath = findNodePathWithAccounts(
                node.general_ledger_definition,
                newPath,
                searchTerm
            )
            if (foundPath) return foundPath
        }
    }
    return null
}

const GeneralLedgerDefinitionTreeViewer = ({
    treeData,
    refetch,
    isRefetchingGeneralLedgerAccountsGrouping,
}: GeneralLedgerTreeViewerProps) => {
    const {
        // ── General Ledger Definition State ──
        generalLedgerDefinitions,
        setGeneralLedgerDefinition,
        changedGeneralLedgerItems,
        setChangedGeneralLedgerItems,
        selectedGeneralLedgerDefinitionId,
        setSelectedGeneralLedgerDefinitionId,
        selectedGeneralLedgerDefinition: node,
        setSelectedGeneralLedgerDefinition,
        generalLedgerDefinitionEntriesId,
        setGeneralLedgerDefinitionEntriesId,

        // ── Modal Controls ──
        openCreateGeneralLedgerModal,
        setOpenCreateGeneralLedgerModal,

        // ── View & Interaction State ──
        onCreate,
        setOnCreate,
        isReadOnly,

        // ── Accounts Management ──
        changedAccounts,
        moveGeneralLedgerNode,
        generalLedgerAccountsGroupingId,
    } = useGeneralLedgerAccountsGroupingStore()

    const {
        selectedAccounts,
        openViewAccountModal,
        setViewAccountModalOpen,
        // openGeneralLedgerAccountTableModal,
        // setOpenGeneralLedgerAccountTableModal,
        setChangedAccounts,
        expandPath,
        resetExpansion,
        setTargetNodeId,
        openAddAccountPickerModal,
        setAddAccountPickerModalOpen,
    } = useGLFSStore()

    const [searchTerm, setSearchTerm] = useState('')
    const { mutate: updateIndex, isPending } = useUpdateIndex({
        options: {
            onSuccess: () => {
                refetch?.()
                setChangedGeneralLedgerItems([])
                toast.success(
                    'General Ledger Definition Accounts Grouping Index Updated'
                )
            },
        },
    })

    const hanldeFoundPath = (glId: TEntityId) => {
        const foundPath = findNodePathByGlIdOnly(
            generalLedgerDefinitions,
            [],
            glId
        )

        if (foundPath) {
            expandPath(foundPath)
            setTargetNodeId(foundPath[foundPath.length - 1])
        }
    }

    const { mutateAsync: addAccountsToGeneralDefinition } = useConnectAccount({
        options: {
            onSuccess: (generalLedgerDefinition) => {
                refetch?.()
                setAddAccountPickerModalOpen?.(false)
                hanldeFoundPath(generalLedgerDefinition.id)
            },
        },
    })

    const { mutate: deleteGeneralLedgerDefinition } = useDeleteById({
        options: {
            onSuccess: () => {
                refetch?.()
                setSelectedGeneralLedgerDefinitionId?.(null)
                setSelectedGeneralLedgerDefinition?.(null)
                setOpenCreateGeneralLedgerModal?.(false)
            },
        },
    })

    const { mutate: updateAccountIndex } = useUpdateAccountIndex({
        options: {
            onSuccess: () => {
                refetch?.()
                setChangedAccounts?.([])
            },
        },
    })

    const { mutate: removeGLAccount } = useDeleteAccountFromGLFS({
        options: {
            onSuccess: (account) => {
                refetch?.()
                setAddAccountPickerModalOpen?.(false)
                toast.success(`${account.name} account removed.`)
            },
        },
    })

    const handleRemoveAccountFromGLDefinition = (accountId: TEntityId) => {
        if (accountId) {
            removeGLAccount({ id: accountId, mode: 'general-ledger' })
        }
    }

    const hanldeDeleteGeneralLedgerDefinition = (nodeId: TEntityId) => {
        deleteGeneralLedgerDefinition(nodeId)
    }

    const topLevelSensors = useSensors(useSensor(PointerSensor))

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            resetExpansion()
            return
        }

        const path = findNodePathWithAccounts(
            generalLedgerDefinitions,
            [],
            searchTerm
        )

        if (path) {
            expandPath(path)
            setTargetNodeId(path[path.length - 1])
        } else {
            toast.error('Item not found!')
            resetExpansion()
        }
    }

    const handleAccountSelection = async (account: IAccount) => {
        if (account && selectedGeneralLedgerDefinitionId) {
            await addAccountsToGeneralDefinition({
                id: selectedGeneralLedgerDefinitionId,
                accountId: account.id,
            })
        } else {
            toast.error('Please select a General Ledger Definition first.')
        }
    }

    useEffect(() => {
        if (treeData ?? false) {
            setGeneralLedgerDefinition(treeData)
        }
    }, [treeData, setGeneralLedgerDefinition])

    const OnSuccessCreateUpdateGLModal = (
        generalLedgerDefinitions: IGeneralLedgerDefinition
    ) => {
        refetch?.()
        setOpenCreateGeneralLedgerModal?.(false)
        setSelectedGeneralLedgerDefinition?.(null)
        setSelectedGeneralLedgerDefinitionId?.(null)
        setGeneralLedgerDefinitionEntriesId?.(undefined)

        hanldeFoundPath(generalLedgerDefinitions.id)
    }

    const addGeneralLedgerDefinition = () => {
        setSelectedGeneralLedgerDefinitionId?.(null)
        setOpenCreateGeneralLedgerModal?.(true)
        resetExpansion()
        setSearchTerm('')
        setAddAccountPickerModalOpen?.(false)
        setTargetNodeId?.('')
        setSelectedGeneralLedgerDefinition?.(null)
        setTimeout(() => {
            setOnCreate?.(true)
        }, 100)
        setGeneralLedgerDefinitionEntriesId?.(undefined)
    }

    const handleUpdateOrder = (
        changedGeneralLedgerItems: UpdateIndexRequest[],
        changedAccounts: UpdateIndexRequest[]
    ) => {
        if (changedAccounts.length > 0) {
            updateAccountIndex(changedAccounts)
        }
        if (changedGeneralLedgerItems.length > 0) {
            updateIndex(changedGeneralLedgerItems)
        }
    }

    const { selectedGeneralLedgerTypes } =
        useGeneralLedgerAccountsGroupingStore()

    const isSearchOnChanged = searchTerm.length > 0

    const createOrUpdateTitle = `${onCreate ? 'Create' : 'Update'} General Ledger Definition`
    const createOrUpdateDescription = `Fill out the form to ${onCreate ? 'add a new' : 'edit'} General Ledger Definition.`

    const formDefaultValues = onCreate
        ? {
              general_ledger_type:
                  selectedGeneralLedgerTypes || GeneralLedgerTypeEnum.Assets,
          }
        : {
              ...node,
          }

    const generalLedgerDefinitionId = onCreate
        ? undefined
        : (node?.id ?? undefined)

    const hasAnyOrderChanged = Boolean(
        changedGeneralLedgerItems.length || changedAccounts.length
    )

    const isHandleOrderDisabled =
        !hasAnyOrderChanged ||
        isPending ||
        isRefetchingGeneralLedgerAccountsGrouping

    const hasChildren =
        (treeData?.length ?? 0) > 0 ||
        (generalLedgerDefinitions?.length ?? 0) > 0

    return (
        <div className="w-full rounded-lg p-4">
            {/* to do once jerbee done to general ledger Table */}
            {/* {selectedAccounts?.id && (
                <GeneralLedgerAccountsModal
                    open={openGeneralLedgerAccountTableModal}
                    onOpenChange={setOpenGeneralLedgerAccountTableModal}
                    title="General Ledger Accounts"
                    description="This is the general ledger based on selected account"
                    className="max-w-3xl"
                    accountId={selectedAccounts.id}
                />
            )} */}
            <AccountCreateUpdateFormModal
                open={openViewAccountModal}
                onOpenChange={setViewAccountModalOpen}
                title="Account Details"
                description="this account is part of the General Ledger Definition"
                formProps={{
                    defaultValues: { ...selectedAccounts },
                    readOnly: true,
                }}
            />
            {generalLedgerAccountsGroupingId && (
                <GeneralLedgerDefinitionCreateUpdateFormModal
                    onOpenChange={setOpenCreateGeneralLedgerModal}
                    open={openCreateGeneralLedgerModal}
                    title={createOrUpdateTitle}
                    description={createOrUpdateDescription}
                    formProps={{
                        defaultValues: formDefaultValues,
                        generalLedgerDefinitionEntriesId:
                            generalLedgerDefinitionEntriesId,
                        generalLedgerAccountsGroupingId:
                            generalLedgerAccountsGroupingId,
                        generalLedgerDefinitionId: generalLedgerDefinitionId,
                        readOnly: isReadOnly,
                        onSuccess: OnSuccessCreateUpdateGLModal,
                    }}
                />
            )}

            <AccountPicker
                open={openAddAccountPickerModal}
                onOpenChange={setAddAccountPickerModalOpen}
                modalOnly
                onSelect={(account) => {
                    handleAccountSelection(account)
                }}
            />
            <div className="flex gap-2 py-4">
                <Button
                    size="sm"
                    className="rounded-xl"
                    onClick={() => {
                        addGeneralLedgerDefinition()
                    }}
                    disabled={isReadOnly || isPending}
                >
                    <PlusIcon size={15} className="mr-2" />
                    Add GL
                </Button>
                <Input
                    type="text"
                    className="rounded-2xl"
                    placeholder="Search General Ledger..."
                    disabled={isReadOnly || !hasChildren || isPending}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && isSearchOnChanged) {
                            handleSearch()
                        }
                    }}
                />
                <Button
                    onClick={handleSearch}
                    variant={'secondary'}
                    className="flex items-center rounded-2xl space-x-2"
                    disabled={!isSearchOnChanged || isReadOnly || isPending}
                >
                    <MagnifyingGlassIcon className="mr-2" />
                    Search
                </Button>
            </div>
            <div className="w-full flex items-center gap-x-2 justify-start">
                <Tooltip>
                    <TooltipTrigger
                        onClick={() => {
                            resetExpansion()
                        }}
                        className="rounded-sm p-1 hover:bg-secondary/50 text-xs"
                    >
                        <CollapseIcon size={15} />
                    </TooltipTrigger>
                    <TooltipContent>Collapse All</TooltipContent>
                </Tooltip>
                <Button
                    disabled={isHandleOrderDisabled}
                    variant={'outline'}
                    className="rounded-xl text-xs"
                    size="sm"
                    onClick={() =>
                        handleUpdateOrder(
                            changedGeneralLedgerItems,
                            changedAccounts
                        )
                    }
                >
                    {isPending ? (
                        <LoadingSpinner className="animate-spin" />
                    ) : (
                        'update order'
                    )}
                </Button>
            </div>
            <DndContext
                sensors={topLevelSensors}
                onDragEnd={(event) =>
                    moveGeneralLedgerNode(
                        [],
                        event.active.id,
                        event.over?.id || ''
                    )
                }
                collisionDetection={closestCorners}
            >
                <SortableContext
                    items={generalLedgerDefinitions.map((ledger) => ledger.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {treeData ? (
                        <>
                            {generalLedgerDefinitions?.map((node) => {
                                return (
                                    <GeneralLedgerDefinitionNode
                                        key={node.id}
                                        node={node}
                                        depth={0}
                                        parentPath={[]}
                                        refetch={refetch}
                                        onDragEndNested={moveGeneralLedgerNode}
                                        hanldeDeleteGeneralLedgerDefinition={
                                            hanldeDeleteGeneralLedgerDefinition
                                        }
                                        handleRemoveAccountFromGLDefinition={
                                            handleRemoveAccountFromGLDefinition
                                        }
                                    />
                                )
                            })}
                        </>
                    ) : (
                        <div className="flex flex-col gap-y-5 items-center justify-center h-64">
                            <p>No Financial Statement Definitions found.</p>
                            <Button
                                variant="outline"
                                className="ml-4 z-10"
                                onClick={addGeneralLedgerDefinition}
                            >
                                <PlusIcon size={15} className="mr-2" />
                                Add General Ledger Definition
                            </Button>
                        </div>
                    )}
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default GeneralLedgerDefinitionTreeViewer
