import { useQueryClient } from '@tanstack/react-query'

import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useSubscribe } from '@/hooks/use-pubsub'

import TransactionBatchTable, {
    TransactionBatchTableProps,
} from '../transaction-batch-table'

const TransactionBatchPage = () => {
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    const queryClient = useQueryClient()

    useSubscribe(`transaction_batch.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'paginated'],
        })
    })

    useSubscribe(`transaction_batch.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'paginated'],
        })
    })

    useSubscribe(`transaction_batch.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'paginated'],
        })
    })

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="TransactionBatch">
                <TransactionBatchTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    mode="all"
                    toolbarProps={{
                        exportActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Export',
                                resourceType: 'Account',
                            }),
                        } as NonNullable<
                            TransactionBatchTableProps['toolbarProps']
                        >['exportActionProps'],
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default TransactionBatchPage
