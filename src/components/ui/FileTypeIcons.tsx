import { FileXIcon, ImageIcon } from '../icons'
import attachmentAudio from '@/assets/images/file-thumbnails/attachment-audio.svg'
import attachmentDoc from '@/assets/images/file-thumbnails/attachment-doc.svg'
import attachmentSheet from '@/assets/images/file-thumbnails/attachment-sheet.svg'
import attachmentpdf from '@/assets/images/file-thumbnails/attachment-pdf.svg'
import attachmentTxt from '@/assets/images/file-thumbnails/attachment-txt.svg'
import attachmentVideo from '@/assets/images/file-thumbnails/attachment-video.svg'

export const FileTypeIcons = {
    audio: <img src={attachmentAudio} loading="lazy" alt="attachment-audio" />,
    video: <img src={attachmentVideo} loading="lazy" alt="attachment-video" />,
    doc: <img src={attachmentDoc} loading="lazy" alt="attachment-doc" />,
    pdf: <img src={attachmentpdf} loading="lazy" alt="attachment-pdf" />,
    sheet: <img src={attachmentSheet} loading="lazy" alt="attachment-sheet" />,
    text: <img src={attachmentTxt} loading="lazy" alt="attachment-text" />,
    image: (
        <div className="flex size-8 items-center justify-center rounded-sm bg-green-100">
            <ImageIcon className="size-5 text-green-800" />
        </div>
    ),
    unknown: (
        <div className="flex size-8 items-center justify-center rounded-sm bg-slate-100">
            <FileXIcon className="size-5 text-slate-800" />
        </div>
    ),
}
