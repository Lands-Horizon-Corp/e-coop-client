import { useState } from 'react'

import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    AccountPicker,
    IAccount,
    TAccountType,
    logger,
    useConnectAccount,
    useDisconnectAccount,
    useGetAllAccount,
} from '@/modules/account'
import { TAccountFormValues } from '@/modules/account/account.validation'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    BankDuoToneIcon,
    LinkIcon,
    PlusIcon,
    RenderIcon,
    TrashIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import { AccountViewerModal } from '../../account-viewer/account-viewer'

interface ILoanConnectAccountSectionProps extends IClassProps {
    form: UseFormReturn<TAccountFormValues>
}

const LoanConnectAccountSection = ({
    form,
    className,
}: ILoanConnectAccountSectionProps) => {
    // Check if account is saved first
    const accountId = form.watch('id')
    const accountType = form.watch('type')

    const [selectedAccount, setSelectedAccount] = useState<
        IAccount | undefined
    >()
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

    const { mutateAsync: connectAccount, isPending: isConnecting } =
        useConnectAccount()

    const { data: connectedAccounts = [], isPending } = useGetAllAccount({
        mode: 'loan-account-connections',
        accountId: accountId!,
        options: {
            enabled: !!accountId && accountType === 'Loan',
        },
    })

    const handleConnect = () => {
        if (!selectedAccount?.id || !accountId) return

        toast.promise(
            connectAccount({
                mainAccountId: accountId,
                accountId: selectedAccount.id,
            }),
            {
                loading: 'Connecting account...',
                success: () => {
                    setSelectedAccount(undefined)
                    setIsPopoverOpen(false)
                    return 'Account connected successfully'
                },
                error: (error) => {
                    const errorMessage = serverRequestErrExtractor({
                        error,
                    })
                    logger.error(errorMessage)
                    return errorMessage || 'Failed to connect account'
                },
            }
        )
    }

    if (!accountId || accountType !== 'Loan') {
        return null
    }

    return (
        <div className={cn('space-y-3 max-h-full flex flex-col', className)}>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-sm font-medium">Connected Accounts</h3>
                    <p className="text-xs text-muted-foreground">
                        Linked loan accounts for this account
                    </p>
                </div>
            </div>

            <div className="flex gap-2">
                <Popover onOpenChange={setIsPopoverOpen} open={isPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            className="w-full"
                            size="sm"
                            type="button"
                            variant="outline"
                        >
                            <PlusIcon className="size-4" />
                            Connect Account
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        align="end"
                        className="w-96 p-0 rounded-xl"
                        side="bottom"
                    >
                        <div className="flex flex-col">
                            {/* Header */}
                            <div className="flex flex-col items-center p-4">
                                <div className="flex relative items-center my-4 gap-x-8">
                                    <div className="border-2 border-primary p-2 bg-primary/40 rounded-xl">
                                        <BankDuoToneIcon className="size-6" />
                                    </div>
                                    <div className="absolute text-primary left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <LinkIcon />
                                    </div>
                                    <div
                                        className={cn(
                                            'border-2 border-muted-foreground border-dashed p-2 rounded-xl',
                                            selectedAccount &&
                                                'border-solid bg-primary/40 border-primary'
                                        )}
                                    >
                                        <BankDuoToneIcon className="size-6" />
                                    </div>
                                </div>
                                <h4 className="font-semibold text-sm">
                                    Connect Account
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Select an account to connect to this loan
                                </p>
                            </div>

                            <div className="p-4 space-y-3">
                                <div>
                                    <AccountPicker
                                        // mode="loan-suggested"
                                        mode="all"
                                        nameOnly
                                        onSelect={(account) =>
                                            setSelectedAccount(account)
                                        }
                                        placeholder="Select account to connect..."
                                        triggerClassName="w-full"
                                        value={selectedAccount}
                                    />
                                </div>

                                {selectedAccount && (
                                    <>
                                        <p className="text-xs text-center text-muted-foreground">
                                            Connecting this account may affect
                                            how fines/interest or other charges
                                            for this loan are computed based on
                                            the account configuration.
                                        </p>
                                        <div className="space-y-3">
                                            <RenderAccountConfigEffect
                                                selectedAccount={
                                                    selectedAccount
                                                }
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-3 flex gap-2 justify-end">
                                <Button
                                    onClick={() => {
                                        setIsPopoverOpen(false)
                                        setSelectedAccount(undefined)
                                    }}
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={!selectedAccount || isConnecting}
                                    onClick={handleConnect}
                                    size="sm"
                                    type="button"
                                >
                                    {isConnecting ? 'Connecting...' : 'Connect'}
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-3 p-3 bg-popover max-h-full flex-1 rounded-xl">
                {isPending && (
                    <p className="text-sm text-muted-foreground">
                        Loading accounts...
                    </p>
                )}
                {!isPending && connectedAccounts.length === 0 && (
                    <Empty className="from-muted/50 sticky top-0 to-background bg-gradient-to-b from-30% rounded-lg border">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <LinkIcon />
                            </EmptyMedia>
                            <EmptyTitle>No Accounts Connected</EmptyTitle>
                            <EmptyDescription>
                                No loan accounts connected to this account yet.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}

                {!isPending && connectedAccounts.length > 0 && (
                    <ul className="space-y-2">
                        {connectedAccounts.map((account, index) => (
                            <AccountItem
                                account={account}
                                index={index}
                                key={account.id}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

interface IAccountItemProps {
    account: IAccount
    index: number
}

const AccountItem = ({ account }: IAccountItemProps) => {
    const accountId = account.id
    const { onOpen } = useConfirmModalStore()
    const openAccountState = useModalState()
    const { mutateAsync: disconnectAccount, isPending: isDisconnecting } =
        useDisconnectAccount()

    const handleDisconnect = (disconnectAccountId: string) => {
        if (!accountId) return

        onOpen({
            title: 'Disconnect Account',
            description:
                'You are about to disconnect this account, which might have unwanted effect to the loan account computation. Are you sure?',
            onConfirm: () => {
                toast.promise(
                    disconnectAccount({
                        mainAccountId: accountId,
                        accountId: disconnectAccountId,
                    }),
                    {
                        loading: 'Disconnecting...',
                        success: 'Account was Disconnected',
                        error: (e) => {
                            const errorMessage = serverRequestErrExtractor({
                                error: e,
                            })
                            logger.error(errorMessage)
                            return errorMessage
                        },
                    }
                )
            },
        })
    }

    if (!account) return null

    return (
        <li className="p-3 rounded-lg border hover:border-primary duration-200 text-xs bg-card space-y-1">
            <AccountViewerModal
                {...openAccountState}
                accountId={account.id}
                description="View account details"
                title="View Account"
            />
            <div className="flex items-center gap-x-2">
                <RenderIcon className="shrink-0" icon={account?.icon} />
                <span
                    className="flex flex-1 hover:underline underline-offset-4 hover:text-primary items-center gap-x-2 truncate cursor-pointer"
                    onClick={() => openAccountState.onOpenChange(true)}
                >
                    {account?.currency?.emoji && (
                        <span>{account.currency.emoji}</span>
                    )}
                    {account?.name}
                </span>
                <Button
                    className="size-7 text-destructive hover:text-destructive"
                    disabled={isDisconnecting}
                    onClick={() => handleDisconnect(account.id)}
                    size="icon"
                    type="button"
                    variant="ghost"
                >
                    <TrashIcon className="size-3.5" />
                </Button>
            </div>
            {account?.description && (
                <p className="text-muted-foreground truncate">
                    {account.description}
                </p>
            )}
        </li>
    )
}

const RenderAccountConfigEffect = ({
    selectedAccount,
}: {
    selectedAccount: IAccount
}) => {
    const renderConfiguration = () => {
        switch (selectedAccount.type as TAccountType) {
            case 'Interest':
                return (
                    <div className="pt-2 border-t space-y-1.5">
                        <p className="text-xs font-medium">Configuration</p>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <span className="size-2 rounded-full bg-primary shrink-0" />
                                Interest Standard:
                            </span>
                            <span className="font-medium">
                                {selectedAccount.interest_standard
                                    ? `${selectedAccount.interest_standard}%`
                                    : 'Not configured'}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <span className="size-2 rounded-full bg-primary shrink-0" />
                                Computation Type:
                            </span>
                            <span className="font-medium">
                                {selectedAccount.computation_type ||
                                    'Standard computation'}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <span className="size-2 rounded-full bg-primary shrink-0" />
                                Standard Computation:
                            </span>
                            <span className="font-medium">
                                {selectedAccount.interest_standard_computation ||
                                    'Not configured'}
                            </span>
                        </div>
                    </div>
                )

            case 'SVF-Ledger':
                return (
                    <div className="pt-2 border-t space-y-1.5">
                        <p className="text-xs font-medium">Configuration</p>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <span className="size-2 rounded-full bg-primary shrink-0" />
                                Interest Standard:
                            </span>
                            <span className="font-medium">
                                {selectedAccount.interest_standard
                                    ? `${selectedAccount.interest_standard}%`
                                    : 'Not configured'}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <span className="size-2 rounded-full bg-primary shrink-0" />
                                Computation Type:
                            </span>
                            <span className="font-medium">
                                {selectedAccount.computation_type ||
                                    'Standard service fee'}
                            </span>
                        </div>
                    </div>
                )

            case 'Fines':
                return (
                    <div className="pt-2 border-t space-y-1.5">
                        <p className="text-xs font-medium">Configuration</p>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <span className="size-2 rounded-full bg-primary shrink-0" />
                                Fines Amortization:
                            </span>
                            <span className="font-medium">
                                {selectedAccount.fines_amort
                                    ? `${selectedAccount.fines_amort}%`
                                    : 'Not configured'}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <span className="size-2 rounded-full bg-primary shrink-0" />
                                Fines Maturity:
                            </span>
                            <span className="font-medium">
                                {selectedAccount.fines_maturity
                                    ? `${selectedAccount.fines_maturity}%`
                                    : 'Not configured'}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <span className="size-2 rounded-full bg-primary shrink-0" />
                                Grace Period (Amort):
                            </span>
                            <span className="font-medium">
                                {selectedAccount.fines_grace_period_amortization
                                    ? `${selectedAccount.fines_grace_period_amortization} days`
                                    : 'Not configured'}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <span className="size-2 rounded-full bg-primary shrink-0" />
                                Grace Period (Maturity):
                            </span>
                            <span className="font-medium">
                                {selectedAccount.fines_grace_period_maturity
                                    ? `${selectedAccount.fines_grace_period_maturity} days`
                                    : 'Not configured'}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <span className="size-2 rounded-full bg-primary shrink-0" />
                                Computation Type:
                            </span>
                            <span className="font-medium">
                                {selectedAccount.computation_type ||
                                    'Standard fines computation'}
                            </span>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <>
            {/* Account Header */}
            <div className="flex rounded-lg border bg-muted/50 p-3 items-start gap-2">
                <RenderIcon
                    className="shrink-0 mt-0.5"
                    icon={selectedAccount.icon}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h5 className="font-medium text-sm truncate">
                            {selectedAccount.name}
                        </h5>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                            {selectedAccount.type}
                        </span>
                    </div>
                    {selectedAccount.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {selectedAccount.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Configuration based on account type */}
            {renderConfiguration()}
        </>
    )
}

export default LoanConnectAccountSection
