import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import InventoryTagTable from '../components'
import { InventoryTagCreateUpdateFormModal } from '../components/inventory-tag-create-update-modal'

const InventoryTagPage = () => {
    const createModal = useModalState(false)
    return (
        <PageContainer>
            <InventoryTagCreateUpdateFormModal {...createModal} />
            <InventoryTagTable
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

export default InventoryTagPage
