import { useInfoModalStore } from '@/store/info-modal-store'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import Modal from './modal'

const InfoModal = () => {
    const {
        isOpen,
        onClose,
        onConfirm,
        infoDatas: {
            component,
            classNames,
            hideConfirm,
            confirmString,
            ...rest
        },
    } = useInfoModalStore()

    return (
        <Modal open={isOpen} onOpenChange={onClose} {...rest} {...classNames}>
            <Separator className="bg-muted/70" />
            {component}
            <Separator className="bg-muted/70" />
            {!hideConfirm && (
                <div className="flex justify-end gap-x-2">
                    <Button
                        variant={'ghost'}
                        onClick={onConfirm}
                        className="bg-muted/60 hover:bg-muted"
                    >
                        {confirmString}
                    </Button>
                </div>
            )}
        </Modal>
    )
}

export default InfoModal
