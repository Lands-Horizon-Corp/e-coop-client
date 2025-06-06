import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { IGeneralLedgerDefinition } from '@/types/coop-types/general-ledger-definitions'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AccountCreateUpdateFormModal } from '@/components/forms/accounting-forms/account-create-update-form'
import { GeneralLedgerDefinitionCreateUpdateFormModal } from '@/components/forms/general-ledger-definition/general-ledger-definition-create-update-form'

type GeneralLedgerTreeNode = {
    node: IGeneralLedgerDefinition
    depth: number
}

const GeneralLedgerTreeNode = ({ node, depth = 0 }: GeneralLedgerTreeNode) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [openCreateAccountModal, setOpenCreateAccountModal] = useState(false)
    const [openCreateGeneralLedgerModal, setOpenCreateGeneralLedgerModal] =
        useState(false)
    const hasChildren =
        node.general_ledger_accounts && node.general_ledger_accounts.length > 0

    const paddingLeft = depth * 20

    const isFirstLevel = depth > 0

    return (
        <GradientBackground
            opacity={isFirstLevel ? 0.02 : 0.05}
            gradientOnly
            className="p-3"
        >
            <AccountCreateUpdateFormModal
                onOpenChange={setOpenCreateAccountModal}
                open={openCreateAccountModal}
            />
            <GeneralLedgerDefinitionCreateUpdateFormModal
                onOpenChange={setOpenCreateGeneralLedgerModal}
                open={openCreateGeneralLedgerModal}
            />
            <div className="flex flex-col">
                <div
                    className="flex cursor-pointer items-center rounded-md px-3 py-2 transition-colors duration-200 hover:bg-secondary"
                    style={{ paddingLeft: `${paddingLeft}px` }}
                    onClick={() => hasChildren && setIsExpanded(!isExpanded)}
                >
                    {hasChildren && (
                        <div className="flex h-full items-center">
                            <span className="mr-2">
                                {isExpanded ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </span>
                        </div>
                    )}
                    <div className="flex flex-1 flex-col">
                        <span className="font-semibold">{node.name}</span>
                        {node.description && (
                            <span className="text-sm text-accent-foreground/70">
                                {node.description}
                            </span>
                        )}
                        <span className="text-xs text-accent-foreground/50">
                            ID: {node.id} | Type: {node.general_ledger_type}
                        </span>
                    </div>
                    {isFirstLevel && (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size={'sm'}
                                        className="border-0 text-xl"
                                    >
                                        +
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56"
                                    align="start"
                                >
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setOpenCreateAccountModal(true)
                                            }
                                        >
                                            Add Account
                                            <DropdownMenuShortcut className="text-xl">
                                                +
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setOpenCreateGeneralLedgerModal(
                                                    true
                                                )
                                            }}
                                        >
                                            Add GL Definition
                                            <DropdownMenuShortcut className="text-xl">
                                                +
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            view
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
                {isExpanded && hasChildren && (
                    <div className="ml-4 border-l-[0.1px] border-gray-200/20">
                        {node.general_ledger_accounts!.map((childNode) => (
                            <GeneralLedgerTreeNode
                                key={childNode.id}
                                node={childNode}
                                depth={depth + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </GradientBackground>
    )
}

export default GeneralLedgerTreeNode
