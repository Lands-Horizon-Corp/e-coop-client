import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'

import InventoryCategoryTable from '../components'
import { InventoryCategoryCreateUpdateModal } from '../components/create-update-inventory-category-modal'

const InventoryCategoryPage = () => {
    const createModal = useModalState(false)
    return (
        <PageContainer>
            <InventoryCategoryCreateUpdateModal {...createModal} />
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

export default InventoryCategoryPage
