import { toast } from 'sonner'
import { useState } from 'react'

import Modal from '@/components/modals/modal'
import { QrCodeIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { QrCode, QrCodeDownloadable } from '@/components/qr-code'

import { cn } from '@/lib'
import { IClassProps } from '@/types'

interface Props extends IClassProps {
    fileName?: string
    accountQrPayload: string
}

const AccountQr = ({
    className,
    accountQrPayload,
    fileName = 'profile-qr',
}: Props) => {
    const [toggle, setToggle] = useState(false)

    return (
        <>
            <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                    if (!accountQrPayload)
                        return toast.warning('QR Code has no Value')
                    setToggle((val) => !val)
                }}
                className={cn(
                    'inline h-[40%] w-auto bg-transparent text-foreground/60 sm:h-[70%]',
                    className
                )}
            >
                {!accountQrPayload ? (
                    <QrCodeIcon className="size-full" />
                ) : (
                    <QrCode
                        value={accountQrPayload}
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
                    value={accountQrPayload}
                    className="size-80 p-3"
                    containerClassName="mx-auto"
                />
            </Modal>
        </>
    )
}

export default AccountQr
