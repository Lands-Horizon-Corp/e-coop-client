import { useEffect, useRef } from 'react'

import {
    FinancialStatementDefinitionActions,
    IFinancialStatementDefinition,
} from '@/modules/financial-statement-definition'
import GLFSAccountsCardList from '@/modules/gl-fs/components/gl-account-list'
import { useGLFSStore } from '@/store/gl-fs-store'
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { FinancialStatementTypeBadge } from '@/components/badges/financial-statement-type-badge'
import {
    ArrowChevronDown,
    ArrowChevronRight,
    DragHandleIcon,
} from '@/components/icons'
import { PlainTextEditor } from '@/components/ui/text-editor'

import { TEntityId } from '@/types'

interface FinancialStatementTreeNodeProps {
    node: IFinancialStatementDefinition
    handleOpenAccountPicker?: () => void
    parentPath: string[]
    onDragEndNested: (
        path: string[],
        oldIndex: number | string,
        newIndex: number | string
    ) => void
    renderNestedAsSimpleList?: boolean
    depth?: number
    refetch?: () => void
    isDeletingFSDefinition?: boolean
    hanldeDeleteFinancialStatemenetDefinition: (id: TEntityId) => void
    handleRemoveAccountFromFSDefinition: (accountId: TEntityId) => void
}

