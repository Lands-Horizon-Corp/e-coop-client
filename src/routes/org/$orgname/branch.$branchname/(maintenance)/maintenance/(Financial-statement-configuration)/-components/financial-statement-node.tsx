import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import PlainTextEditor from '@/components/plain-text-editor'
import { blueGradientPalette } from '@/components/color-palettes'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { FinancialStatementTypeBadge } from '@/components/badges/financial-statement-type-badge'
import { FSDefinitionCreateUpdateFormModal } from '@/components/forms/financial-statement-definition/financial-statement-definition-create-update-form'

import {
    FinancialStatementTypeEnum,
    IFinancialStatementDefinition,
} from '@/types/coop-types/financial-statement-definition'
import { GeneralLedgerFinancialStatementNodeType } from '@/types/coop-types/general-ledger-definitions'

import { toast } from 'sonner'
import { useEffect, useRef, useState } from 'react'
import { useDrag, useDrop, XYCoord } from 'react-dnd'
import {
    ArrowChevronDown,
    ArrowChevronRight,
    EditPencilIcon,
    EyeViewIcon,
    PlusIcon,
    TrashIcon,
} from '@/components/icons'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useFinancialStatementStore } from '@/store/financial-statement-definition-store'

type FinancialStatementTreeNodeProps = {
    node: IFinancialStatementDefinition
    depth?: number
    handleOpenAccountPicker?: () => void
    onMoveNode: (draggedId: string, targetId: string) => void
}
export interface IFinancialStatementAccount
    extends IFinancialStatementDefinition {
    type: GeneralLedgerFinancialStatementNodeType.ACCOUNT
}

export type GeneralLedgerTree =
    | IFinancialStatementDefinition
    | IFinancialStatementAccount

const ItemTypes = {
    GL_NODE: 'gl_node',
}
export function addFSPositionIndexes(
    nodes: (IFinancialStatementDefinition | IFinancialStatementAccount)[]
) {
    nodes.forEach((node, idx) => {
        node.index = idx
        if (
            node.financial_statement_accounts &&
            node.financial_statement_accounts.length > 0
        ) {
            addFSPositionIndexes(node.financial_statement_accounts)
        }
    })
}

