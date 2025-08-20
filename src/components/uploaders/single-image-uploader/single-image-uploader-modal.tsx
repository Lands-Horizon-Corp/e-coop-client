import Modal, { IModalProps } from '@/components/modals/modal'

import SingleImageUpload, { ISingleImageUploadProps } from '.'

interface Props extends IModalProps {
    singleImageUploadProps: ISingleImageUploadProps
}

const SingleImageUploaderModal = ({
    singleImageUploadProps,
    ...props
}: Props) => {
    return (
        <Modal {...props}>
            <SingleImageUpload {...singleImageUploadProps} />
        </Modal>
    )
}

export default SingleImageUploaderModal
