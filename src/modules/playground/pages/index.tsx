import AuthGuard from '@/components/wrappers/auth-guard'
import UserOrgGuard from '@/components/wrappers/user-org-guard'

import Broadcaster from '../components/broadcaster'
import GeneratedReports from '../components/generated-reports'
import PDFUploader from '../components/pdf-uploader'

function PlaygroundPage() {
    return (
        <AuthGuard>
            <UserOrgGuard>
                <div className="min-h-screen bg-background p-8 font-sans text-foreground transition-colors duration-300">
                    <Broadcaster />
                    <PDFUploader />
                    <GeneratedReports />
                </div>
            </UserOrgGuard>
        </AuthGuard>
    )
}

export default PlaygroundPage
