import { useEffect } from 'react'

import { toast } from 'sonner'

import { useUpdateIndex } from '@/modules/general-ledger-definition'
import {
    DndContext,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { PlusIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import { useGeneralLedgerDefinitionContext } from '../ context/general-ledger-context-provider'
import GLToolsBar from './actions-button'
import GeneralLedgerDefinitionHeaderSearch from './general-ledger-definition-header-search'
import GeneralLedgerDefinitionNode from './gl-definition-node'
import { buildPayload } from './gl-utils'

const GeneralLedgerDefinitionTreeViewer = () => {
    const {
        queries,
        modals,
        setChangedGeneralLedgerItems,
        moveGeneralLedgerNode,
        setGeneralLedgerDefinitions,
        generalLedgerDefinitions,
    } = useGeneralLedgerDefinitionContext()

    const { refetch, data: GeneralLedgerDefinitions } =
        queries.generalLedgerDefinitionQuery

    const { mutate: updateIndex } = useUpdateIndex({
        options: {
            onSuccess: () => {
                refetch?.()
                setChangedGeneralLedgerItems([])
                toast.success(
                    'General Ledger Definition Accounts Grouping Index Updated'
                )
            },
        },
    })

    // const hanldeFoundPath = (glId: TEntityId) => {
    //     const foundPath = findNodePathByGlIdOnly(
    //         generalLedgerDefinitions,
    //         [],
    //         glId
    //     )

    //     if (foundPath) {
    //         expandPath(foundPath)
    //         setTargetNodeId(foundPath[foundPath.length - 1])
    //     }
    // }

    const topLevelSensors = useSensors(useSensor(PointerSensor))

    useEffect(() => {
        if (!GeneralLedgerDefinitions) return
        setGeneralLedgerDefinitions(GeneralLedgerDefinitions)
    }, [GeneralLedgerDefinitions, setGeneralLedgerDefinitions])

    useEffect(() => {
        if (generalLedgerDefinitions) {
            updateIndex(buildPayload(generalLedgerDefinitions))
        }
    }, [generalLedgerDefinitions, updateIndex])

    return (
        <div className="w-full bg-card rounded-lg p-4">
            <GLToolsBar />
            <GeneralLedgerDefinitionHeaderSearch />
            <DndContext
                collisionDetection={closestCorners}
                onDragEnd={(event) =>
                    moveGeneralLedgerNode(
                        [],
                        event.active.id,
                        event.over?.id || ''
                    )
                }
                sensors={topLevelSensors}
            >
                <SortableContext
                    items={generalLedgerDefinitions?.map((ledger) => ledger.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {GeneralLedgerDefinitions ? (
                        <>
                            {generalLedgerDefinitions?.map((node) => {
                                return (
                                    <GeneralLedgerDefinitionNode
                                        depth={0}
                                        key={node.id}
                                        node={node}
                                        onDragEndNested={moveGeneralLedgerNode}
                                        parentPath={[]}
                                        refetch={refetch}
                                    />
                                )
                            })}
                        </>
                    ) : (
                        <div className="flex flex-col gap-y-5 items-center justify-center h-64">
                            <p>No Financial Statement Definitions found.</p>
                            <Button
                                className="ml-4 z-10"
                                onClick={(e) => {
                                    e.preventDefault()
                                    modals.glForm.onOpenChange(true)
                                }}
                                variant="outline"
                            >
                                <PlusIcon className="mr-2" size={15} />
                                Add General Ledger Definition
                            </Button>
                        </div>
                    )}
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default GeneralLedgerDefinitionTreeViewer
