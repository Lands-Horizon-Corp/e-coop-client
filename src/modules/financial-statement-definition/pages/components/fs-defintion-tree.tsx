import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { sortBy } from '@/helpers/common-helper'
import {
    AccountCreateUpdateFormModal,
    FinancialStatementTypeEnum,
    useDeleteAccountFromGLFS,
    useUpdateAccountIndex,
} from '@/modules/account'
import { AccountPicker } from '@/modules/account'
import { IAccount } from '@/modules/account'
import {
    IFinancialStatementDefinition,
    useConnectAccount,
    useDeleteById,
    useUpdateIndex,
} from '@/modules/financial-statement-definition'
import { FinancialStatementCreateUpdateFormModal } from '@/modules/financial-statement-definition'
import { useFinancialStatementAccountsGroupingStore } from '@/store/financial-statement-accounts-grouping-store'
import { useGLFSStore } from '@/store/gl-fs-store'
import {
    DndContext,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { CollapseIcon, MagnifyingGlassIcon, PlusIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import { TEntityId, UpdateIndexRequest } from '@/types'

import FinancialStatementDefinitionNode from './fs-definition-node'

type FinancialStatementDefinitionTreeViewerProps = {
    treeData: IFinancialStatementDefinition[]
    refetch?: () => void
    isRefetchingGeneralLedgerAccountsGrouping?: boolean
}

const findNodePathByGlIdOnly = (
    nodes: IFinancialStatementDefinition[],
    path: string[] = [],
    glId: string
): string[] | null => {
    for (const node of nodes) {
        const newPath = [...path, node.id]

        if (node.id === glId) {
            return newPath
        }

        if (node.financial_statement_definition_entries) {
            const found = findNodePathByGlIdOnly(
                node.financial_statement_definition_entries,
                newPath,
                glId
            )
            if (found) return found
        }
    }

    return null
}

const findNodePathWithAccounts = (
    nodes: IFinancialStatementDefinition[],
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

        if (node.financial_statement_definition_entries) {
            const foundPath = findNodePathWithAccounts(
                node.financial_statement_definition_entries,
                newPath,
                searchTerm
            )
            if (foundPath) return foundPath
        }
    }
    return null
}

const FinancialStatementDefinitionTreeViewer = ({
    treeData,
    refetch,
    isRefetchingGeneralLedgerAccountsGrouping,
}: FinancialStatementDefinitionTreeViewerProps) => {
    const {
        // ── finacial statement Definition State ──
        financialStatementDefinition,
        setFinancialStatementDefinition,
        changedFinancialStatementItems,
        setChangedFinancialStatementItems,
        selectedFinancialStatementDefinitionId,
        setSelectedFinancialStatementDefinitionId,
        selectedFinancialStatementDefinition: node,
        setSelectedFinancialStatementDefinition,
        financialStatementDefinitionEntriesId,
        setFinancialStatementDefinitionEntriesId,
        selectedFinancialStatementTypes,

        // ── Modal Controls ──
        openCreateFinancialStatementModal,
        setOpenCreateFinancialStatementModal,

        // ── View & Interaction State ──
        onCreate,
        setOnCreate,
        isReadOnly,

        // ── Accounts Management ──
        moveFinancialStatementLedgerNode,
        financialStatementAccountsGroupingId,
    } = useFinancialStatementAccountsGroupingStore()

    const {
        selectedAccounts,
        openViewAccountModal,
        setViewAccountModalOpen,
        // // openGeneralLedgerAccountTableModal,
        // setOpenGeneralLedgerAccountTableModal,
        setChangedAccounts,
        expandPath,
        resetExpansion,
        setTargetNodeId,
        openAddAccountPickerModal,
        setAddAccountPickerModalOpen,
        changedAccounts,
    } = useGLFSStore()

    const [searchTerm, setSearchTerm] = useState('')
    const { mutate: updateIndex, isPending } = useUpdateIndex({
        options: {
            onSuccess: () => {
                refetch?.()
                setChangedFinancialStatementItems([])
                toast.success(
                    'Financial Statement Definition Accounts Grouping Index Updated'
                )
            },
        },
    })

    const hanldeFoundPath = (glId: TEntityId) => {
        const foundPath = findNodePathByGlIdOnly(
            financialStatementDefinition,
            [],
            glId
        )

        if (foundPath) {
            expandPath(foundPath)
            setTargetNodeId(foundPath[foundPath.length - 1])
        }
    }

    const { mutateAsync: addAccountsToFinancialStatementDefinition } =
        useConnectAccount({
            options: {
                onSuccess: (financialstatemnt) => {
                    refetch?.()
                    setAddAccountPickerModalOpen?.(false)
                    hanldeFoundPath(financialstatemnt.id)
                    toast.success(
                        'Account added to Financial Statement Definition'
                    )
                },
            },
        })

    const { mutate: deletefinancialStatementDefinition } = useDeleteById({
        options: {
            onSuccess: () => {
                refetch?.()
                toast.success('Financial Statement Definition Deleted')
                setSelectedFinancialStatementDefinitionId?.(null)
                setSelectedFinancialStatementDefinition?.(null)
                setOpenCreateFinancialStatementModal?.(false)
            },
        },
    })

    const { mutate: updateAccountIndex } = useUpdateAccountIndex({
        options: {
            onSuccess: () => {
                refetch?.()
                setChangedAccounts?.([])
                toast.success('Account Index Updated')
            },
        },
    })

    const { mutate: removeGLAccount } = useDeleteAccountFromGLFS({
        options: {
            onSuccess: () => {
                refetch?.()
                setAddAccountPickerModalOpen?.(false)
                toast.success(
                    'Account removed from Financial Statement Definition'
                )
            },
        },
    })

    const handleRemoveAccountFromFSDefinition = (accountId: TEntityId) => {
        if (accountId) {
            removeGLAccount({ id: accountId, mode: 'financial-statement' })
        }
    }

    const hanldeDeletefinancialStatementDefinitionEntriesId = (
        nodeId: TEntityId
    ) => {
        deletefinancialStatementDefinition(nodeId)
    }

    const topLevelSensors = useSensors(useSensor(PointerSensor))

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            resetExpansion()
            return
        }

        const path = findNodePathWithAccounts(
            financialStatementDefinition,
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
        if (account && selectedFinancialStatementDefinitionId) {
            await addAccountsToFinancialStatementDefinition({
                id: selectedFinancialStatementDefinitionId,
                accountId: account.id,
            })
        } else {
            toast.error('Please select a General Ledger Definition first.')
        }
    }

    useEffect(() => {
        if (treeData ?? false) {
            setFinancialStatementDefinition(treeData.sort(sortBy('index')))
        }
    }, [treeData, setFinancialStatementDefinition])

    const OnSuccessCreateUpdateFSModal = (
        financialStatementDefinition: IFinancialStatementDefinition
    ) => {
        refetch?.()
        setOpenCreateFinancialStatementModal?.(false)
        setSelectedFinancialStatementDefinition?.(null)
        setSelectedFinancialStatementDefinitionId?.(null)
        setFinancialStatementDefinitionEntriesId?.(undefined)

        hanldeFoundPath(financialStatementDefinition.id)
    }

    const addfinancialStatementDefinitionEntriesId = () => {
        setSelectedFinancialStatementDefinitionId?.(null)
        setOpenCreateFinancialStatementModal?.(true)
        resetExpansion()
        setSearchTerm('')
        setAddAccountPickerModalOpen?.(false)
        setTargetNodeId?.('')
        setSelectedFinancialStatementDefinition?.(null)
        setTimeout(() => {
            setOnCreate?.(true)
        }, 100)
        setFinancialStatementDefinitionEntriesId?.(undefined)
    }

    const handleUpdateOrder = (
        changedFinancialStatementItems: UpdateIndexRequest[],
        changedAccounts: UpdateIndexRequest[]
    ) => {
        if (changedAccounts.length > 0) {
            updateAccountIndex(changedAccounts)
        }
        if (changedFinancialStatementItems.length > 0) {
            updateIndex(changedFinancialStatementItems)
        }
    }

    const isSearchOnChanged = searchTerm.length > 0

    const createOrUpdateTitle = `${onCreate ? 'Create' : 'Update'} Financial Statement Definition`
    const createOrUpdateDescription = `Fill out the form to ${onCreate ? 'add a new' : 'edit'} General Ledger Definition.`

    const formDefaultValues = onCreate
        ? {
              financial_statement_type:
                  selectedFinancialStatementTypes ||
                  FinancialStatementTypeEnum.Assets,
          }
        : {
              ...node,
          }

    const financialStatementDefinitionId = onCreate
        ? undefined
        : (node?.id ?? undefined)

    const hasAnyOrderChanged = Boolean(
        changedFinancialStatementItems.length || changedAccounts.length
    )

    const isHandleOrderDisabled =
        !hasAnyOrderChanged ||
        isPending ||
        isRefetchingGeneralLedgerAccountsGrouping

    const hasChildren =
        (treeData?.length ?? 0) > 0 ||
        (financialStatementDefinition?.length ?? 0) > 0

    return (
        <div className="w-full rounded-lg p-4 shadow-md">
            {/* {selectedAccounts?.id && (
                <GeneralLedgerAccountsModal
                    open={openGeneralLedgerAccountTableModal}
                    onOpenChange={setOpenGeneralLedgerAccountTableModal}
                    title="Financial Statement Accounts"
                    description="This is the financial statement based on selected account"
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
            {financialStatementAccountsGroupingId && (
                <FinancialStatementCreateUpdateFormModal
                    onOpenChange={setOpenCreateFinancialStatementModal}
                    open={openCreateFinancialStatementModal}
                    title={createOrUpdateTitle}
                    description={createOrUpdateDescription}
                    formProps={{
                        defaultValues: formDefaultValues,
                        financialStatementDefinitionEntriesId:
                            financialStatementDefinitionEntriesId,
                        financialStatementAccountsGroupingId:
                            financialStatementAccountsGroupingId,
                        financialStatementId: financialStatementDefinitionId,
                        readOnly: isReadOnly,
                        onSuccess: OnSuccessCreateUpdateFSModal,
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
                    onClick={addfinancialStatementDefinitionEntriesId}
                    disabled={isReadOnly || isPending}
                >
                    <PlusIcon size={15} className="mr-2" />
                    Add FS
                </Button>
                <Input
                    type="text"
                    className="rounded-2xl"
                    placeholder="Search General Ledger..."
                    value={searchTerm}
                    disabled={isReadOnly || isPending || !hasChildren}
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
                    disabled={
                        !isSearchOnChanged ||
                        !hasChildren ||
                        isReadOnly ||
                        isPending
                    }
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
                            disabled={isReadOnly || isPending || !treeData}
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
                            changedFinancialStatementItems,
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
                    moveFinancialStatementLedgerNode(
                        [],
                        event.active.id,
                        event.over?.id || ''
                    )
                }
                collisionDetection={closestCorners}
            >
                <SortableContext
                    items={financialStatementDefinition.map(
                        (ledger) => ledger.id
                    )}
                    strategy={verticalListSortingStrategy}
                >
                    {treeData ? (
                        financialStatementDefinition
                            .sort(sortBy('index', 'asc'))
                            ?.map((node) => {
                                return (
                                    <FinancialStatementDefinitionNode
                                        key={node.id}
                                        node={node}
                                        depth={0}
                                        parentPath={[]}
                                        refetch={refetch}
                                        onDragEndNested={
                                            moveFinancialStatementLedgerNode
                                        }
                                        hanldeDeleteFinancialStatemenetDefinition={
                                            hanldeDeletefinancialStatementDefinitionEntriesId
                                        }
                                        handleRemoveAccountFromFSDefinition={
                                            handleRemoveAccountFromFSDefinition
                                        }
                                    />
                                )
                            })
                    ) : (
                        <div className="flex flex-col gap-y-5 items-center justify-center h-64">
                            <p>No Financial Statement Definitions found.</p>
                            <Button
                                variant="outline"
                                className="ml-4"
                                onClick={
                                    addfinancialStatementDefinitionEntriesId
                                }
                                disabled={isReadOnly}
                            >
                                <PlusIcon size={15} className="mr-2" />
                                Add Financial Statement Definition
                            </Button>
                        </div>
                    )}
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default FinancialStatementDefinitionTreeViewer
