import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useGeneralLedgerStore } from '@/store/general-ledger-accounts-groupings-store'
import { IAccount } from '@/types/coop-types/accounts/account'
import {
    IGeneralLedgerDefinition,
    IGeneralLedgerUpdateIndexRequest,
} from '@/types/coop-types/general-ledger-definitions'
import {
    DndContext,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { GeneralLedgerDefinitionCreateUpdateFormModal } from '@/components/forms/general-ledger-definition/general-ledger-definition-create-update-form'
import { MagnifyingGlassIcon } from '@/components/icons'
import AccountPicker from '@/components/pickers/account-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import {
    useConnectAccountToGeneralLedgerDefinition,
    useUpdateIndexGeneralLedgerDefinition,
} from '@/hooks/api-hooks/general-ledger-definitions/use-general-ledger-definition'

import GeneralLedgerDefinitionNode from './gl-definition-node'

type GeneralLedgerTreeViewerProps = {
    treeData: IGeneralLedgerDefinition[]
    refetch?: () => void
    isRefetchingGeneralLedgerAccountsGrouping?: boolean
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
        onCreate,
        isReadOnly,
        expandPath,
        resetExpansion,
        setTargetNodeId,
        generalLedgerDefitions,
        openAddAccountPickerModal,
        setGEneralLedgerDefitions,
        setAddAccountPickerModalOpen,
        openCreateGeneralLedgerModal,
        setOpenCreateGeneralLedgerModal,
        selectedGeneralLedgerDefinitionId,
        selectedGeneralLedgerDefinition: node,
        changedGeneralLedgerItems,
        setChangedGeneralLedgerItems,
    } = useGeneralLedgerStore()

    const [searchTerm, setSearchTerm] = useState('')

    const { mutateAsync: updateIndex, isPending } =
        useUpdateIndexGeneralLedgerDefinition({
            onSuccess: () => {
                refetch?.()
                setChangedGeneralLedgerItems([])
                toast.success(
                    'General Ledger Definition Accounts Grouping Index Updated'
                )
            },
        })

    const { mutateAsync: addAccountsToGeneralDefinition, isSuccess } =
        useConnectAccountToGeneralLedgerDefinition({
            onSuccess: () => {
                refetch?.()
            },
        })

    const moveNode = useGeneralLedgerStore(
        (state) => state.moveGeneralLedgerNode
    )

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

            if (isSuccess) {
                refetch?.()
                setAddAccountPickerModalOpen?.(false)
            }
        }
    }

    useEffect(() => {
        if (treeData ?? false) {
            setGEneralLedgerDefitions(treeData)
        }
    }, [treeData])

    if (!treeData || treeData.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No General Ledger data available.
            </div>
        )
    }

    const isSearchOnChanged = searchTerm.length > 0

    const handleUpdateIndex = async (
        changedGeneralLedgerItems: IGeneralLedgerUpdateIndexRequest[]
    ) => {
        await updateIndex(changedGeneralLedgerItems)
    }

    const hasChangedItems = changedGeneralLedgerItems.length > 0

    return (
        <div className="w-full rounded-lg p-4 shadow-md">
            {node && openCreateGeneralLedgerModal && (
                <GeneralLedgerDefinitionCreateUpdateFormModal
                    onOpenChange={setOpenCreateGeneralLedgerModal}
                    open={openCreateGeneralLedgerModal}
                    title={`${onCreate ? 'Create' : 'Update'} General Ledger Definition`}
                    description={`Fill out the form to ${onCreate ? 'add a new' : 'edit'} General Ledger Definition.`}
                    formProps={{
                        defaultValues: onCreate ? {} : node,
                        generalLedgerDefinitionEntriesId:
                            node.general_ledger_definition_entries_id ??
                            node.id,
                        generalLedgerAccountsGroupingId:
                            node.general_ledger_accounts_grouping_id,
                        generalLedgerDefinitionId: onCreate
                            ? undefined
                            : node.id,
                        readOnly: isReadOnly,
                        onSuccess: () => {
                            refetch?.()
                        },
                    }}
                />
            )}

            <AccountPicker
                open={openAddAccountPickerModal}
                onOpenChange={setAddAccountPickerModalOpen}
                modalOnly
                onSelect={handleAccountSelection}
            />
            <div className="flex gap-2 py-4">
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
                <Button
                    disabled={
                        !hasChangedItems ||
                        isPending ||
                        isRefetchingGeneralLedgerAccountsGrouping
                    }
                    className="rounded-xl"
                    size="sm"
                    onClick={() => handleUpdateIndex(changedGeneralLedgerItems)}
                >
                    {isPending ? (
                        <LoadingSpinner className="animate-spin" />
                    ) : (
                        'Save Changes'
                    )}
                </Button>
            </div>
            <DndContext
                sensors={topLevelSensors}
                onDragEnd={(event) =>
                    moveNode([], event.active.id, event.over?.id || '')
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
                                onDragEndNested={moveNode}
                            />
                        )
                    })}
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default GeneralLedgerTreeViewer
