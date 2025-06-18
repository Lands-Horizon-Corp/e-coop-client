import {
    GeneralLedgerFinancialStatementNodeType,
    IGeneralLedgerDefinition,
} from '@/types/coop-types/general-ledger-definitions'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { blueGradientPalette } from '@/components/color-palettes'
import { GeneralLedgerTypeBadge } from '@/components/badges/general-ledger-type-badge'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { AccountCreateUpdateFormModal } from '@/components/forms/accounting-forms/account-create-update-form'
import { GeneralLedgerDefinitionCreateUpdateFormModal } from '@/components/forms/general-ledger-definition/general-ledger-definition-create-update-form'

import {
    ArrowChevronDown,
    ArrowChevronRight,
    EditPencilIcon,
    EyeViewIcon,
    PlusIcon,
    TrashIcon,
} from '@/components/icons'

import { colorPalette } from '@/hooks/use-random-gradient'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useDeleteGeneralLedgerDefinition } from '@/hooks/api-hooks/general-ledger-definition/use-general-ledger-definition'

import { toast } from 'sonner'
import { useEffect, useRef, useState } from 'react'
import { useDrag, useDrop, XYCoord } from 'react-dnd'
import { useFinancialStatementStore } from '@/store/financial-statement-definition-store'

export interface IGeneralLedgerAccount extends IGeneralLedgerDefinition {
    type: GeneralLedgerFinancialStatementNodeType.ACCOUNT
}

export type GeneralLedgerTree = IGeneralLedgerDefinition | IGeneralLedgerAccount

export function addPositionIndexes(
    nodes: (IGeneralLedgerDefinition | IGeneralLedgerAccount)[]
) {
    nodes.forEach((node, idx) => {
        node.index = idx
        if (
            node.general_ledger_accounts &&
            node.general_ledger_accounts.length > 0
        ) {
            addPositionIndexes(node.general_ledger_accounts)
        }
    })
}

export function findNodeAndParent(
    tree: (IGeneralLedgerDefinition | IGeneralLedgerAccount)[],
    id: string,
    parent: IGeneralLedgerDefinition | IGeneralLedgerAccount | null = null
): {
    node: GeneralLedgerTree | null
    parent: GeneralLedgerTree | null
    index: number | null
} {
    for (let i = 0; i < tree.length; i++) {
        const current = tree[i]
        if (current.id === id) {
            return { node: current, parent: parent, index: i }
        }
        if (
            current.general_ledger_accounts &&
            current.general_ledger_accounts.length > 0
        ) {
            const found = findNodeAndParent(
                current.general_ledger_accounts,
                id,
                current
            )
            if (found.node) {
                return found
            }
        }
    }
    return { node: null, parent: null, index: null }
}

export function moveNodeInTree(
    tree: IGeneralLedgerDefinition[],
    draggedId: string,
    targetId: string
): IGeneralLedgerDefinition[] {
    const newTree = JSON.parse(JSON.stringify(tree))

    const {
        node: draggedNode,
        parent: draggedParent,
        index: draggedIndex,
    } = findNodeAndParent(newTree, draggedId)
    const {
        node: targetNode,
        parent: targetParent,
        index: targetIndex,
    } = findNodeAndParent(newTree, targetId)

    if (
        !draggedNode ||
        !targetNode ||
        !draggedParent ||
        !targetParent ||
        draggedIndex === null ||
        targetIndex === null
    ) {
        toast.warning(
            'Drag or target node/parent not found, or indices are null. Aborting move.'
        )
        return tree
    }

    if (draggedParent.id !== targetParent.id) {
        toast.warning(
            'Cannot drag between different parents (only sibling reordering allowed).'
        )
        return tree
    }

    const parentAccounts = draggedParent.general_ledger_accounts
    if (!parentAccounts) {
        toast.error('Parent accounts array is missing for dragged node.')
        return tree
    }

    const [removed] = parentAccounts.splice(draggedIndex, 1)
    parentAccounts.splice(targetIndex, 0, removed)

    addPositionIndexes(parentAccounts)

    return newTree
}

interface GeneralLedgerTreeNodeProps {
    node: GeneralLedgerTree
    depth: number
    onMoveNode: (draggedId: string, targetId: string) => void
}