export function findFSNodeAndParent(
    tree: (IFinancialStatementDefinition | IFinancialStatementAccount)[],
    id: string,
    parent:
        | IFinancialStatementDefinition
        | IFinancialStatementAccount
        | null = null
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
            current.financial_statement_accounts &&
            current.financial_statement_accounts.length > 0
        ) {
            const found = findFSNodeAndParent(
                current.financial_statement_accounts,
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

export function moveFSNodeInTree(
    tree: IFinancialStatementDefinition[],
    draggedId: string,
    targetId: string
): IFinancialStatementDefinition[] {
    const newTree = JSON.parse(JSON.stringify(tree))

    const {
        node: draggedNode,
        parent: draggedParent,
        index: draggedIndex,
    } = findFSNodeAndParent(newTree, draggedId)
    const {
        node: targetNode,
        parent: targetParent,
        index: targetIndex,
    } = findFSNodeAndParent(newTree, targetId)

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

    const parentAccounts = draggedParent.financial_statement_accounts
    if (!parentAccounts) {
        toast.error('Parent accounts array is missing for dragged node.')
        return tree
    }

    const [removed] = parentAccounts.splice(draggedIndex, 1)
    parentAccounts.splice(targetIndex, 0, removed)

    addFSPositionIndexes(parentAccounts)

    return newTree
}

const FinancialStatementTreeNode = ({
    node,
    depth = 1,
    handleOpenAccountPicker,
    onMoveNode,
}: FinancialStatementTreeNodeProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const { onOpen } = useConfirmModalStore()
    const [openFSDefinition, setOpenFSDefinition] = useState(false)
    const [onCreate, setOnCreate] = useState(true)
    const [isReadOnly, setIsReadyOnly] = useState(false)

    const hasChildren =
        node.financial_statement_accounts &&
        node.financial_statement_accounts.length > 0

    const isFirstLevel = depth === 0

    const isAccount =
        node.type === GeneralLedgerFinancialStatementNodeType.ACCOUNT
    const isDefinition =
        node.type === GeneralLedgerFinancialStatementNodeType.DEFINITION

    const childLength = node.financial_statement_accounts.length

    const canDrag = depth > 0

    const hasOnlyOneChild = node.financial_statement_accounts.length === 1

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
        <div className={`${isFirstLevel ? '' : 'pt-1.5'} `}>
            <FSDefinitionCreateUpdateFormModal
                onOpenChange={setOpenFSDefinition}
                open={openFSDefinition}
                title={`${onCreate ? 'Create' : 'Update'} Financial Statement Definition`}
                description={`Fill out the form to ${onCreate ? 'add a new' : 'edit'} Financial Statement Definition.`}
                formProps={{
                    defaultValues: onCreate ? {} : node,
                    fsAccountId: onCreate ? undefined : node.id,
                    readOnly: isReadOnly,
                }}
            />
            <div className="flex flex-col" ref={ref}>
                <GradientBackground
                    gradientOnly
                    opacity={isAccount ? 0.3 : 0.3}
                    colorPalettes={isAccount ? blueGradientPalette : undefined}
                    className={`flex cursor-pointer items-center rounded-md px-3 py-2 transition-colors duration-200 ${isFirstLevel ? 'mt-1' : 'mt-0'} ${
                        isDragging && canDrag
                            ? 'rounded-lg border-2 border-primary'
                            : ''
                    }`}
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
                        <div
                            className={`flex items-center gap-x-2 ${
                                isFirstLevel
                                    ? 'gap-x-2 text-lg font-semibold'
                                    : `text-md ${isAccount ? 'text-sm font-normal' : 'font-semibold'}`
                            }`}
                        >
                            <p>{node.name}</p>
                            {!isFirstLevel && (
                                <span className="mt-1 text-xs text-accent-foreground/50">
                                    <FinancialStatementTypeBadge
                                        type={
                                            node.financial_statement_type ??
                                            FinancialStatementTypeEnum.Assets
                                        }
                                    />
                                </span>
                            )}
                        </div>
                        {isFirstLevel && (
                            <>
                                {node.description && (
                                    <span className="text-xs text-accent-foreground/70">
                                        <PlainTextEditor
                                            content={node.description}
                                        />
                                    </span>
                                )}
                            </>
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
                                                handleOpenAccountPicker?.()
                                            }}
                                        >
                                            <PlusIcon className="mr-2" />
                                            Add Account
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setOnCreate(true)
                                                setOpenFSDefinition(true)
                                                setIsReadyOnly(false)
                                            }}
                                        >
                                            <PlusIcon className="mr-2" />
                                            Add Financial Statement
                                        </DropdownMenuItem>
                                        {!isFirstLevel && (
                                            <>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setOpenFSDefinition(
                                                            true
                                                        )
                                                        setOnCreate(false)
                                                        setIsReadyOnly(false)
                                                    }}
                                                >
                                                    <EditPencilIcon className="mr-2" />
                                                    edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setIsReadyOnly(true)
                                                        setOpenFSDefinition(
                                                            true
                                                        )
                                                    }}
                                                >
                                                    <EyeViewIcon className="mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onOpen({
                                                            title: `Delete ${isDefinition ? 'Definition' : 'Account'}`,
                                                            description: `You are about this ${isDefinition ? 'definition' : 'Account'}, are you sure you want to proceed?`,
                                                            onConfirm: () => {},
                                                            confirmString:
                                                                'Proceed',
                                                        })
                                                    }}
                                                >
                                                    <TrashIcon className="mr-2 text-destructive" />
                                                    Remove
                                                </DropdownMenuItem>
                                            </>
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
                        {node.financial_statement_accounts!.map((childNode) => (
                            <FinancialStatementTreeNode
                                handleOpenAccountPicker={
                                    handleOpenAccountPicker
                                }
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

export default FinancialStatementTreeNode
