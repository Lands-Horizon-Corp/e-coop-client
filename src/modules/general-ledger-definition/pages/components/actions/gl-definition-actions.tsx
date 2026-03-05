import { GENERAL_LEDGER_DEFINITION_MAX_DEPTH } from '@/constants'
import { IGeneralLedgerDefinition } from '@/modules/general-ledger-definition'
import useConfirmModalStore from '@/store/confirm-modal-store'

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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { TEntityId } from '@/types'

import { useGeneralLedgerDefinition } from '../../ context/general-ledger-context-provider'

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
    canDelete = true,
    depth,
    hanldeDeleteGeneralLedgerDefinition,
    // isDeletingGLDefinition,
}: GeneralLedgerDefinitionActionsProps) => {
    const { onOpen } = useConfirmModalStore()
    const { modals, states } = useGeneralLedgerDefinition()

    const handleGeneralLedgerAction = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        action: ActionType,
        nodeId?: TEntityId
    ) => {
        e.stopPropagation()
        e.preventDefault()
        switch (action) {
            case 'addAccount':
                modals.accountPicker.onOpenChange?.(true)
                states.setSelectedEntry(null)
                break

            case 'addGL':
                modals.glForm.onOpenChange?.(true)
                states.setSelectedGL?.(undefined)
                states.setSelectedEntry(node.id)
                break

            case 'edit':
                modals.glForm.onOpenChange?.(true)
                states.setSelectedGL({
                    mode: 'edit',
                    data: node,
                })
                states.setSelectedEntry(null)
                break

            case 'view':
                modals.glForm.onOpenChange?.(true)
                states.setSelectedGL({
                    mode: 'view',
                    data: node,
                })
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
                        className="border-0 px-0! bg-transparent text-xl"
                        size={'sm'}
                        variant="outline"
                    >
                        <DotsHorizontalIcon className="h-5 w-5 rotate-90" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Create</DropdownMenuLabel>

                        <DropdownMenuItem
                            onClick={(e) =>
                                handleGeneralLedgerAction(e, 'addAccount')
                            }
                        >
                            <PlusIcon className="mr-2" />
                            Add Account
                        </DropdownMenuItem>

                        {depth < GENERAL_LEDGER_DEFINITION_MAX_DEPTH && (
                            <DropdownMenuItem
                                onClick={(e) =>
                                    handleGeneralLedgerAction(e, 'addGL')
                                }
                            >
                                <PlusIcon className="mr-2" />
                                Add GL
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={(e) =>
                                handleGeneralLedgerAction(e, 'edit')
                            }
                        >
                            <EditPencilIcon className="mr-2" />
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={(e) =>
                                handleGeneralLedgerAction(e, 'view')
                            }
                        >
                            <EyeViewIcon className="mr-2" />
                            View
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            disabled={!canDelete}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleGeneralLedgerAction(e, 'remove', node.id)
                            }}
                        >
                            <TrashIcon className="mr-2 text-destructive" />
                            Remove
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default GeneralLedgerDefinitionActions
