import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import InventoryCategoryTable from '../components'
import { InventorySupplierCreateUpdateModal } from '../components/create-update-inventory-supplier-modal'

const InventorySupplierPage = () => {
    const createModal = useModalState(false)
    return (
        <PageContainer>
            <InventorySupplierCreateUpdateModal {...createModal} />
            <InventoryCategoryTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
            />
        </PageContainer>
    )
}

export default InventorySupplierPage
