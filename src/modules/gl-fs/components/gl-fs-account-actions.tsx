import { IAccount } from '@/modules/account'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useGLFSStore } from '@/store/gl-fs-store'

import { DotsHorizontalIcon, EyeViewIcon, TrashIcon } from '@/components/icons'
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
    node: IAccount
    handleDeleteAccount: (id: TEntityId) => void
}

type ActionType = 'viewLedger' | 'viewAccount' | 'remove'

const GLFSAccountActions = ({
    node,
    handleDeleteAccount,
}: GeneralLedgerDefinitionActionsProps) => {
    const { onOpen } = useConfirmModalStore()

    const {
        setViewAccountModalOpen,
        setSelectedAccounts,
        setOpenGeneralLedgerAccountTableModal,
    } = useGLFSStore()

    const handleGLAccountAction = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        action: ActionType,
        nodeId?: TEntityId
    ) => {
        e.stopPropagation()
        e.preventDefault()

        switch (action) {
            case 'viewAccount':
                setViewAccountModalOpen?.(true)
                setSelectedAccounts?.(node)
                break
            case 'viewLedger':
                setSelectedAccounts?.(node)
                setOpenGeneralLedgerAccountTableModal?.(true)
                break
            case 'remove':
                onOpen({
                    title: (
                        <>
                            Remove this{' '}
                            <span className="font-bold italic underline text-primary">
                                {node.name}
                            </span>{' '}
                            Account
                        </>
                    ),
                    description: `You are about to remove this ${node.name} account, are you sure you want to proceed?`,
                    onConfirm: () => {
                        if (typeof handleDeleteAccount === 'function')
                            if (nodeId) {
                                handleDeleteAccount(nodeId)
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
                        className="border-0 text-xl"
                        size={'sm'}
                        variant="outline"
                    >
                        <DotsHorizontalIcon className="h-5 w-5 rotate-90" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={(e) =>
                                handleGLAccountAction(e, 'viewLedger')
                            }
                        >
                            <EyeViewIcon className="mr-2" />
                            view ledger
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={(e) =>
                                handleGLAccountAction(e, 'viewAccount')
                            }
                        >
                            <EyeViewIcon className="mr-2" />
                            view account
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={(e) =>
                                handleGLAccountAction(e, 'remove', node.id)
                            }
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

export default GLFSAccountActions
