export const downloadPDF = (url: string, filename?: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename ?? ''
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export const printPDF = (fileUrl: string) => {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = fileUrl
    document.body.appendChild(iframe)
    iframe.onload = () => {
        iframe.contentWindow?.print()
        setTimeout(() => document.body.removeChild(iframe), 1000)
    }
}
