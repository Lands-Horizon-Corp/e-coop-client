import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'
import { TableRowActionStoreProvider } from '@/components/data-table/store/data-table-action-store'

import { AccountTableActionManager } from '../components/tables/row-actions'
import { AccountProvider } from '../context/account-provider'
import AccountWrapper from './account-wrapper'

export const Account = () => {
    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="Account">
                <TableRowActionStoreProvider>
                    <AccountProvider>
                        <AccountWrapper />
                    </AccountProvider>
                    <AccountTableActionManager />
                </TableRowActionStoreProvider>
            </PermissionGuard>
        </PageContainer>
    )
}
export default Account
