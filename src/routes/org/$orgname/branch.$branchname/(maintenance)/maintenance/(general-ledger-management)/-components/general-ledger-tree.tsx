import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useGeneralLedgerStore } from '@/store/general-ledger-accounts-groupings-store'
import { IAccount } from '@/types/coop-types/accounts/account'
import {
    GeneralLedgerTypeEnum,
    IGeneralLedgerDefinition,
} from '@/types/coop-types/general-ledger-definitions'
import {
    DndContext,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { PlusIcon } from 'lucide-react'

import { AccountCreateUpdateFormModal } from '@/components/forms/accounting-forms/account-create-update-form'
import { GeneralLedgerDefinitionCreateUpdateFormModal } from '@/components/forms/general-ledger-definition/general-ledger-definition-create-update-form'
import { CollapseIcon, MagnifyingGlassIcon } from '@/components/icons'
import AccountPicker from '@/components/pickers/account-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import {
    useConnectAccountToGeneralLedgerDefinition,
    useDeleteGeneralLedgerDefinition,
    useUpdateIndexGeneralLedgerDefinition,
} from '@/hooks/api-hooks/general-ledger-definitions/use-general-ledger-definition'
import {
    useDeleteAccountFromGLDefintion,
    useUpdateAccountIndex,
} from '@/hooks/api-hooks/use-account'

import { TEntityId, UpdateIndexRequest } from '@/types'

import GeneralLedgerAccountsModal from './general-ledger-accounts-view-modal'
import GeneralLedgerDefinitionNode from './gl-definition-node'

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

const GeneralLedgerTreeViewer = ({
    treeData,
    refetch,
    isRefetchingGeneralLedgerAccountsGrouping,
}: GeneralLedgerTreeViewerProps) => {
    const {
        // ── General Ledger Definition State ──
        generalLedgerDefitions,
        setGEneralLedgerDefitions,
        changedGeneralLedgerItems,
        setChangedGeneralLedgerItems,
        selectedGeneralLedgerDefinitionId,
        setSelectedGeneralLedgerDefinitionId,
        selectedGeneralLedgerDefinition: node,
        setSelectedGeneralLedgerDefinition,
        generalDefinitionEntriesId,
        setGeneralLedgerDefinitionEntriesId,

        // ── Modal Controls ──
        openCreateGeneralLedgerModal,
        setOpenCreateGeneralLedgerModal,
        openAddAccountPickerModal,
        setAddAccountPickerModalOpen,
        openViewAccountModal,
        setViewAccountModalOpen,
        openGeneralLedgerAccountTableModal,
        setOpenGeneralLedgerAccountTableModal,

        // ── View & Interaction State ──
        onCreate,
        setOnCreate,
        isReadOnly,
        expandPath,
        resetExpansion,
        setTargetNodeId,

        // ── Accounts Management ──
        changedAccounts,
        selectedAccounts,
        moveGeneralLedgerNode,
        generalLedgerAccountsGroupingId,
        setChangedAccounts,
    } = useGeneralLedgerStore()

    const [searchTerm, setSearchTerm] = useState('')
    const { mutate: updateIndex, isPending } =
        useUpdateIndexGeneralLedgerDefinition({
            onSuccess: () => {
                refetch?.()
                setChangedGeneralLedgerItems([])
                toast.success(
                    'General Ledger Definition Accounts Grouping Index Updated'
                )
            },
        })

    const hanldeFoundPath = (glId: TEntityId) => {
        const foundPath = findNodePathByGlIdOnly(
            generalLedgerDefitions,
            [],
            glId
        )

        if (foundPath) {
            expandPath(foundPath)
            setTargetNodeId(foundPath[foundPath.length - 1])
        }
    }

    const { mutateAsync: addAccountsToGeneralDefinition } =
        useConnectAccountToGeneralLedgerDefinition({
            onSuccess: (generalLedgerDefinition) => {
                refetch?.()
                setAddAccountPickerModalOpen?.(false)
                hanldeFoundPath(generalLedgerDefinition.id)
            },
        })

    const { mutate: deleteGeneralLedgerDefinition } =
        useDeleteGeneralLedgerDefinition({
            onSuccess: () => {
                refetch?.()
                setSelectedGeneralLedgerDefinitionId?.(null)
                setSelectedGeneralLedgerDefinition?.(null)
                setOpenCreateGeneralLedgerModal?.(false)
            },
        })

    const { mutate: updateAccountIndex } = useUpdateAccountIndex({
        onSuccess: () => {
            refetch?.()
            setChangedAccounts?.([])
        },
    })

    const { mutate: removeGLAccount } = useDeleteAccountFromGLDefintion({
        onSuccess: () => {
            refetch?.()
            setAddAccountPickerModalOpen?.(false)
        },
    })

    const handleRemoveAccountFromGLDefinition = (accountId: TEntityId) => {
        if (accountId) {
            removeGLAccount(accountId)
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
            generalLedgerDefitions,
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
                generalLedgerDefinitionId: selectedGeneralLedgerDefinitionId,
                accountId: account.id,
            })
        } else {
            toast.error('Please select a General Ledger Definition first.')
        }
    }

    useEffect(() => {
        if (treeData ?? false) {
            setGEneralLedgerDefitions(treeData)
        }
    }, [treeData])

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

    const { selectedGeneralLedgerTypes } = useGeneralLedgerStore()

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

    if (!treeData || treeData.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No General Ledger data available.
            </div>
        )
    }

    return (
        <div className="w-full rounded-lg p-4 shadow-md">
            {selectedAccounts?.id && (
                <GeneralLedgerAccountsModal
                    open={openGeneralLedgerAccountTableModal}
                    onOpenChange={setOpenGeneralLedgerAccountTableModal}
                    title="General Ledger Accounts"
                    description="This is the general ledger based on selected account"
                    className="max-w-3xl"
                    accountId={selectedAccounts.id}
                />
            )}
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
                            generalDefinitionEntriesId,
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
                    onClick={addGeneralLedgerDefinition}
                    disabled={isReadOnly}
                >
                    <PlusIcon size={15} className="mr-2" />
                    Add GL
                </Button>
                <Input
                    type="text"
                    className="rounded-2xl"
                    placeholder="Search General Ledger..."
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
                    disabled={!isSearchOnChanged}
                >
                    <MagnifyingGlassIcon className="mr-2" />
                    Search
                </Button>
            </div>
            <div className="w-full flex items-center gap-x-2 justify-start">
                <Tooltip>
                    <TooltipTrigger>
                        <Button
                            size={'sm'}
                            variant={'outline'}
                            className="rounded-xl text-xs"
                            onClick={() => {
                                resetExpansion()
                            }}
                        >
                            <CollapseIcon />
                        </Button>
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
                    items={generalLedgerDefitions.map((ledger) => ledger.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {generalLedgerDefitions.map((node) => {
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
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default GeneralLedgerTreeViewer
