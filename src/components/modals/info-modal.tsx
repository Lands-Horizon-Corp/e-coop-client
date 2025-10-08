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
        <Modal onOpenChange={onClose} open={isOpen} {...rest} {...classNames}>
            <Separator className="bg-muted/70" />
            {component}
            <Separator className="bg-muted/70" />
            {!hideConfirm && (
                <div className="flex justify-end gap-x-2">
                    <Button
                        className="bg-muted/60 hover:bg-muted"
                        onClick={onConfirm}
                        variant={'ghost'}
                    >
                        {confirmString}
                    </Button>
                </div>
            )}
        </Modal>
    )
}

export default InfoModal
