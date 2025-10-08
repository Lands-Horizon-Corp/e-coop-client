import { cn } from '@/helpers/tw-utils'
import useConfirmModalStore from '@/store/confirm-modal-store'

import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const ConfirmModal = () => {
    const { isOpen, modalData, onConfirm, onClose, onCancel } =
        useConfirmModalStore()

    return (
        <Modal
            className={modalData?.modalClassName}
            description={modalData?.description}
            onOpenChange={onClose}
            open={isOpen}
            title={modalData?.title}
        >
            {modalData?.content}
            {modalData?.hideSeparator ? null : <Separator className="my-1" />}
            <div
                className={cn(
                    `flex justify-end gap-x-2`,
                    modalData?.footerClassName
                )}
            >
                <Button
                    className="bg-muted/60 hover:bg-muted"
                    onClick={onCancel}
                    variant={'ghost'}
                >
                    {modalData?.cancelString}
                </Button>
                <Button onClick={onConfirm}>{modalData?.confirmString}</Button>
            </div>
        </Modal>
    )
}

export default ConfirmModal
