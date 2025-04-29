import { useState } from 'react'

import Modal from '@/components/modals/modal'
import { QrCodeIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { QrCode, QrCodeDownloadable } from '@/components/qr-code'

const AccountQr = ({ fileName = 'profile-qr' }: { fileName?: string }) => {
    const [toggle, setToggle] = useState(false)

    const stringContent = 'as0f97as09 f7as0f8 sa'

    return (
        <>
            <Button
                size="icon"
                variant="ghost"
                onClick={() => setToggle((val) => !val)}
                className="absolute right-5 top-5 ml-2 inline h-[40%] w-auto bg-transparent text-foreground/60 sm:h-[70%]"
            >
                {!stringContent ? (
                    <QrCodeIcon className="size-full" />
                ) : (
                    <QrCode
                        value={stringContent}
                        className="size-full rounded-sm p-0.5"
                    />
                )}
            </Button>
            <Modal
                open={toggle}
                title="Profile QR"
                className="p-4 pb-8"
                description="QR of account for easy processing/trasactions."
                onOpenChange={(val) => setToggle(val)}
            >
                <QrCodeDownloadable
                    fileName={fileName}
                    value={stringContent}
                    className="size-80 p-3"
                    containerClassName="mx-auto"
                />
            </Modal>
        </>
    )
}

export default AccountQr
