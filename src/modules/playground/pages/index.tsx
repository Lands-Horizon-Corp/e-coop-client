import Broadcaster from '../components/broadcaster'
import PDFUploader from '../components/pdf-uploader'

function PlaygroundPage() {
    return (
        <div className="min-h-screen bg-background p-8 font-sans text-foreground transition-colors duration-300">
            <Broadcaster />
            <PDFUploader />
        </div>
    )
}

export default PlaygroundPage
