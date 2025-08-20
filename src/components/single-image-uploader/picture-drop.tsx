import { DragEvent, useState } from 'react'
import { toast } from 'sonner'


import { ImageIcon } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { IBaseProps } from '@/types'
import { cn } from '@/helpers/tw-utils'

interface Props extends IBaseProps {
    onFileSelect: (files: FileList) => void
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const PictureDrop = ({ onFileSelect, children }: Props) => {
    const [isDragging, setIsDragging] = useState(false)

    const isFileAllowed = (file: File) => {
        return ALLOWED_IMAGE_TYPES.includes(file.type)
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()

        const droppedFiles = event.dataTransfer.files
        const droppedFilesArray = Array.from(droppedFiles)

        if (droppedFilesArray.length === 1) {
            const file = droppedFilesArray[0]

            if (isFileAllowed(file)) {
                const dataTransfer = new DataTransfer()
                dataTransfer.items.add(file)
                onFileSelect(dataTransfer.files)
            } else {
                toast.error('Only JPG, JPEG, PNG, or WEBP files are allowed!')
            }
        } else if (droppedFilesArray.length > 1) {
            toast.error('Please drop only one image file!')
        } else {
            toast.error('No file was dropped!')
        }

        setIsDragging(false)
    }

    return (
        <>
            <div
                className={cn(
                    'inset pointer-events-none absolute left-0 top-0 z-20 flex size-full items-center justify-center rounded-2xl bg-background/40 opacity-0 backdrop-blur delay-150 duration-300 ease-in-out',
                    isDragging && 'opacity-100'
                )}
            >
                <p className="text-foreground/80">Drop Here Desu</p>
            </div>
            <div>
                <Label htmlFor="picture" className="group z-10 cursor-pointer">
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => {
                            e.preventDefault()
                            setIsDragging(true)
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault()
                            setIsDragging(false)
                        }}
                        className={cn(
                            'min-h-[322px] text-foreground/60 hover:text-foreground/80',
                            'flex flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed p-8 duration-700 ease-in-out',
                            isDragging && 'border-primary text-foreground'
                        )}
                    >
                        {children}
                        {!children && (
                            <ImageIcon className="size-16 text-secondary" />
                        )}
                        <span className="text-sm">Drop your image here</span>
                    </div>
                </Label>
                <Input
                    id="picture"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webm"
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files) {
                            if (isFileAllowed(e.target.files[0]))
                                onFileSelect(e.target.files)
                            else
                                toast.error(
                                    'Only JPG, JPEG, PNG, or WEBP files are allowed!'
                                )
                        }
                    }}
                />
            </div>
        </>
    )
}

export default PictureDrop
