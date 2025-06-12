import SingleImageUpload, {
    ISingleImageUploadProps,
} from './single-image-uploader'
import Modal, { IModalProps } from '../modals/modal'

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
