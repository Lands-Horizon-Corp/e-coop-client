import { useEffect, useRef } from 'react'

import { useGeneralLedgerStore } from '@/store/general-ledger-accounts-groupings-store'
import { IGeneralLedgerDefinition } from '@/types/coop-types/general-ledger-definitions'
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

import { GeneralLedgerTypeBadge } from '@/components/badges/general-ledger-type-badge'
import {
    ArrowChevronDown,
    ArrowChevronRight,
    DragHandleIcon,
} from '@/components/icons'
import RawDescription from '@/components/raw-description'
import { Card } from '@/components/ui/card'

import GeneralLedgerDefinitionActions from './general-ledger-definition-actions'
import AccountsCardList from './gl-account-card'

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
}

const GeneralLedgerNode = ({
    node,
    depth = 0,
    handleOpenAccountPicker,
    onDragEndNested,
    parentPath,
}: GeneralLedgerTreeNodeProps) => {
    const ref = useRef<HTMLDivElement>(null)

    const {
        expandedNodeIds,
        targetNodeId,
        clearTargetNodeIdAfterScroll,
        toggleNode,
    } = useGeneralLedgerStore()

    const isNodeExpanded = expandedNodeIds.has(node.id)

    const dragHandleRef = useRef<HTMLDivElement>(null)

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

    const hasChildren =
        node.general_ledger_definition &&
        node.general_ledger_definition.length > 0

    const isFirstLevel = depth === 0
    const childLength = node.general_ledger_definition?.length
    const hasAccountNode = node.accounts && node.accounts.length > 0

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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={`${isFirstLevel ? '' : 'pt-1.5'} ${isDragging ? 'rounded-lg border-2 border-primary' : ''} `}
        >
            <div className={`flex flex-col`}>
                <Card
                    className={`flex h-fit border cursor-pointer bg-black items-center rounded-md px-3 py-2 duration-200 ${isFirstLevel ? 'mt-1' : 'mt-0'} `}
                    onClick={(event) => {
                        toggleAccordion(event)
                    }}
                    ref={ref}
                >
                    <div
                        ref={dragHandleRef}
                        {...listeners}
                        className="cursor-grab mr-2"
                    >
                        <DragHandleIcon size={16} />
                    </div>
                    {(hasChildren || hasAccountNode) && (
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
                            className={` ${isFirstLevel ? 'text-lg font-semibold' : `text-md font-semibold`}`}
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
                                <RawDescription content={node.description} />
                            </span>
                        )}

                        {isFirstLevel && (
                            <p className="text-xs text-accent-foreground/30">
                                {childLength}{' '}
                                {hasAccountNode && node.accounts?.length} items
                            </p>
                        )}

                        {isNodeExpanded &&
                            node.accounts &&
                            node.accounts.length > 0 && (
                                <AccountsCardList accounts={node.accounts} />
                            )}
                    </div>
                    <GeneralLedgerDefinitionActions node={node} />
                </Card>
                <DndContext
                    sensors={grandchildSensors}
                    onDragEnd={handleGrandchildDragEnd}
                    collisionDetection={closestCorners}
                >
                    {hasChildren && (
                        <SortableContext
                            items={
                                node.general_ledger_definition?.map(
                                    (gc) => gc.id
                                ) || []
                            }
                            strategy={verticalListSortingStrategy}
                        >
                            {hasChildren && (
                                <div className="ml-4">
                                    {node.general_ledger_definition?.map(
                                        (childNode) => (
                                            <GeneralLedgerNode
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

export default GeneralLedgerNode
