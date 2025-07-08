import { useRef } from 'react'

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

import {
    ArrowChevronDown,
    ArrowChevronRight,
    DragHandleIcon,
} from '@/components/icons'
import RawDescription from '@/components/raw-description'

import GeneralLedgerDefinitionActions from './general-ledger-definition-actions'
import GeneralLedgerNode from './general-ledger-definition-node'

type GeneralLedgerDefinitionParentNodeProps = {
    generalLedgerDefinition: IGeneralLedgerDefinition
    onDragEndNested: (
        path: string[],
        oldIndex: number | string,
        newIndex: number | string
    ) => void
    refetch?: () => void
}
const GeneralLedgerDefinitionParentNode = ({
    generalLedgerDefinition,
    onDragEndNested,
    refetch,
}: GeneralLedgerDefinitionParentNodeProps) => {
    const dragHandleRef = useRef<HTMLDivElement>(null)

    const { expandedNodeIds, toggleNode } = useGeneralLedgerStore()

    const isNodeExpanded = expandedNodeIds.has(generalLedgerDefinition.id)

    const hasChildren =
        generalLedgerDefinition.general_ledger_definition &&
        generalLedgerDefinition.general_ledger_definition.length > 0

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: generalLedgerDefinition.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const childSensors = useSensors(useSensor(PointerSensor))

    const handleChildDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over?.id) {
            onDragEndNested([generalLedgerDefinition.id], active.id, over.id)
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
        if (hasChildren) {
            toggleNode(generalLedgerDefinition.id, !isNodeExpanded)
        }
    }

    const childLength =
        generalLedgerDefinition.general_ledger_definition?.length

    const generalLegerData = generalLedgerDefinition.general_ledger_definition

    const hasGeneralChildren =
        generalLedgerDefinition.general_ledger_definition &&
        generalLedgerDefinition.general_ledger_definition?.length > 0

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            onClick={(e) => toggleAccordion(e)}
            className={`bg-background relative rounded-lg p-4 m-2 shadow-md cursor-pointer hover:bg-background/80 transition-colors duration-200 ${isDragging ? 'opacity-50 border-primary border-2' : ''}`}
            data-testid="general-ledger-definition-node"
        >
            <div className="flex items-center gap-2">
                <div
                    ref={dragHandleRef}
                    {...listeners}
                    className="cursor-grab mr-2"
                >
                    <DragHandleIcon size={16} />
                </div>
                {hasChildren && (
                    <div className="flex h-full items-center ">
                        <span className="mr-2">
                            {isNodeExpanded ? (
                                <ArrowChevronDown size={16} />
                            ) : (
                                <ArrowChevronRight size={16} />
                            )}
                        </span>
                    </div>
                )}
                <div className="grow flex flex-col">
                    <h1 className="font-bold text-xl">
                        {generalLedgerDefinition.name}
                    </h1>
                    {generalLedgerDefinition.description && (
                        <span className="text-xs text-accent-foreground/70">
                            <RawDescription
                                content={generalLedgerDefinition.description}
                            />
                        </span>
                    )}
                    {hasChildren && (
                        <p className="text-xs text-accent-foreground/30">
                            {childLength} items
                        </p>
                    )}
                </div>
                <GeneralLedgerDefinitionActions
                    refetch={refetch}
                    node={generalLedgerDefinition}
                />
            </div>
            {hasChildren && isNodeExpanded && (
                <DndContext
                    sensors={childSensors}
                    onDragEnd={handleChildDragEnd}
                    collisionDetection={closestCorners}
                >
                    {hasGeneralChildren && (
                        <SortableContext
                            items={
                                generalLedgerDefinition.general_ledger_definition?.map(
                                    (child) => child.id
                                ) || []
                            }
                            strategy={verticalListSortingStrategy}
                        >
                            <div
                                className={`ml-2 mt-3 p-3 w-full rounded-md bg-background `}
                            >
                                <p className="text-xs text-accent-foreground/30">
                                    {childLength} items
                                </p>
                                {generalLegerData?.map((child) => (
                                    <GeneralLedgerNode
                                        key={child.id}
                                        node={child}
                                        parentPath={[
                                            generalLedgerDefinition.id,
                                        ]}
                                        onDragEndNested={onDragEndNested}
                                        depth={0}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    )}
                </DndContext>
            )}
        </div>
    )
}

export default GeneralLedgerDefinitionParentNode
