import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useGeneralLedgerStore } from '@/store/general-ledger-accounts-groupings-store'
import { IAccount } from '@/types/coop-types/accounts/account'
import { IGeneralLedgerDefinition } from '@/types/coop-types/general-ledger-definitions'
import {
    DndContext,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { MagnifyingGlassIcon } from '@/components/icons'
import AccountPicker from '@/components/pickers/account-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useConnectAccountToGeneralLedgerDefinition } from '@/hooks/api-hooks/general-ledger-accounts-groupings/use-general-ledger-accounts-groupings'

import GeneralLedgerDefinitionParentNode from './general-ledger-definition-parent-node'

type GeneralLedgerTreeViewerProps = {
    treeData: IGeneralLedgerDefinition[]
    refetch?: () => void
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
}: GeneralLedgerTreeViewerProps) => {
    const {
        setGEneralLedgerDefitions,
        generalLedgerDefitions,
        expandPath,
        setTargetNodeId,
        resetExpansion,
        setAddAccountPickerModalOpen,
        openAddAccountPickerModal,
        selectedGeneralLedgerDefinitionId,
    } = useGeneralLedgerStore()

    const [searchTerm, setSearchTerm] = useState('')

    const moveNode = useGeneralLedgerStore(
        (state) => state.moveGeneralLedgerNode
    )
    const { mutateAsync: addAccountsToGeneralDefinition, isSuccess } =
        useConnectAccountToGeneralLedgerDefinition()

    useEffect(() => {
        if (treeData ?? false) {
            setGEneralLedgerDefitions(treeData)
        }
    }, [treeData])

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

    const topLevelSensors = useSensors(useSensor(PointerSensor))

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

    if (!treeData || treeData.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No General Ledger data available.
            </div>
        )
    }

    const isSearchOnChanged = searchTerm.length > 0

    return (
        <div className="w-full rounded-lg p-4 shadow-md">
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
                            <GeneralLedgerDefinitionParentNode
                                key={node.id}
                                generalLedgerDefinition={node}
                                onDragEndNested={moveNode}
                                refetch={refetch}
                            />
                        )
                    })}
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default GeneralLedgerTreeViewer
