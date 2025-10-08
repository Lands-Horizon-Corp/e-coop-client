import { useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'

import { QrCodeIcon } from '@/components/icons'
import Modal from '@/components/modals/modal'
import { QrCode, QrCodeDownloadable } from '@/components/qr-code'
import { Button } from '@/components/ui/button'

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
                className={cn(
                    'inline h-[40%] w-auto bg-transparent text-foreground/60 sm:h-[70%]',
                    className
                )}
                onClick={() => {
                    if (!accountQrPayload)
                        return toast.warning('QR Code has no Value')
                    setToggle((val) => !val)
                }}
                size="icon"
                variant="ghost"
            >
                {!accountQrPayload ? (
                    <QrCodeIcon className="size-full" />
                ) : (
                    <QrCode
                        className="size-full rounded-sm p-0.5"
                        value={accountQrPayload}
                    />
                )}
            </Button>
            <Modal
                className="p-4 pb-8"
                description="QR of account for easy processing/trasactions."
                onOpenChange={(val) => setToggle(val)}
                open={toggle}
                title="Profile QR"
            >
                <QrCodeDownloadable
                    className="size-80 p-3"
                    containerClassName="mx-auto"
                    fileName={fileName}
                    value={accountQrPayload}
                />
            </Modal>
        </>
    )
}

export default AccountQr
