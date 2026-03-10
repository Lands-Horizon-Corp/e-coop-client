import { useRef, useState } from 'react'

import PdfViewer from '@/modules/pdf-viewer/components/pdf-viewer'

import { UploadIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

function PDFUploader() {
    const [file, setFile] = useState<File | null>(null)
    const [open, setOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (f && f.type === 'application/pdf') {
            setFile(f)
            setOpen(true)
        }
        e.target.value = ''
    }

    const handleClose = () => {
        setOpen(false)
        setFile(null)
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

            <Dialog onOpenChange={setOpen} open={open}>
                <DialogContent className="flex flex-col w-[90vw] !max-w-[1200px] h-[90vh] p-0 overflow-hidden">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle>PDF Viewer</DialogTitle>

                    </DialogHeader>

                    {file && (
                        <PdfViewer
                            className="flex-1 min-h-0 h-[400px]"
                            file={file}
                            onClose={handleClose}
                            pageWidth={1400}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default PDFUploader
