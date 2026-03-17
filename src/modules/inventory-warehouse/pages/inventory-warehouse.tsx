import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import InventoryWarehouseTable from '../components'
import { InventoryWarehouseCreateUpdateModal } from '../components/create-update-inventory-warehouse-modal'

const InventoryWarehousePage = () => {
    const createModal = useModalState(false)
    return (
        <PageContainer>
            <InventoryWarehouseCreateUpdateModal {...createModal} />
            <InventoryWarehouseTable
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

export default InventoryWarehousePage
