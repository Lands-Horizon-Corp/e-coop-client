import { downloadFileService } from '@/helpers/file-download'

export const downloadPDF = downloadFileService

export const printPDF = async ({
    fileUrl,
    isMassive = false,
    isPasswordProtected = false,
}: {
    fileUrl: string
    isMassive?: boolean
    isPasswordProtected?: boolean
}) => {
    if (isMassive || isPasswordProtected) {
        const printWindow = window.open(fileUrl, '_blank')
        if (printWindow) {
            printWindow.focus()
        }
        return
    }

    const res = await fetch(fileUrl)
    const blob = await res.blob()
    const downloadUrl = URL.createObjectURL(blob)

    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = downloadUrl

    document.body.appendChild(iframe)
    iframe.onload = () => {
        iframe.contentWindow?.print()
    }
}
