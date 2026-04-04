import { useEffect, useRef } from 'react'

import { cn } from '@/helpers'
import { glTypeStyleMap } from '@/modules/account/components/account-card'
import { IGeneralLedgerDefinition } from '@/modules/general-ledger-definition'
import { GeneralLedgerTypeBadge } from '@/modules/general-ledger/components/general-ledger-type-badge'
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

import {
    ArrowChevronDown,
    ArrowChevronRight,
    DragHandleIcon,
} from '@/components/icons'

import { TEntityId } from '@/types'

import { useGeneralLedgerDefinitionContext } from '../ context/general-ledger-context-provider'
import GeneralLedgerDefinitionActions from './actions/gl-definition-actions'
import GLFSAccountsCardList from './gl-account-list'

interface GeneralLedgerTreeNodeProps {
    node: IGeneralLedgerDefinition
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
    isDeletingGLDefinition?: boolean
}

const GeneralLedgerDefinitionNode = ({
    node,
    depth = 0,
    handleOpenAccountPicker,
    onDragEndNested,
    parentPath,
    isDeletingGLDefinition,
}: GeneralLedgerTreeNodeProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const dragHandleRef = useRef<HTMLDivElement>(null)

    const {
        queries,
        expandedNodeIds,
        targetNodeId,
        clearTargetNodeIdAfterScroll,
        toggleNode,
    } = useGeneralLedgerDefinitionContext()

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
        node.general_ledger_definition_entries &&
        node.general_ledger_definition_entries.length > 0

    const isFirstLevel = node.depth === 0
    const childLength = node.general_ledger_definition_entries?.length
    const hasAccountNode = node.accounts && node.accounts.length > 0

    const firstLevelItemLabel = childLength
        ? `${childLength} item${childLength > 1 ? 's' : ''}`
        : ''

    // const firstLevelAccountsLabel = hasAccountNode
    //     ? `${node.accounts?.length ?? 0} account${(node.accounts?.length ?? 0) > 1 ? 's' : ''}`
    //     : ''

    if (node.general_ledger_definition_entry_id && isFirstLevel) {
        return null
    }
    const showGLFSAccountsCardList =
        isNodeExpanded && hasAccountNode && node.accounts

    const showExpanded = hasChildren || hasAccountNode

    const showGLDefinitionNode = isNodeExpanded && hasChildren

    if (node.general_ledger_definition_entry_id && isFirstLevel) {
        return null
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={cn(
                `'pb-3  bg-background p-2 mt-2 px-0'} ${isDragging ? 'rounded-lg border-2 border-primary ' : ''}   `,
                node.general_ledger_type
                    ? glTypeStyleMap[node.general_ledger_type].border
                    : ''
            )}
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
                    <GeneralLedgerDefinitionActions
                        canDelete={hasAccountNode || hasChildren}
                        depth={depth}
                        hanldeDeleteGeneralLedgerDefinition={(
                            nodeId: TEntityId
                        ) => {
                            queries.deleteGLQuery.mutate(nodeId)
                        }}
                        isDeletingGLDefinition={isDeletingGLDefinition}
                        node={node}
                    />
                </div>
                <div className="flex flex-1 flex-col">
                    <span>
                        <div className="flex items-center gap-x-2">
                            <h1
                                className={` ${isFirstLevel ? 'text-xl font-semibold' : `text-md font-semibold`}`}
                            >
                                {node.name}
                                {/* {node.id} */}
                            </h1>
                            {!isFirstLevel && (
                                <span className="text-xs /50">
                                    {node?.general_ledger_type && (
                                        <GeneralLedgerTypeBadge
                                            type={node.general_ledger_type}
                                        />
                                    )}
                                </span>
                            )}
                        </div>
                    </span>
                    {/* {node.description && (
                        <span className="text-xs /70">
                            <PlainTextEditor content={node.description} />
                        </span>
                    )} */}
                    {isFirstLevel && (
                        <p className="text-xs /30">
                            {firstLevelItemLabel}
                            {childLength && hasAccountNode ? ' • ' : ''}
                            {/* {firstLevelAccountsLabel} */}
                        </p>
                    )}
                </div>
            </div>
            <div className={`w-full ${isNodeExpanded ? 'pl-5 pr-5' : ''}`}>
                {Array.isArray(showGLFSAccountsCardList) && (
                    <GLFSAccountsCardList
                        accounts={showGLFSAccountsCardList}
                        generalLedgerId={node.id}
                    />
                )}
                <DndContext
                    collisionDetection={closestCorners}
                    onDragEnd={handleGrandchildDragEnd}
                    sensors={grandchildSensors}
                >
                    {hasChildren && (
                        <SortableContext
                            items={
                                node.general_ledger_definition_entries?.map(
                                    (gc) => gc.id
                                ) || []
                            }
                            strategy={verticalListSortingStrategy}
                        >
                            {showGLDefinitionNode && (
                                <div className="ml-4">
                                    {node.general_ledger_definition_entries?.map(
                                        (childNode) => (
                                            <GeneralLedgerDefinitionNode
                                                depth={depth + 1}
                                                handleOpenAccountPicker={
                                                    handleOpenAccountPicker
                                                }
                                                isDeletingGLDefinition={
                                                    isDeletingGLDefinition
                                                }
                                                key={childNode.id}
                                                node={childNode}
                                                onDragEndNested={
                                                    onDragEndNested
                                                }
                                                parentPath={[
                                                    ...parentPath,
                                                    node.id,
                                                ]}
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

export default GeneralLedgerDefinitionNode
