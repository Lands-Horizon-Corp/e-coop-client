import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import {
    AccountCreateUpdateFormModal,
    AccountPicker,
    IAccount,
} from '@/modules/account'
import { TChargesRateSchemeSchema } from '@/modules/charges-rate-scheme/charges-rate-scheme.validation'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { LinkIcon, RenderIcon, UnlinkIcon } from '@/components/icons'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

// CONNECT ACCOUNT
interface IConnectAccountSectionProps extends IClassProps {
    form: UseFormReturn<TChargesRateSchemeSchema>
    triggerClassName?: string
}

const ConnectAccountSection = ({
    form,
    className,
    triggerClassName,
}: IConnectAccountSectionProps) => {
    const modalState = useModalState()
    const isPending = false // Replace with actual loading state

    const accounts = form.watch('charges_rate_scheme_accounts')

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'charges_rate_scheme_accounts',
    })

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    className={cn('w-full', triggerClassName)}
                    hoverVariant="primary"
                    size="sm"
                    variant="outline"
                >
                    <LinkIcon className="size-4" />
                    Connect Account
                </Button>
            </SheetTrigger>
            <SheetContent
                className={cn(
                    'overflow-y-auto p-4 border-none rounded-2xl',
                    className
                )}
            >
                <SheetHeader>
                    <div className="flex items-center justify-between w-full">
                        <SheetTitle>Connect</SheetTitle>
                        <Button
                            className="border-e-none w-fit"
                            hoverVariant="primary"
                            onClick={() => modalState.onOpenChange(true)}
                            size="sm"
                            variant="outline"
                        >
                            <LinkIcon className="size-4" />
                            Connect
                        </Button>
                    </div>
                    <SheetDescription>
                        Link accounts to this charges rate scheme
                    </SheetDescription>
                </SheetHeader>
                <div className="mt-2 space-y-1">
                    <AccountPicker
                        currencyId={form.watch('currency_id') as TEntityId}
                        modalOnly
                        modalState={modalState}
                        mode="currency-loan"
                        onSelect={(newAccount) => {
                            const isAlreadyAdded = accounts.some(
                                (acc) => acc.account_id === newAccount.id
                            )
                            if (!isAlreadyAdded) {
                                append({
                                    account_id: newAccount.id,
                                    account: newAccount,
                                })
                            } else {
                                toast.warning(
                                    'Already connected to this scheme'
                                )
                            }
                            modalState.onOpenChange(false)
                        }}
                    />
                    {isPending && <p>Loading accounts...</p>}
                    {!isPending && fields.length === 0 && (
                        <Empty className="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <LinkIcon />
                                </EmptyMedia>
                                <EmptyTitle>No Accounts Applicable</EmptyTitle>
                                <EmptyDescription>
                                    Connect an account to get started. Click the
                                    button below to link your first account.
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <Button
                                    onClick={() =>
                                        modalState.onOpenChange(true)
                                    }
                                    size="sm"
                                    type="button"
                                    variant="outline"
                                >
                                    <LinkIcon className="size-4" />
                                    Connect Account
                                </Button>
                            </EmptyContent>
                        </Empty>
                    )}
                    {!isPending && fields.length > 0 && (
                        <ul className="space-y-2">
                            {fields.map((field, index) => (
                                <AccountItem
                                    account={accounts[index].account}
                                    index={index}
                                    key={field.id}
                                    onRemove={() => remove(index)}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}

// Account Item Component
interface IAccountItemProps {
    account: IAccount // Replace with proper type from your schema
    index: number
    onRemove: () => void
}

const AccountItem = ({ account, onRemove }: IAccountItemProps) => {
    const openAccountState = useModalState()

    const { onOpen } = useConfirmModalStore()

    return (
        <li className="p-3 rounded-md border hover:border-primary cursor-pointer duration-200 text-xs bg-card space-y-1">
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
            <div className="flex items-center gap-x-2">
                <RenderIcon className="shrink-0" icon={account?.icon} />
                <span
                    className="flex flex-1 hover:underline underline-offset-4 hover:text-primary items-center gap-x-2 truncate"
                    onClick={() => openAccountState.onOpenChange(true)}
                >
                    {account?.currency?.emoji && (
                        <span>{account.currency.emoji}</span>
                    )}
                    {account?.name}
                </span>
                <ActionTooltip side="left" tooltipContent="Disconnect Account">
                    <Button
                        className="size-fit shrink-0 p-1"
                        hoverVariant="destructive"
                        onClick={() => {
                            onOpen({
                                title: 'Disconnect account',
                                description:
                                    'This account is about to be disconnected',
                                onConfirm: () => {
                                    onRemove()
                                    toast.success('Account disconnected')
                                },
                            })
                        }}
                        size="icon"
                        type="button"
                        variant="outline"
                    >
                        <UnlinkIcon className="inline" />
                    </Button>
                </ActionTooltip>
            </div>
            <p className="text-muted-foreground truncate">
                {account?.description}
            </p>
        </li>
    )
}

export default ConnectAccountSection