const ItemTypes = {
    GL_NODE: 'gl_node',
}

const GeneralLedgerTreeNode = ({
    node,
    depth = 0,
    onMoveNode,
}: GeneralLedgerTreeNodeProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const { onOpen } = useConfirmModalStore()
    const [openCreateAccountModal, setOpenCreateAccountModal] = useState(false)
    const [openCreateGeneralLedgerModal, setOpenCreateGeneralLedgerModal] =
        useState(false)
    const [onCreate, setOnCreate] = useState(true)
    const [isReadOnly, setIsReadyOnly] = useState(false)
    const hasChildren =
        node.general_ledger_accounts && node.general_ledger_accounts.length > 0

    const canDrag = depth > 0

    const hasOnlyOneChild = node.general_ledger_accounts.length === 1

    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.GL_NODE,
        item: { id: node.id, parent_id: node.parent_id, index: node.index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: canDrag || hasOnlyOneChild,
    })

    const [, drop] = useDrop({
        accept: ItemTypes.GL_NODE,
        hover(
            item: { id: string; parent_id?: string; index: number },
            monitor
        ) {
            if (!ref.current || !canDrag) {
                return
            }

            if (item.parent_id === node.parent_id && item.id !== node.id) {
                const dragIndex = item.index
                const hoverIndex = node.index

                if (
                    typeof dragIndex === 'undefined' ||
                    typeof hoverIndex === 'undefined'
                ) {
                    console.warn(
                        'Drag or hover index is undefined. Skipping hover reorder.'
                    )
                    return
                }

                if (dragIndex === hoverIndex) {
                    return
                }

                const hoverBoundingRect = ref.current?.getBoundingClientRect()
                const hoverMiddleY =
                    (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
                const clientOffset = monitor.getClientOffset()
                const hoverClientY =
                    (clientOffset as XYCoord).y - hoverBoundingRect.top

                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                    return
                }
                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                    return
                }

                onMoveNode(item.id, node.id)

                item.index = hoverIndex
            }
        },
        canDrop: (item: { id: string; parent_id?: string; index: number }) => {
            return (
                canDrag &&
                item.id !== node.id &&
                item.parent_id === node.parent_id
            )
        },
    })

    drag(drop(ref))

    const {
        mutate: deleteGeneralLedgerDefinition,
        isPending: isDeletingGLDefinition,
    } = useDeleteGeneralLedgerDefinition()

    const isFirstLevel = depth === 0

    const isAccount =
        node.type === GeneralLedgerFinancialStatementNodeType.ACCOUNT

    const isDefinition =
        node.type === GeneralLedgerFinancialStatementNodeType.DEFINITION

    const childLength = node.general_ledger_accounts.length
    const {
        expandedNodeIds,
        targetNodeId,
        toggleNode,
        clearTargetNodeIdAfterScroll,
    } = useFinancialStatementStore()

    const isNodeExpanded = expandedNodeIds.has(node.id)

    useEffect(() => {
        if (targetNodeId === node.id && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
            clearTargetNodeIdAfterScroll(node.id)
        }
    }, [targetNodeId, node.id, clearTargetNodeIdAfterScroll])

    return (
        <div
            className={`${isFirstLevel ? '' : 'pt-1.5'} ${isDragging && canDrag ? 'rounded-lg border-2 border-primary' : ''} `}
        >
            <AccountCreateUpdateFormModal
                onOpenChange={setOpenCreateAccountModal}
                open={openCreateAccountModal}
            />
            <GeneralLedgerDefinitionCreateUpdateFormModal
                onOpenChange={setOpenCreateGeneralLedgerModal}
                open={openCreateGeneralLedgerModal}
                title={`${onCreate ? 'Create' : 'Update'} General Ledger Definition`}
                description={`Fill out the form to ${onCreate ? 'add a new' : 'edit'} General Ledger Definition.`}
                formProps={{
                    defaultValues: onCreate ? {} : node,
                    generalLedgerId: onCreate ? undefined : node.id,
                    readOnly: isReadOnly,
                }}
            />
            <div className={`flex flex-col`} ref={ref}>
                <GradientBackground
                    gradientOnly
                    opacity={0.3}
                    colorPalettes={
                        isAccount ? blueGradientPalette : colorPalette
                    }
                    className={`flex h-fit cursor-pointer items-center rounded-md px-3 py-2 transition-colors duration-200 ${isFirstLevel ? 'mt-1' : 'mt-0'} `}
                    onClick={() =>
                        hasChildren && toggleNode(node.id, !isNodeExpanded)
                    }
                >
                    {hasChildren && (
                        <div className="flex h-full items-center">
                            <span className="mr-2">
                                {isNodeExpanded ? (
                                    <ArrowChevronDown size={16} />
                                ) : (
                                    <ArrowChevronRight size={16} />
                                )}
                            </span>
                        </div>
                    )}
                    <div className="flex flex-1 flex-col">
                        <span
                            className={` ${isFirstLevel ? 'text-lg font-semibold' : `text-md ${isAccount ? 'text-sm font-normal' : 'font-semibold'}`}`}
                        >
                            <div className="flex items-center gap-x-2">
                                <p>{node.name}</p>
                                {!isFirstLevel && (
                                    <span className="text-xs text-accent-foreground/50">
                                        {node && node.general_ledger_type && (
                                            <GeneralLedgerTypeBadge
                                                type={node.general_ledger_type}
                                            />
                                        )}
                                        {!node ||
                                            (!node.general_ledger_type && (
                                                <div>
                                                    Loading type... or Type not
                                                    found
                                                </div>
                                            ))}
                                    </span>
                                )}
                            </div>
                        </span>
                        {node.description && (
                            <span className="text-xs text-accent-foreground/70">
                                {node.description}
                            </span>
                        )}

                        {isFirstLevel && (
                            <p className="text-xs text-accent-foreground/30">
                                {childLength} items
                            </p>
                        )}
                    </div>
                    {isDefinition || isAccount ? (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size={'sm'}
                                        className="border-0 text-xl"
                                    >
                                        +
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56"
                                    align="start"
                                >
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setIsReadyOnly(false)
                                                setOpenCreateAccountModal(true)
                                                setIsReadyOnly(false)
                                            }}
                                        >
                                            <PlusIcon className="mr-2">
                                                +
                                            </PlusIcon>
                                            Add Account
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setIsReadyOnly(false)
                                                setOnCreate(true)
                                                setOpenCreateGeneralLedgerModal(
                                                    true
                                                )
                                            }}
                                        >
                                            <PlusIcon className="mr-2">
                                                +
                                            </PlusIcon>
                                            Add GL Definition
                                        </DropdownMenuItem>
                                        {!isFirstLevel && (
                                            <div>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setOnCreate(false)
                                                        setOpenCreateGeneralLedgerModal(
                                                            true
                                                        )
                                                    }}
                                                >
                                                    <EditPencilIcon className="mr-2" />
                                                    edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setOnCreate(false)
                                                        setOpenCreateGeneralLedgerModal(
                                                            true
                                                        )
                                                        setIsReadyOnly(true)
                                                    }}
                                                >
                                                    <EyeViewIcon className="mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    disabled={
                                                        isDeletingGLDefinition
                                                    }
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onOpen({
                                                            title: `Delete  ${isDefinition ? 'definition' : 'Account'}`,
                                                            description: `You are about this ${isDefinition ? 'definition' : 'Account'}, are you sure you want to proceed?`,
                                                            onConfirm: () => {
                                                                deleteGeneralLedgerDefinition(
                                                                    node.id
                                                                )
                                                            },
                                                            confirmString:
                                                                'Proceed',
                                                        })
                                                    }}
                                                >
                                                    <TrashIcon className="mr-2 text-destructive" />
                                                    Remove
                                                </DropdownMenuItem>
                                            </div>
                                        )}
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        ''
                    )}
                </GradientBackground>
                {isNodeExpanded && hasChildren && (
                    <div className="ml-4">
                        {node.general_ledger_accounts!.map((childNode) => (
                            <GeneralLedgerTreeNode
                                key={childNode.id}
                                node={childNode}
                                depth={depth + 1}
                                onMoveNode={onMoveNode}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default GeneralLedgerTreeNode