const FinancialStatementDefinitionNode = ({
    node,
    depth = 0,
    handleOpenAccountPicker,
    onDragEndNested,
    parentPath,
    isDeletingFSDefinition,
    hanldeDeleteFinancialStatemenetDefinition,
    handleRemoveAccountFromFSDefinition,
}: FinancialStatementTreeNodeProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const dragHandleRef = useRef<HTMLDivElement>(null)

    const {
        expandedNodeIds,
        targetNodeId,
        clearTargetNodeIdAfterScroll,
        toggleNode,
    } = useGLFSStore()

    const isNodeExpanded = expandedNodeIds.has(node.id)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: node.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const grandchildSensors = useSensors(useSensor(PointerSensor))

    const handleGrandchildDragEnd = (event: DragEndEvent) => {
        const { active, over = { id: '' } } = event
        if (over && active.id !== over.id) {
            const currentPath = [...parentPath, node.id]
            onDragEndNested(currentPath, active.id, over.id)
        }
    }

    const toggleAccordion = (e: React.MouseEvent) => {
        if (
            dragHandleRef.current &&
            dragHandleRef.current.contains(e.target as Node)
        ) {
            return
        }
        e.stopPropagation()
        if (hasChildren || hasAccountNode) {
            toggleNode(node.id, !isNodeExpanded)
        }
    }

    useEffect(() => {
        if (targetNodeId === node.id && ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
            clearTargetNodeIdAfterScroll(node.id)
        }
    }, [targetNodeId, node.id, clearTargetNodeIdAfterScroll])

    const hasChildren =
        node.financial_statement_definition_entries &&
        node.financial_statement_definition_entries.length > 0

    const isFirstLevel = depth === 0
    const childLength = node.financial_statement_definition_entries?.length
    const hasAccountNode = node.accounts && node.accounts.length > 0

    const firstLevelItemLabel = childLength
        ? `${childLength} item${childLength > 1 ? 's' : ''}`
        : ''

    const firstLevelAccountsLabel = hasAccountNode
        ? `${node.accounts?.length ?? 0} account${(node.accounts?.length ?? 0) > 1 ? 's' : ''}`
        : ''

    if (node.financial_statement_definition_entries_id && isFirstLevel) {
        return null
    }
    const showGLFSAccountsCardList =
        isNodeExpanded && hasAccountNode && node.accounts

    const showExpanded = hasChildren || hasAccountNode

    const showGLDefinitionNode = isNodeExpanded && hasChildren

    if (node.financial_statement_definition_entries_id && isFirstLevel) {
        return null
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={` ${isFirstLevel ? 'dark:border-0 py-5 pl-0 rounded-lg mt-1 border-[1px] border-gray-400/30 dark:bg-background shadow-sm' : 'pt-1.5 pb-3  border-[1px] border-gray-500/40 bg-gray-100 dark:bg-black pl-0 rounded-lg mt-2 px-0'} ${isDragging ? 'rounded-lg border-2 border-primary ' : ''} `}
        >
            <div
                className={`flex h-fit cursor-pointer items-center px-3 `}
                onClick={(event) => {
                    toggleAccordion(event)
                }}
                ref={ref}
            >
                <div className="flex items-center justify-center mr-2">
                    <div
                        ref={dragHandleRef}
                        {...listeners}
                        className="cursor-grab mr-2"
                    >
                        <DragHandleIcon size={16} />
                    </div>
                    {showExpanded && (
                        <div className="flex h-full  items-center">
                            <span className="mr-2">
                                {isNodeExpanded ? (
                                    <ArrowChevronDown size={16} />
                                ) : (
                                    <ArrowChevronRight size={16} />
                                )}
                            </span>
                        </div>
                    )}
                    <FinancialStatementDefinitionActions
                        depth={depth}
                        canDelete={hasAccountNode || hasChildren}
                        node={node}
                        isDeletingFSDefinition={isDeletingFSDefinition}
                        hanldeDeleteFinancialStatemenetDefinition={(
                            nodeId: TEntityId
                        ) => {
                            hanldeDeleteFinancialStatemenetDefinition(nodeId)
                        }}
                    />
                </div>
                <div className="flex flex-1 flex-col">
                    <span>
                        <div className="flex items-center gap-x-2">
                            <h1
                                className={` ${isFirstLevel ? 'text-xl font-semibold' : `text-md font-semibold`}`}
                            >
                                {node.name}
                            </h1>
                            {!isFirstLevel && (
                                <span className="text-xs text-accent-foreground/50">
                                    {node?.financial_statement_type && (
                                        <FinancialStatementTypeBadge
                                            type={node.financial_statement_type}
                                        />
                                    )}
                                </span>
                            )}
                        </div>
                    </span>
                    {node.description && (
                        <span className="text-xs text-accent-foreground/70">
                            <PlainTextEditor content={node.description} />
                        </span>
                    )}

                    {isFirstLevel && (
                        <p className="text-xs text-accent-foreground/30">
                            {firstLevelItemLabel}
                            {childLength && hasAccountNode ? ' • ' : ''}
                            {firstLevelAccountsLabel}
                        </p>
                    )}
                </div>
            </div>

            <div className={`w-full ${isNodeExpanded ? 'pl-5 pr-5' : ''}`}>
                {Array.isArray(showGLFSAccountsCardList) && (
                    <GLFSAccountsCardList
                        removeAccount={handleRemoveAccountFromFSDefinition}
                        accounts={showGLFSAccountsCardList}
                    />
                )}
                <DndContext
                    sensors={grandchildSensors}
                    onDragEnd={handleGrandchildDragEnd}
                    collisionDetection={closestCorners}
                >
                    {hasChildren && (
                        <SortableContext
                            items={
                                node.financial_statement_definition_entries?.map(
                                    (gc) => gc.id
                                ) || []
                            }
                            strategy={verticalListSortingStrategy}
                        >
                            {showGLDefinitionNode && (
                                <div className="ml-4">
                                    {node.financial_statement_definition_entries?.map(
                                        (childNode) => (
                                            <FinancialStatementDefinitionNode
                                                key={childNode.id}
                                                handleOpenAccountPicker={
                                                    handleOpenAccountPicker
                                                }
                                                parentPath={[
                                                    ...parentPath,
                                                    node.id,
                                                ]}
                                                onDragEndNested={
                                                    onDragEndNested
                                                }
                                                hanldeDeleteFinancialStatemenetDefinition={
                                                    hanldeDeleteFinancialStatemenetDefinition
                                                }
                                                isDeletingFSDefinition={
                                                    isDeletingFSDefinition
                                                }
                                                handleRemoveAccountFromFSDefinition={
                                                    handleRemoveAccountFromFSDefinition
                                                }
                                                node={childNode}
                                                depth={depth + 1}
                                            />
                                        )
                                    )}
                                </div>
                            )}
                        </SortableContext>
                    )}
                </DndContext>
            </div>
        </div>
    )
}

export default FinancialStatementDefinitionNode
