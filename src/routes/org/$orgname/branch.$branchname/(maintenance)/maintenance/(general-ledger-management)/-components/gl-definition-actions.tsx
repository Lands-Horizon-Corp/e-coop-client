import useConfirmModalStore from '@/store/confirm-modal-store'
import { useGeneralLedgerStore } from '@/store/general-ledger-accounts-groupings-store'
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

import { useDeleteGeneralLedgerDefinition } from '@/hooks/api-hooks/general-ledger-definitions/use-general-ledger-definition'

type GeneralLedgerDefinitionActionsProps = {
    node: IGeneralLedgerDefinition
}

const GeneralLedgerDefinitionActions = ({
    node,
}: GeneralLedgerDefinitionActionsProps) => {
    const { onOpen } = useConfirmModalStore()

    const {
        setSelectedGeneralLedgerDefinitionId,
        setAddAccountPickerModalOpen,
        setOnCreate,
        setOpenCreateGeneralLedgerModal,
        setIsReadyOnly,
        setSelectedGeneralLedgerDefinition,
    } = useGeneralLedgerStore()

    const {
        mutate: deleteGeneralLedgerDefinition,
        isPending: isDeletingGLDefinition,
    } = useDeleteGeneralLedgerDefinition()

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size={'sm'}
                        className="border-0 text-xl"
                    >
                        <DotsHorizontalIcon className="h-5 w-5 rotate-90" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsReadyOnly?.(false)
                                setSelectedGeneralLedgerDefinitionId(node.id)
                                setAddAccountPickerModalOpen?.(true)
                            }}
                        >
                            <PlusIcon className="mr-2">+</PlusIcon>
                            Add Account
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                setIsReadyOnly?.(false)
                                setOnCreate?.(true)
                                setSelectedGeneralLedgerDefinitionId(node.id)
                                setOpenCreateGeneralLedgerModal?.(true)
                                setSelectedGeneralLedgerDefinition?.(node)
                            }}
                        >
                            <PlusIcon className="mr-2">+</PlusIcon>
                            Add GL Definition
                        </DropdownMenuItem>
                        <div>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setOnCreate?.(false)
                                    setIsReadyOnly?.(false)
                                    setOpenCreateGeneralLedgerModal?.(true)
                                    setSelectedGeneralLedgerDefinitionId?.(
                                        node.id
                                    )
                                    setSelectedGeneralLedgerDefinition?.(node)
                                }}
                            >
                                <EditPencilIcon className="mr-2" />
                                edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setOnCreate?.(false)
                                    setOpenCreateGeneralLedgerModal?.(true)
                                    setIsReadyOnly?.(true)
                                }}
                            >
                                <EyeViewIcon className="mr-2" />
                                View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                disabled={isDeletingGLDefinition}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onOpen({
                                        title: `Delete this Account/Definition`,
                                        description: `You are about definition/Account are you sure you want to proceed?`,
                                        onConfirm: () => {
                                            deleteGeneralLedgerDefinition(
                                                node.id
                                            )
                                        },
                                        confirmString: 'Proceed',
                                    })
                                }}
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
