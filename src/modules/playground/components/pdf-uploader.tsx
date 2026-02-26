import { useRef, useState } from 'react'

import PdfViewer from '@/modules/pdf-viewer/components/pdf-viewer'

import { UploadIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

function PDFUploader() {
    const [file, setFile] = useState<File | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (f && f.type === 'application/pdf') {
            setFile(f)
        }
        e.target.value = ''
    }
    return (
        <>
            <div className="text-center space-y-4">
                <input
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={inputRef}
                    type="file"
                />
                <Button
                    className="gap-2"
                    onClick={() => inputRef.current?.click()}
                    variant="outline"
                >
                    <UploadIcon className="h-4 w-4" />
                    Choose PDF
                </Button>
            </div>

            {file && <PdfViewer file={file} onClose={() => setFile(null)} />}
        </>
    )
}
export default PDFUploader
