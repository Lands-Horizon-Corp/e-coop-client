import Modal, { IModalProps } from '@/components/modals/modal'

import PdfViewer, { PdfViewerProps } from './pdf-viewer'

const PdfViewerModal = ({
    pdfViewerProps,
    ...modalProps
}: IModalProps & { pdfViewerProps: PdfViewerProps }) => {
    return (
        <Modal
            {...modalProps}
            className="!max-w-6xl p-0 ring-4 !outline-none ring-accent"
            closeButtonClassName="hidden"
        >
            <PdfViewer
                className="flex-1 min-h-0 h-[80vh]"
                pageWidth={800}
                {...pdfViewerProps}
                onClose={() => {
                    modalProps.onOpenChange?.(false)
                    pdfViewerProps.onClose?.()
                }}
            />
        </Modal>
    )
}

export default PdfViewerModal
