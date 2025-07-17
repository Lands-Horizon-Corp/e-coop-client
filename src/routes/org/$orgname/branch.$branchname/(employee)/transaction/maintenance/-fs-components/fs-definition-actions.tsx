import { GENERAL_LEDGER_DEFINITION_MAX_DEPTH } from '@/constants'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useFinancialStatementAccountsGroupingStore } from '@/store/financial-statement-accounts-grouping-store'
import { useGLFSStore } from '@/store/gl-fs-store'

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

import { IFinancialStatementDefinition, TEntityId } from '@/types'

type FinancialStatementDefinitionActionsProps = {
    node: IFinancialStatementDefinition
    canDelete?: boolean
    depth: number
    hanldeDeleteFinancialStatemenetDefinition: (id: TEntityId) => void
    isDeletingFSDefinition?: boolean
}

type ActionType = 'addAccount' | 'addGL' | 'edit' | 'view' | 'remove'

const FinancialStatementDefinitionActions = ({
    node,
    canDelete,
    depth,
    hanldeDeleteFinancialStatemenetDefinition,
    isDeletingFSDefinition,
}: FinancialStatementDefinitionActionsProps) => {
    const { onOpen } = useConfirmModalStore()

    const {
        setSelectedFinancialStatementDefinition,
        setSelectedFinancialStatementDefinitionId,
        setOnCreate,
        setOpenCreateFinancialStatementModal,
        setIsReadyOnly,
        setFinancialStatementDefinitionEntriesId,
    } = useFinancialStatementAccountsGroupingStore()

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
                setSelectedFinancialStatementDefinitionId?.(node.id)
                break

            case 'addGL':
                setOnCreate?.(true)
                setOpenCreateFinancialStatementModal?.(true)
                setSelectedFinancialStatementDefinitionId?.(null)
                setFinancialStatementDefinitionEntriesId?.(node.id)
                break

            case 'edit':
                setOnCreate?.(false)
                setOpenCreateFinancialStatementModal?.(true)
                setSelectedFinancialStatementDefinition?.(node)
                setFinancialStatementDefinitionEntriesId?.(node.id)
                break

            case 'view':
                setOnCreate?.(false)
                setIsReadyOnly?.(true)
                setSelectedFinancialStatementDefinition?.(node)
                setOpenCreateFinancialStatementModal?.(true)
                break
            case 'remove':
                onOpen({
                    title: `Delete this GL Definition`,
                    description: `You are about to delete this GL Definition, are you sure you want to proceed?`,
                    onConfirm: () => {
                        if (
                            typeof hanldeDeleteFinancialStatemenetDefinition ===
                            'function'
                        )
                            if (nodeId) {
                                hanldeDeleteFinancialStatemenetDefinition(
                                    nodeId
                                )
                            }
                    },
                    confirmString: 'Proceed',
                })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size={'sm'}
                    className="border-0 !px-0 text-xl"
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
                            Add FS Definition
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
                            disabled={isDeletingFSDefinition || canDelete}
                            onClick={(e) =>
                                handleGeneralLedgerAction(e, 'remove', node.id)
                            }
                        >
                            <TrashIcon className="mr-2 text-destructive" />
                            Remove
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default FinancialStatementDefinitionActions
