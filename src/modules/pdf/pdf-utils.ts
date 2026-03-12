export const downloadPDF = (url: string, filename?: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename ?? ''
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export const printPDF = async (fileUrl: string) => {
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

    // const iframe = document.createElement('iframe')
    // iframe.style.display = 'none'
    // iframe.src = fileUrl
    // document.body.appendChild(iframe)
    // iframe.onload = () => {
    //     iframe.contentWindow?.print()
    //     setTimeout(() => document.body.removeChild(iframe), 1000)
    // }

    // const win = window.open(fileUrl)
    // win?.addEventListener('load', () => {
    //     win.print()
    // })
}
