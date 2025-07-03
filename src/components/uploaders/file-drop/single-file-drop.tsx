import { ReactNode } from 'react'
import { toast } from 'sonner'

import { DropzoneOptions, useDropzone } from 'react-dropzone'

import { Input } from '@/components/ui/input'

import { IClassProps } from '@/types'

import DefaultDropArea from '../drop-areas/default-drop-area'

interface Props
    extends IClassProps,
        Omit<DropzoneOptions, 'onDrop' | 'multiple'> {
    dropText?: string
    RenderDropArea?: (props: { isDragActive: boolean }) => ReactNode
    onFileSelect: (files: FileList) => void
}

const SingleFileDrop = ({
    dropText,
    RenderDropArea,
    onFileSelect,
    ...otherProps
}: Props) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles, fileRejections, e) => {
            if (!Array.isArray(e)) e.stopPropagation()

            if (fileRejections.length > 0) {
                fileRejections.forEach((rejection) => {
                    rejection.errors.forEach((error) => {
                        if (error.code === 'file-invalid-type') {
                            toast.error(
                                'Only JPG, JPEG, PNG, or WEBP files are allowed!'
                            )
                        } else if (error.code === 'too-many-files') {
                            toast.error('Please drop only one image file!')
                        } else {
                            toast.error(error.message)
                        }
                    })
                })
                return
            }

            if (acceptedFiles.length === 1) {
                const file = acceptedFiles[0]
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                onFileSelect(dataTransfer.files)
            } else if (acceptedFiles.length > 1) {
                toast.error('Please drop only one image file!')
            } else {
                toast.error('No file was dropped!')
            }
        },
        multiple: false,
        ...otherProps,
    })

    return (
        <>
            <div className="group relative z-10 cursor-pointer">
                <div {...getRootProps()}>
                    {RenderDropArea ? (
                        RenderDropArea({ isDragActive })
                    ) : (
                        <DefaultDropArea
                            dropText={dropText}
                            className="min-h-80"
                            isDraggingAbove={isDragActive}
                        />
                    )}
                </div>
                <Input {...getInputProps()} id="picture" className="hidden" />
            </div>
        </>
    )
}

export default SingleFileDrop
