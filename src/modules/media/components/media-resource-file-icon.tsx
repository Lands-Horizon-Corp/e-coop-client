import { cn } from '@/helpers'
import { IMedia } from '@/modules/media'
import { IconType } from 'react-icons/lib'

import {
    BookOpenIcon,
    CodeFileFillIcon,
    CompressedFileFillIcon,
    DocumentFileFillIcon,
    FileFillIcon,
    FontFileFillIcon,
    ImageFileFillIcon,
    MusicFileFillIcon,
    PDFFileFillIcon,
    PresentationFileFillIcon,
    SpreadSheetFileIcon,
    TextFileFillIcon,
    VideoFileFillIcon,
} from '@/components/icons'

import { IClassProps } from '@/types'

import { getFileCategory, getFileInfo } from '../'

interface Props {
    media: IMedia | File
}

export const getMediaResourceFileIcon = ({ media }: Props): IconType => {
    const { fullFileName, fileType } = getFileInfo(media)
    const category = getFileCategory(fullFileName, fileType)

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
        case 'compressed':
            return CompressedFileFillIcon
        case 'code':
            return CodeFileFillIcon
        case 'font':
            return FontFileFillIcon
        case 'ebook':
            return BookOpenIcon
        case 'presentation':
            return PresentationFileFillIcon
    }

    return FileFillIcon
}

const commonIconClass =
    'flex size-full items-center justify-center rounded-sm p-2'

const MediaResourceFileIcon = ({
    media,
    className,
    iconClassName,
}: { media: IMedia | File; iconClassName?: string } & IClassProps) => {
    const { fullFileName, fileType } = getFileInfo(media)
    const category = getFileCategory(fullFileName, fileType)

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
        case 'compressed':
            return (
                <span
                    className={cn('text-amber-500', commonIconClass, className)}
                >
                    <CompressedFileFillIcon className={iconClassName} />
                </span>
            )
        case 'code':
            return (
                <span
                    className={cn('text-green-500', commonIconClass, className)}
                >
                    <CodeFileFillIcon className={iconClassName} />
                </span>
            )
        case 'font':
            return (
                <span
                    className={cn('text-slate-500', commonIconClass, className)}
                >
                    <FontFileFillIcon className={iconClassName} />
                </span>
            )
        case 'ebook':
            return (
                <span
                    className={cn(
                        'text-indigo-500',
                        commonIconClass,
                        className
                    )}
                >
                    <BookOpenIcon className={iconClassName} />
                </span>
            )
        case 'presentation':
            return (
                <span
                    className={cn(
                        'text-orange-500',
                        commonIconClass,
                        className
                    )}
                >
                    <PresentationFileFillIcon className={iconClassName} />
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
