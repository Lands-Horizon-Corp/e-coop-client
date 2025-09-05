import attachmentAudio from '@/assets/images/file-thumbnails/attachment-audio.svg'
import attachmentDoc from '@/assets/images/file-thumbnails/attachment-doc.svg'
import attachmentpdf from '@/assets/images/file-thumbnails/attachment-pdf.svg'
import attachmentSheet from '@/assets/images/file-thumbnails/attachment-sheet.svg'
import attachmentTxt from '@/assets/images/file-thumbnails/attachment-txt.svg'
import attachmentVideo from '@/assets/images/file-thumbnails/attachment-video.svg'

import { FileXIcon, ImageIcon } from '../icons'
import Image from '../image'

export const FileTypeIcons = {
    audio: <Image src={attachmentAudio} alt="attachment-audio" />,
    video: <Image src={attachmentVideo} alt="attachment-video" />,
    doc: <Image src={attachmentDoc} alt="attachment-doc" />,
    pdf: <Image src={attachmentpdf} alt="attachment-pdf" />,
    sheet: <Image src={attachmentSheet} alt="attachment-sheet" />,
    text: <Image src={attachmentTxt} alt="attachment-text" />,
    image: (
        <div className="flex size-8 items-center justify-center rounded-sm bg-primary/10">
            <ImageIcon className="size-5 text-primary/70" />
        </div>
    ),
    unknown: (
        <div className="flex size-8 items-center justify-center rounded-sm bg-slate-100">
            <FileXIcon className="size-5 text-slate-800" />
        </div>
    ),
}
