import { useMemo, useState } from 'react'

import Fuse from 'fuse.js'
import { toast } from 'sonner'

import { allErrorMessageExtractor } from '@/helpers/error-message-extractor'
import {
    useAccountConsolidationLinkAccount,
    useGetAllAccountConsolidationByAccountId,
} from '@/modules/account-consolidation'
import { useAuthStore } from '@/modules/authentication/authgentication.store'
import { IBranch, useGetBranchesByOrganizationId } from '@/modules/branch'

import RefreshButton from '@/components/buttons/refresh-button'
import { highlightMatch } from '@/components/hightlight-match'
import { BuildingIcon, EmptyIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import SearchInput from '@/components/search/generic-search-input'
import { Button } from '@/components/ui/button'
import { Empty } from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

import { TEntityId } from '@/types'

import { useGetAllAccountByBranchId } from '../../account.service'
import { IAccount } from '../../account.types'

interface AccountConsolidationModalProps extends IModalProps {
    organizationId: TEntityId
    accountId: TEntityId
    accountName?: string
}

const AccountConsolidationModal = (props: AccountConsolidationModalProps) => {
    const { organizationId, accountId, accountName } = props

    const { data: branches } = useGetBranchesByOrganizationId({
        organizationId,
    })
    const {
        currentAuth: { user_organization },
    } = useAuthStore()

    return (
        <Modal
            className="min-w-[90vw] w-[90vw] h-[90vh] max-h-[90vh] ecoop-scroll"
            description="Link this account to other accounts from different branches within the same organization. This allows you to view combined financial data across linked accounts."
            title={`Consolidate Account${accountName ? `: ${accountName}` : ''}`}
            {...props}
        >
            <div className=" h-[80vh] w-full flex items-start gap-4  ecoop-scroll p-4">
                {branches
                    ?.filter(
                        (branch) => branch.id !== user_organization?.branch_id
                    )
                    ?.map((branch) => (
                        <BranchItem
                            accountId={accountId}
                            branch={branch}
                            key={branch.id}
                        />
                    ))}
            </div>
        </Modal>
    )
}

interface BranchItemProps {
    branch: IBranch
    accountId: TEntityId
}

const BranchItem = ({ branch, accountId }: BranchItemProps) => {
    const {
        data: accountsPerBranch,
        refetch,
        isRefetching,
        isLoading,
    } = useGetAllAccountByBranchId({
        branchId: branch.id,
    })

    const {
        data: consolidatedAccounts,
        isRefetching: isConsolidatedAccountsRefetching,
        isLoading: isConsolidatedAccountsLoading,
    } = useGetAllAccountConsolidationByAccountId(accountId)

    const [search, setSearch] = useState('')
    const { mutate: mutateLinkAccount } = useAccountConsolidationLinkAccount({
        options: {
            onSuccess: () => {
                toast.success('Account linked successfully')
                refetch()
            },
            onError: (error) => {
                const errorMessage = allErrorMessageExtractor({
                    error: error,
                })
                toast.error('Failed to link ' + errorMessage)
            },
        },
    })

    const fuse = useMemo(
        () =>
            new Fuse<IAccount>(accountsPerBranch ?? [], {
                keys: [{ name: 'name', weight: 0.4 }],
                threshold: 0.3,
                minMatchCharLength: 2,
            }),
        [accountsPerBranch]
    )

    const filtered = useMemo(() => {
        if (!search?.trim()) {
            return accountsPerBranch ?? []
        }

        return fuse.search(search).map((result) => result.item)
    }, [search, fuse, accountsPerBranch])

    return (
        <div className="flex flex-col items-center gap-2 overflow-y-auto overflow-x-hidden max-h-screen pr-1 ecoop-scroll">
            <div className="sticky top-0 z-10 w-full space-y-1 bg-background pt-2 pb-4 border-b">
                <div className="border-primary/20 bg-background border flex items-center p-2 rounded-xl min-w-xs">
                    {' '}
                    <BuildingIcon className="mr-2" />
                    <span className="font-semibold grow">{branch.name}</span>
                    <RefreshButton className="" onClick={refetch} />
                </div>
                <SearchInput
                    className="max-w-full w-full"
                    inputClassName="border-1"
                    placeholder="Search accounts..."
                    setSearchTerm={setSearch}
                />
            </div>
            {isConsolidatedAccountsRefetching ||
            isConsolidatedAccountsLoading ? (
                <>
                    {Array.from({ length: 20 }).map((_, index) => (
                        <Skeleton
                            className="w-full h-10 opacity-60"
                            key={index}
                        />
                    ))}
                </>
            ) : consolidatedAccounts?.length === 0 ? (
                <Empty className="border w-fit max-w-xs min-w-xs">
                    <EmptyIcon size={25} />
                    No accounts consolidated yet for this account.
                </Empty>
            ) : (
                consolidatedAccounts?.map((account) => {
                    return (
                        <Button
                            className="min-w-xs"
                            disabled={true}
                            key={account.id}
                            onClick={() => {
                                mutateLinkAccount({
                                    primary_account_id: accountId,
                                    linked_account_id: account.id,
                                })
                            }}
                            size={'sm'}
                        >
                            {highlightMatch(
                                account.linked_account.name,
                                search
                            )}
                        </Button>
                    )
                })
            )}
            {isRefetching || isLoading ? (
                <>
                    {Array.from({ length: 20 }).map((_, index) => (
                        <Skeleton
                            className="w-full h-10 opacity-60"
                            key={index}
                        />
                    ))}
                </>
            ) : accountsPerBranch?.length === 0 ? (
                <Empty className="border w-fit max-w-xs min-w-xs">
                    <EmptyIcon size={25} />
                    No accounts available to link in this branch.
                </Empty>
            ) : (
                filtered.map((account) => {
                    return (
                        <Button
                            className="min-w-xs"
                            disabled={consolidatedAccounts?.some(
                                (consolidated) =>
                                    consolidated.linked_account_id ===
                                    account.id
                            )}
                            key={account.id}
                            onClick={() => {
                                mutateLinkAccount({
                                    primary_account_id: accountId,
                                    linked_account_id: account.id,
                                })
                            }}
                            size={'sm'}
                            variant={'secondary'}
                        >
                            {highlightMatch(account.name, search)}
                        </Button>
                    )
                })
            )}
        </div>
    )
}

export default AccountConsolidationModal
