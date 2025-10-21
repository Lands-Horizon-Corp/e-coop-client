import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    AccountCreateUpdateFormModal,
    AccountPicker,
    IAccount,
    useAccountComputationConnect,
    useAccountComputationDisconnect,
    useAccountsComputation,
} from '@/modules/account'

import {
    LinkIcon,
    RefreshIcon,
    RenderIcon,
    UnlinkIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import { logger } from '../computation-sheet.service'

type Props = {
    computationSheetId: TEntityId
    currencyId?: TEntityId
}

const ComputationSheetAccounts = ({
    className,
    currencyId,
    computationSheetId,
}: Props & IClassProps) => {
    const accountPickerState = useModalState()
    const {
        data = [],
        isPending,
        isRefetching,
        refetch,
    } = useAccountsComputation({
        computationSheetId,
    })

    const connectAccountMutation = useAccountComputationConnect()

    return (
        <div
            className={cn(
                'p-4 rounded-xl flex flex-col gap-4 bg-popover',
                className
            )}
        >
            <AccountPicker
                currencyId={currencyId as TEntityId}
                modalOnly
                modalState={accountPickerState}
                mode="currency-loan"
                onSelect={(selectedAccount) => {
                    toast.promise(
                        connectAccountMutation.mutateAsync({
                            computation_sheet_id: computationSheetId,
                            account_id: selectedAccount.id,
                        }),
                        {
                            loading: 'Connecting account...',
                            success: 'Account connected successfully',
                            error: (error) => {
                                const parsedErr = serverRequestErrExtractor({
                                    error,
                                })
                                logger.error(parsedErr)
                                return `Error connecting account: ${parsedErr}`
                            },
                        }
                    )
                }}
            />
            <div className="flex items-center justify-between">
                <ButtonGroup className="w-full">
                    <Button
                        className="border-e-none flex-1"
                        hoverVariant="primary"
                        onClick={() => accountPickerState.onOpenChange(true)}
                        size="sm"
                        variant="outline"
                    >
                        <LinkIcon className="size-4" />
                        Connect Account
                    </Button>
                    <ButtonGroupSeparator />
                    <Button
                        className="size-fit p-2"
                        disabled={isRefetching}
                        onClick={() => refetch()}
                        size="icon"
                        variant="secondary"
                    >
                        {isRefetching ? (
                            <LoadingSpinner />
                        ) : (
                            <RefreshIcon className="size-4" />
                        )}
                    </Button>
                </ButtonGroup>
            </div>
            {isPending && <p>Loading accounts...</p>}
            {!isPending && data.length === 0 && (
                <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <LinkIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Accounts Connected</EmptyTitle>
                        <EmptyDescription>
                            Connect an account to get started. Click the button
                            above to link your first account.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button
                            onClick={() =>
                                accountPickerState.onOpenChange(true)
                            }
                            size="sm"
                            variant="outline"
                        >
                            <LinkIcon className="size-4" />
                            Connect Account
                        </Button>
                    </EmptyContent>
                </Empty>
            )}
            {!isPending && data.length > 0 && (
                <ul className="space-y-2">
                    {data.map((account) => (
                        <AccountItem
                            account={account}
                            computationSheetId={computationSheetId}
                            key={account.id}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

const AccountItem = ({
    computationSheetId,
    account,
}: {
    computationSheetId: TEntityId
    account: IAccount
}) => {
    const openAccountState = useModalState()
    const disconnectAccountMutation = useAccountComputationDisconnect()

    return (
        <li
            className="p-3 rounded-md border hover:border-primary cursor-pointer duration-200 text-xs bg-card space-y-1"
            key={account.id}
        >
            <AccountCreateUpdateFormModal
                {...openAccountState}
                description="View account details"
                formProps={{
                    readOnly: true,
                    accountId: account.id,
                    defaultValues: account,
                }}
                title="View Account"
            />
            <div className=" flex items-center gap-x-2">
                <RenderIcon className="shrink-0" icon={account.icon} />
                <span
                    className="flex flex-1 hover:underline underline-offset-4 hover:text-primary items-center gap-x-2 truncate"
                    onClick={() => openAccountState.onOpenChange(true)}
                >
                    {account.currency?.emoji && (
                        <span>{account.currency.emoji}</span>
                    )}
                    {account.name}
                </span>
                <ActionTooltip side="left" tooltipContent="Disconnect Account">
                    <Button
                        className="size-fit shrink-0 p-1"
                        hoverVariant="destructive"
                        onClick={() => {
                            toast.promise(
                                disconnectAccountMutation.mutateAsync({
                                    computation_sheet_id: computationSheetId,
                                    account_id: account.id,
                                }),
                                {
                                    loading: 'Disconnecting account...',
                                    success:
                                        'Account disconnected successfully',
                                    error: (error) => {
                                        const parsedErr =
                                            serverRequestErrExtractor({ error })
                                        logger.error(parsedErr)
                                        return `Error disconnecting account: ${parsedErr}`
                                    },
                                }
                            )
                        }}
                        size="icon"
                        variant="outline"
                    >
                        <UnlinkIcon className="inline" />
                    </Button>
                </ActionTooltip>
            </div>
            <p className="text-muted-foreground truncate">
                {account.description}
            </p>
        </li>
    )
}

export default ComputationSheetAccounts
