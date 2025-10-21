import { cn } from '@/helpers'
import { getFileCategory } from '@/helpers/common-helper'
import { IMedia } from '@/modules/media'
import { IconType } from 'react-icons/lib'

import {
    DocumentFileFillIcon,
    FileFillIcon,
    ImageFileFillIcon,
    MusicFileFillIcon,
    PDFFileFillIcon,
    SpreadSheetFileIcon,
    TextFileFillIcon,
    VideoFileFillIcon,
} from '@/components/icons'

import { IClassProps } from '@/types'

interface Props {
    media: IMedia
}

export const getMediaResourceFileIcon = ({ media }: Props): IconType => {
    const category = getFileCategory(media.file_name, media.file_type)

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
    const category = getFileCategory(media.file_name, media.file_type)

    switch (category) {
        case 'pdf':
            return (
                <span
                    className={cn(
                        'text-destructive',
                        commonIconClass,
                        className
                    )}
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
                    className={cn(
                        'text-destructive',
                        commonIconClass,
                        className
                    )}
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
                    className={cn('text-primary', commonIconClass, className)}
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
