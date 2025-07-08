import useConfirmModalStore from '@/store/confirm-modal-store'
import { useGeneralLedgerStore } from '@/store/general-ledger-accounts-groupings-store'
import { IGeneralLedgerDefinition } from '@/types/coop-types/general-ledger-definitions'

import { GeneralLedgerDefinitionCreateUpdateFormModal } from '@/components/forms/general-ledger-definition/general-ledger-definition-create-update-form'
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

import { useDeleteGeneralLedgerDefinition } from '@/hooks/api-hooks/general-ledger-accounts-groupings/use-general-ledger-accounts-groupings'

type GeneralLedgerDefinitionActionsProps = {
    node: IGeneralLedgerDefinition
    refetch?: () => void
}

const GeneralLedgerDefinitionActions = ({
    node,
    refetch,
}: GeneralLedgerDefinitionActionsProps) => {
    const { onOpen } = useConfirmModalStore()

    const {
        setSelectedGeneralLedgerDefinitionId,
        setAddAccountPickerModalOpen,
        setOnCreate,
        setOpenCreateGeneralLedgerModal,
        setIsReadyOnly,
        onCreate,
        isReadOnly,
        openCreateGeneralLedgerModal,
    } = useGeneralLedgerStore()

    const {
        mutate: deleteGeneralLedgerDefinition,
        isPending: isDeletingGLDefinition,
    } = useDeleteGeneralLedgerDefinition()

    return (
        <div>
            <DropdownMenu>
                <GeneralLedgerDefinitionCreateUpdateFormModal
                    onOpenChange={setOpenCreateGeneralLedgerModal}
                    open={openCreateGeneralLedgerModal}
                    title={`${onCreate ? 'Create' : 'Update'} General Ledger Definition`}
                    description={`Fill out the form to ${onCreate ? 'add a new' : 'edit'} General Ledger Definition.`}
                    formProps={{
                        defaultValues: onCreate ? {} : node,
                        generalLedgerDefinitionEntriesId: node.id,
                        generalLedgerAccountsGroupingId:
                            node.general_ledger_accounts_grouping_id,
                        generalLedgerDefinitionId: onCreate
                            ? undefined
                            : node.id,
                        readOnly: isReadOnly,
                        onSuccess: () => {
                            refetch?.()
                        },
                    }}
                />

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
                                setIsReadyOnly?.(false)
                                setOnCreate?.(true)
                                setOpenCreateGeneralLedgerModal?.(true)
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
                                    setOpenCreateGeneralLedgerModal?.(true)
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
