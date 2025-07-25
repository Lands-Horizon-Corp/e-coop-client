import { MutableRefObject } from 'react'

import Webcam from 'react-webcam'

import WebCam from '../webcam'

interface CaptureSignatureProps {
    camRef: MutableRefObject<Webcam | null>
    isFullScreenMode?: boolean
}

const CaptureSignature = ({ camRef }: CaptureSignatureProps) => {
    return <WebCam className="!mx-0 rounded-lg" ref={camRef} />
}

export default CaptureSignature
