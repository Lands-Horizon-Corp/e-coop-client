import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import InventoryBrandTable from '../components'
import { InventoryBrandCreateUpdateFormModal } from '../components/inventory-brancd-create-update-modal'

const InventoryBrandPage = () => {
    const createModal = useModalState(false)
    return (
        <PageContainer>
            <InventoryBrandCreateUpdateFormModal {...createModal} />
            <InventoryBrandTable
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

export default InventoryBrandPage
