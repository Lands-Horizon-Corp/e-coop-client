import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import InventoryHazardTable from '../components'
import { InventoryHazardCreateUpdateModal } from '../components/create-update-inventory-hazard-modal'

const InventoryHazardPage = () => {
    const createModal = useModalState(false)
    return (
        <PageContainer>
            <InventoryHazardCreateUpdateModal {...createModal} />
            <InventoryHazardTable
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

export default InventoryHazardPage
