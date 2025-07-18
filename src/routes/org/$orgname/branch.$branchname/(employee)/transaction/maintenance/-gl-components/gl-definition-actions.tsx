import { GENERAL_LEDGER_DEFINITION_MAX_DEPTH } from '@/constants'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useGeneralLedgerAccountsGroupingStore } from '@/store/general-ledger-accounts-groupings-store'
import { useGLFSStore } from '@/store/gl-fs-store'
import { IGeneralLedgerDefinition } from '@/types/coop-types/general-ledger-definitions'

import {
    DotsHorizontalIcon,
    EditPencilIcon,
    EyeViewIcon,
    PlusIcon,
    TrashIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { TEntityId } from '@/types'

type GeneralLedgerDefinitionActionsProps = {
    node: IGeneralLedgerDefinition
    canDelete?: boolean
    depth: number
    hanldeDeleteGeneralLedgerDefinition: (id: TEntityId) => void
    isDeletingGLDefinition?: boolean
}

type ActionType = 'addAccount' | 'addGL' | 'edit' | 'view' | 'remove'

const GeneralLedgerDefinitionActions = ({
    node,
    canDelete,
    depth,
    hanldeDeleteGeneralLedgerDefinition,
    isDeletingGLDefinition,
}: GeneralLedgerDefinitionActionsProps) => {
    const { onOpen } = useConfirmModalStore()

    const {
        setSelectedGeneralLedgerDefinitionId,
        setOnCreate,
        setOpenCreateGeneralLedgerModal,
        setIsReadyOnly,
        setSelectedGeneralLedgerDefinition,
        setGeneralLedgerDefinitionEntriesId,
    } = useGeneralLedgerAccountsGroupingStore()

    const { setAddAccountPickerModalOpen } = useGLFSStore()

    const handleGeneralLedgerAction = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        action: ActionType,
        nodeId?: TEntityId
    ) => {
        e.stopPropagation()
        e.preventDefault()
        setIsReadyOnly?.(false)

        switch (action) {
            case 'addAccount':
                setAddAccountPickerModalOpen?.(true)
                setSelectedGeneralLedgerDefinitionId?.(node.id)
                break

            case 'addGL':
                setOnCreate?.(true)
                setOpenCreateGeneralLedgerModal?.(true)
                setSelectedGeneralLedgerDefinition?.(null)
                setGeneralLedgerDefinitionEntriesId?.(node.id)
                break

            case 'edit':
                setOnCreate?.(false)
                setOpenCreateGeneralLedgerModal?.(true)
                setSelectedGeneralLedgerDefinition?.(node)
                setSelectedGeneralLedgerDefinitionId?.(node.id)
                break

            case 'view':
                setOnCreate?.(false)
                setIsReadyOnly?.(true)
                setSelectedGeneralLedgerDefinition?.(node)
                setOpenCreateGeneralLedgerModal?.(true)
                break
            case 'remove':
                onOpen({
                    title: `Delete this GL Definition`,
                    description: `You are about to delete this GL Definition, are you sure you want to proceed?`,
                    onConfirm: () => {
                        if (
                            typeof hanldeDeleteGeneralLedgerDefinition ===
                            'function'
                        )
                            if (nodeId) {
                                hanldeDeleteGeneralLedgerDefinition(nodeId)
                            }
                    },
                    confirmString: 'Proceed',
                })
        }
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size={'sm'}
                        className="border-0 !px-0 bg-transparent text-xl"
                    >
                        <DotsHorizontalIcon className="h-5 w-5 rotate-90" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={(e) =>
                                handleGeneralLedgerAction(e, 'addAccount')
                            }
                        >
                            <PlusIcon className="mr-2">+</PlusIcon>
                            Add Account
                        </DropdownMenuItem>
                        {depth < GENERAL_LEDGER_DEFINITION_MAX_DEPTH && (
                            <DropdownMenuItem
                                onClick={(e) =>
                                    handleGeneralLedgerAction(e, 'addGL')
                                }
                            >
                                <PlusIcon className="mr-2" />
                                Add GL Definition
                            </DropdownMenuItem>
                        )}
                        <div>
                            <DropdownMenuItem
                                onClick={(e) =>
                                    handleGeneralLedgerAction(e, 'edit')
                                }
                            >
                                <EditPencilIcon className="mr-2" />
                                edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) =>
                                    handleGeneralLedgerAction(e, 'view')
                                }
                            >
                                <EyeViewIcon className="mr-2" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={isDeletingGLDefinition || canDelete}
                                onClick={(e) =>
                                    handleGeneralLedgerAction(
                                        e,
                                        'remove',
                                        node.id
                                    )
                                }
                            >
                                <TrashIcon className="mr-2 text-destructive" />
                                Remove
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default GeneralLedgerDefinitionActions
