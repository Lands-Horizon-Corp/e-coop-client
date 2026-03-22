import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import PermissionGuard from '@/modules/permission/components/permission-guard'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import CheckWarehousingTable from '../components/check-warehouse-table'
import { CheckWarehousingCreateUpdateFormModal } from '../components/create-update-check-warehousing-modal'

const CheckWarehousingPage = () => {
    const createModal = useModalState()

    return (
        <PageContainer>
            <PermissionGuard action="Read" resourceType="CheckWarehousing">
                <CheckWarehousingCreateUpdateFormModal {...createModal} />
                <CheckWarehousingTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => createModal.onOpenChange(true),
                            disabled: !hasPermissionFromAuth({
                                action: 'Create',
                                resourceType: 'CheckWarehousing',
                            }),
                        },
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default CheckWarehousingPage
