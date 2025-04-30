import { useState } from 'react'
import { AxiosProgressEvent } from 'axios'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

import { IMedia, TEntityId } from '@/types'
import MediaService from '@/api-service/media-service'

const UploadPage = () => {
    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState<number[]>([])
    const [medias, setMedias] = useState<IMedia[]>([])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files)
            setFiles(selectedFiles)
            setProgress(new Array(selectedFiles.length).fill(0))
        }
    }

    const handleUpload = async () => {
        if (files.length === 0) return

        setLoading(true)

        // Upload each file individually with its own progress tracking
        const uploadPromises = files.map((file, index) => {
            return MediaService.upload(
                file,
                (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        const percentage = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )
                        setProgress((prevProgress) => {
                            const updatedProgress = [...prevProgress]
                            updatedProgress[index] = percentage
                            return updatedProgress
                        })
                    }
                }
            )
        })

        try {
            const result = await Promise.all(uploadPromises)
            setMedias(result)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: TEntityId, index: number) => {
        await MediaService.delete(id)
        // Remove the media from the `medias` array
        setMedias((prevMedias) => prevMedias.filter((media) => media.id !== id))

        // Remove the file from the `files` array based on its index
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))

        // Update the progress array as well
        setProgress((prevProgress) =>
            prevProgress.filter((_, i) => i !== index)
        )
    }

    const renderMedia = (media: IMedia) => {
        const { url, fileType, fileName } = media

        if (fileType.startsWith('image')) {
            return <img src={url} alt={fileName} className="mt-2 w-full" />
        } else if (fileType.startsWith('video')) {
            return <video src={url} controls className="mt-2 w-full" />
        } else if (fileType.startsWith('audio')) {
            return <audio src={url} controls className="mt-2 w-full" />
        } else {
            return <p>{fileName}</p> // Display file name for non-media files
        }
    }

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Upload Files</Label>
            <Input
                id="picture"
                type="file"
                multiple
                onChange={handleFileChange}
            />
            <Button
                onClick={handleUpload}
                disabled={loading}
                className="btn-primary mt-2"
            >
                {loading ? 'Uploading...' : 'Upload'}
            </Button>

            {files.map((file, index) => (
                <div key={index} className="mt-2">
                    <p>{file.name}</p>
                    <Progress value={progress[index]} />
                </div>
            ))}

            {medias.map((media, index) => (
                <div key={index} className="mt-4 flex">
                    {renderMedia(media)}
                    <Button
                        variant="destructive"
                        onClick={() => handleDelete(media.id, index)}
                    >
                        Delete
                    </Button>
                </div>
            ))}
        </div>
    )
}

export default UploadPage
