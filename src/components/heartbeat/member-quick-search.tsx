import { useState } from 'react'

import { cn } from '@/lib'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IMemberProfile } from '@/types'

import { ScanLineIcon } from '../icons'
import MemberPicker from '../pickers/member-picker'
import MemberProfileQrResultCard from '../qrcode-scanner/qr-elements/member-profile-qr-result-card'
import { MemberQrScannerModal } from '../qrcode-scanner/scanners/member-qr-scanner'
import { Button } from '../ui/button'

interface Props extends IClassProps {}

const MemberQuickSearch = ({ className }: Props) => {
    const qrScannerModal = useModalState()
    const [memberProfile, setMemberProfile] = useState<
        undefined | IMemberProfile
    >()

    return (
        <div className={cn('', className)}>
            <div className="flex items-center gap-x-2">
                <MemberPicker
                    value={memberProfile}
                    onSelect={(foundMemberProfile) =>
                        setMemberProfile(foundMemberProfile)
                    }
                />
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-fit p-2 text-muted-foreground "
                    onClick={() => qrScannerModal.onOpenChange(true)}
                >
                    <ScanLineIcon />
                </Button>
                <MemberQrScannerModal
                    {...qrScannerModal}
                    scannerProps={{
                        onSelectMemberProfile: () => {},
                        onResultFound: (memberProfile) => {
                            setMemberProfile(memberProfile)
                            qrScannerModal.onOpenChange(false)
                        },
                    }}
                />
            </div>
            <div>
                <MemberProfileQrResultCard memberProfile={memberProfile} />
            </div>
        </div>
    )
}

export default MemberQuickSearch
