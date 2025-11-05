import { cn } from '@/helpers'
import { useGetAllAccountTag } from '@/modules/account-tag'
import { AccountTagChip } from '@/modules/account-tag/components/account-tag-management'
import { CurrencyBadge } from '@/modules/currency/components/currency-badge'

import { ErrorIcon, RefreshIcon, RenderIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextRenderer from '@/components/text-renderer'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { IClassProps, TEntityId } from '@/types'

import { useGetAccountById } from '../../account.service'
import { IAccount } from '../../account.types'
import AccountTypeBadge from '../badges/account-type-badge'
import { AccountCommonConfig } from './account-common-config'
import { DepositAccountContent } from './deposit-content'
import { FinesAccountContent } from './fines-content'
import { InterestAccountContent } from './interest-content'
import { LoanAccountContent } from './loan-content'

type Props = {
    accountId: TEntityId
    defaultValue?: IAccount
} & IClassProps

const AccountViewer = ({ className, accountId, defaultValue }: Props) => {
    const {
        data: account,
        isPending,
        isRefetching,
        refetch,
        isError,
        error,
    } = useGetAccountById({
        id: accountId,
        options: {
            initialData: defaultValue,
        },
    })

    if (isPending) {
        return <AccountViewerSkeleton className={className} />
    }

    if (isError && !account) {
        return (
            <div
                className={cn(
                    'flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl bg-popover p-8',
                    className
                )}
            >
                <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
                    <ErrorIcon className="size-8 text-destructive" />
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-semibold">
                        Failed to load account
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {error?.message ||
                            'An error occurred while loading the account details.'}
                    </p>
                </div>
                <Button
                    className="size-fit p-2"
                    onClick={() => refetch()}
                    size="icon"
                    variant="outline"
                >
                    <RefreshIcon className="mr-2 size-4" />
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className={cn('p-4 space-y-2 bg-popover rounded-xl', className)}>
            {/*  HEADER */}
            <div className="space-y-4 min-w-0 max-w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center max-w-full min-w-0 gap-x-2">
                        <div className="shrink-0 relative">
                            <RenderIcon
                                className="absolute left-1/2 blur-sm top-1/2 -translate-x-1/2 -translate-y-1/2 size-4 text-primary"
                                icon={account.icon}
                            />
                            <RenderIcon
                                className="shrink-0 inline size-6 text-primary"
                                icon={account.icon}
                            />
                        </div>
                        <h1 className="truncate font-semibold">
                            {account.name}
                        </h1>
                    </div>
                    <div className="flex shrink-0 items-center gap-x-2 justify-end">
                        {account.currency && (
                            <CurrencyBadge
                                currency={account.currency}
                                displayFormat="code"
                                size="sm"
                            />
                        )}
                        <AccountTypeBadge type={account.type} />
                        <Button
                            className="size-fit p-1"
                            onClick={() => refetch()}
                            size="icon"
                            variant="ghost"
                        >
                            {!isRefetching ? (
                                <RefreshIcon />
                            ) : (
                                <LoadingSpinner />
                            )}
                        </Button>
                    </div>
                </div>

                <div className="p-3 text-sm rounded-xl bg-card/60 space-y-2">
                    <p className="text-card-foreground/40 font-medium">
                        Description
                    </p>
                    <div>
                        <TextRenderer
                            content={
                                account.description ||
                                'No description provided.'
                            }
                        />
                    </div>
                </div>

                <AccountTagsContainer accountId={accountId} />
            </div>

            {/* CONTENT */}
            <div className="mt-4">
                <AccountTypeContent account={account} />
            </div>

            {/* COMMONS */}
            <AccountCommonConfig account={account} />
        </div>
    )
}

const AccountTagsContainer = ({
    className,
    accountId,
}: {
    className?: string
    accountId: TEntityId
}) => {
    const { data: accountTags = [] } = useGetAllAccountTag({
        accountId,
        options: { retry: 0, enabled: !!accountId },
        mode: 'account-tag',
    })

    if (accountTags.length === 0) return null

    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            <p className="shrink-0 text-muted-foreground text-sm">Tags</p>
            {accountTags.map((tag) => (
                <AccountTagChip key={tag.id} tag={tag} />
            ))}
        </div>
    )
}

const AccountViewerSkeleton = ({ className }: IClassProps) => {
    return (
        <div className={cn('p-4 bg-popover rounded-xl', className)}>
            <div className="flex items-center justify-between">
                <div className="flex gap-x-2">
                    <Skeleton className="size-6 rounded-md" />
                    <Skeleton className="h-6 w-48 rounded-md" />
                </div>
                <div className="flex items-center gap-x-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="size-10 rounded-md" />
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <Skeleton className="h-24 w-full rounded-2xl" />

                <div className="space-y-3">
                    <Skeleton className="h-5 w-48 rounded-md" />
                    <div className="grid gap-3 md:grid-cols-3">
                        <Skeleton className="h-32 rounded-2xl" />
                        <Skeleton className="h-32 rounded-2xl" />
                        <Skeleton className="h-32 rounded-2xl" />
                    </div>
                </div>

                <div className="space-y-3">
                    <Skeleton className="h-5 w-48 rounded-md" />
                    <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
            </div>
        </div>
    )
}

export const AccountTypeContent = ({
    account,
    className,
}: {
    account: IAccount
    className?: string
}) => {
    switch (account.type) {
        case 'Deposit':
            return (
                <DepositAccountContent
                    account={account}
                    className={className}
                />
            )
        case 'Interest':
            return <InterestAccountContent account={account} />
        case 'Fines':
            return <FinesAccountContent account={account} />
        case 'Loan':
            return (
                <LoanAccountContent account={account} className={className} />
            )
        case 'SVF-Ledger':
            return <div>SVF Ledger Account Content</div>
        default:
            return null
    }
}

export const AccountViewerModal = ({
    title = 'Account Details',
    description,
    className,
    accountId,
    defaultValue,
    ...props
}: IModalProps & {
    accountId: TEntityId
    defaultValue?: IAccount
}) => {
    return (
        <Modal
            className={cn('w-fit p-4 !rounded-3xl !max-w-none', className)}
            closeButtonClassName="hidden"
            description={description}
            descriptionClassName="hidden"
            title={title}
            titleClassName="hidden"
            {...props}
        >
            <AccountViewer
                accountId={accountId}
                className="bg-transparent min-w-2xl p-0"
                defaultValue={defaultValue}
            />
        </Modal>
    )
}

export default AccountViewer
