import { IAccount } from '@/modules/account'
import { useGeneralLedgerDefinitionContext } from '@/modules/general-ledger-definition/pages/ context/general-ledger-context-provider'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    DotsHorizontalIcon,
    EyeViewIcon,
    MinusIcon,
    PencilFillIcon,
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

type GeneralLedgerDefinitionActionsProps = {
    node: IAccount
    handleDeleteAccount: (id: TEntityId) => void
}

type ActionType =
    | 'view'
    | 'edit'
    | 'remove'
    | 'add'
    | 'ledger'
    | 'add-below'
    | 'add-up'

const GLFSAccountActions = ({
    node,
    handleDeleteAccount,
}: GeneralLedgerDefinitionActionsProps) => {
    const { onOpen } = useConfirmModalStore()
    const {
        modals: { accountDetails },
    } = useGeneralLedgerDefinitionContext()

    const handleGLAccountAction = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        action: ActionType,
        nodeId?: TEntityId
    ) => {
        e.stopPropagation()
        e.preventDefault()

        switch (action) {
            case 'ledger':
                accountDetails.view?.({
                    account: node,
                })
                break
            case 'add':
                accountDetails.create?.()
                break
            case 'view':
                accountDetails.view({ account: node })
                break
            case 'edit':
                accountDetails.edit?.({
                    account: node,
                })
                break
            case 'add-up':
                accountDetails.edit?.({
                    index: node.index + 1,
                    account: undefined,
                })
                break
            case 'add-below':
                accountDetails.edit?.({
                    index: node.index - 1,
                    account: undefined,
                })
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
                    <DropdownMenuItem
                        onClick={(e) => handleGLAccountAction(e, 'ledger')}
                    >
                        <EyeViewIcon className="mr-2" />
                        view account ledger
                    </DropdownMenuItem>
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={(e) => handleGLAccountAction(e, 'add')}
                            >
                                <PlusIcon className="mr-2" />
                                add
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) =>
                                    handleGLAccountAction(e, 'view')
                                }
                            >
                                <EyeViewIcon className="mr-2" />
                                view
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) =>
                                    handleGLAccountAction(e, 'edit')
                                }
                            >
                                <PencilFillIcon className="mr-2" />
                                edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={(e) =>
                                    handleGLAccountAction(e, 'add-below')
                                }
                            >
                                <PlusIcon className="mr-2" />
                                Add account below
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={(e) =>
                                    handleGLAccountAction(e, 'add-below')
                                }
                            >
                                <MinusIcon className="mr-2" />
                                Add account above
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={(e) =>
                                    handleGLAccountAction(e, 'remove', node.id)
                                }
                            >
                                <TrashIcon className="mr-2 text-destructive" />
                                Remove
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default GLFSAccountActions
