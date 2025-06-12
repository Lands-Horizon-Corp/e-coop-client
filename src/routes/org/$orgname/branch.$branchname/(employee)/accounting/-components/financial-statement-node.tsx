import { AccountCreateUpdateFormModal } from '@/components/forms/accounting-forms/account-create-update-form'
import { FSDefinitionCreateUpdateFormModal } from '@/components/forms/financial-statement-definition/financial-statement-definition-create-update-form'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import PlainTextEditor from '@/components/plain-text-editor'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IFinancialStatementDefinition } from '@/types/coop-types/financial-statement-definition'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

type FinancialStatementTreeNodeProps = {
    node: IFinancialStatementDefinition
    depth?: number
}

const FinancialStatementTreeNode = ({
    node,
    depth = 1,
}: FinancialStatementTreeNodeProps) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [openCreateItemModal, setOpenCreateItemModal] = useState(false)
    const [openFSDefinition, setOpenFSDefinition] = useState(false)

    const hasChildren =
        node.financial_statement_accounts &&
        node.financial_statement_accounts.length > 0

    const paddingLeft = depth * 20

    const isFirstLevel = depth > 0

    return (
        <GradientBackground
            opacity={isFirstLevel ? 0.02 : 0.05}
            gradientOnly
            className="p-3"
        >
            <AccountCreateUpdateFormModal
                onOpenChange={setOpenCreateItemModal}
                open={openCreateItemModal}
            />
            <FSDefinitionCreateUpdateFormModal
                onOpenChange={setOpenFSDefinition}
                open={openFSDefinition}
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
                                <PlainTextEditor content={node.description} />
                            </span>
                        )}
                        <span className="text-xs text-accent-foreground/50">
                            ID: {node.id} | Type:{' '}
                            {node.financial_statement_type}
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
                                                setOpenCreateItemModal(true)
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
                                                setOpenFSDefinition(true)
                                            }}
                                        >
                                            Add Financial Statement
                                            <DropdownMenuShortcut className="text-xl">
                                                +
                                            </DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setOpenFSDefinition(true)
                                            }}
                                        >
                                            edit
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
                {isExpanded && hasChildren && (
                    <div className="ml-4 border-l-[0.1px] border-gray-200/20">
                        {node.financial_statement_accounts!.map((childNode) => (
                            <FinancialStatementTreeNode
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

export default FinancialStatementTreeNode
