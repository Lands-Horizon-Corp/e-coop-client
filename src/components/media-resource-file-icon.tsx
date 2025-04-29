import { IconType } from 'react-icons/lib'

import {
    FileFillIcon,
    PDFFileFillIcon,
    TextFileFillIcon,
    VideoFileFillIcon,
    ImageFileFillIcon,
    MusicFileFillIcon,
    SpreadSheetFileIcon,
    DocumentFileFillIcon,
} from './icons'

import { cn } from '@/lib'
import { IMedia } from '@/types'
import { IClassProps } from '@/types'
import { getFileCategory } from '@/helpers'

interface Props {
    media: IMedia
}

export const getMediaResourceFileIcon = ({ media }: Props): IconType => {
    const category = getFileCategory(media.fileName, media.fileType)

    switch (category) {
        case 'pdf':
            return PDFFileFillIcon
        case 'text':
            return TextFileFillIcon
        case 'video':
            return VideoFileFillIcon
        case 'image':
            return ImageFileFillIcon
        case 'audio':
            return MusicFileFillIcon
        case 'doc':
            return DocumentFileFillIcon
        case 'sheet':
            return SpreadSheetFileIcon
    }

    return FileFillIcon
}

const commonIconClass = 'size-fit rounded-sm p-1'

const MediaResourceFileIcon = ({
    media,
    className,
    iconClassName,
}: { media: IMedia; iconClassName?: string } & IClassProps) => {
    const category = getFileCategory(media.fileName, media.fileType)

    switch (category) {
        case 'pdf':
            return (
                <span
                    className={cn('text-red-400', commonIconClass, className)}
                >
                    <PDFFileFillIcon className={iconClassName} />
                </span>
            )
        case 'text':
            return (
                <span
                    className={cn(
                        'text-muted-foreground/90',
                        commonIconClass,
                        className
                    )}
                >
                    <TextFileFillIcon className={iconClassName} />{' '}
                </span>
            )
        case 'video':
            return (
                <span
                    className={cn('text-red-400', commonIconClass, className)}
                >
                    <VideoFileFillIcon className={iconClassName} />
                </span>
            )
        case 'image':
            return (
                <span
                    className={cn('text-blue-400', commonIconClass, className)}
                >
                    <ImageFileFillIcon className={iconClassName} />
                </span>
            )
        case 'audio':
            return (
                <span
                    className={cn(
                        'text-purple-400',
                        commonIconClass,
                        className
                    )}
                >
                    <MusicFileFillIcon className={iconClassName} />
                </span>
            )
        case 'doc':
            return (
                <span
                    className={cn('text-sky-500', commonIconClass, className)}
                >
                    <DocumentFileFillIcon className={iconClassName} />
                </span>
            )
        case 'sheet':
            return (
                <span
                    className={cn('text-green-500', commonIconClass, className)}
                >
                    <SpreadSheetFileIcon className={iconClassName} />
                </span>
            )
    }

    return (
        <span className={cn('text-stone-400', commonIconClass, className)}>
            <FileFillIcon className={iconClassName} />
        </span>
    )
}

export default MediaResourceFileIcon
