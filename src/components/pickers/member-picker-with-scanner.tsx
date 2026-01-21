import { useState } from 'react'

import { cn } from '@/helpers'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { IQRMemberProfileDecodedResult } from '@/modules/qr-crypto'
import {
    TransactionMemberProfile,
    TransactionViewNoMemberSelected,
} from '@/modules/transaction'
import { IPickerBaseProps } from '@/types/component-types/picker'
import { EyeIcon, ScanLineIcon } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import QrCodeScanner from '@/components/qrcode-scanner'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

interface MemberProfilePickerWithScannerProps
    extends Partial<IPickerBaseProps<IMemberProfile>> {
    className?: string
    isUpdate?: boolean
    handleSuccessScan: (data: IQRMemberProfileDecodedResult) => void
    isLoadingScanner?: boolean
    handleClearMember: () => void
}

const ScannerView = ({
    isScanning,
    onStartScan,
    onScanSuccess,
}: {
    isScanning: boolean
    onStartScan: () => void
    onScanSuccess: (data: IQRMemberProfileDecodedResult) => void
}) => (
    <div className="flex flex-col flex-shrink-0 xl:w-[15rem] justify-center items-center w-full">
        <div className="w-full xl:p-1 mr-1 mb-1 xl:mb-0 flex justify-center">
            <div className="xl:w-fit w-full aspect-square min-h-[150px] md:w-[50%] max-w-full rounded-2xl overflow-hidden">
                {isScanning ? (
                    <QrCodeScanner<IQRMemberProfileDecodedResult>
                        onSuccessDecode={onScanSuccess}
                    />
                ) : (
                    <div className="flex flex-col size-full items-center justify-center text-center gap-y-2">
                        <ScanLineIcon
                            className="text-muted-foreground/70"
                            size={50}
                        />
                        <Button onClick={onStartScan} size="sm">
                            <EyeIcon className="mr-1 h-4 w-4" />
                            Scan QR (s)
                        </Button>
                        <p className="text-muted-foreground/70 text-xs">
                            Or search for a member
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
)

// --- MAIN COMPONENT ---
const MemberProfilePickerWithScanner = ({
    className,
    isUpdate,
    value,
    onSelect,
    handleSuccessScan,
    isLoadingScanner = false,
    modalState,
    handleClearMember,
    ...memberPickerProps
}: MemberProfilePickerWithScannerProps) => {
    const [startScanner, setStartScanner] = useState(false)

    useHotkeys(
        's',
        (e) => {
            e.preventDefault()
            if (!value && !isUpdate) {
                setStartScanner(!startScanner)
            }
        },
        [value, isUpdate, startScanner, setStartScanner]
    )

    const hasMember = !!value

    return (
        <div
            className={cn(
                'flex flex-col xl:flex-row min-w-fit h-fit bg-sidebar min-h-fit ecoop-scroll rounded-2xl',
                className
            )}
        >
            <MemberPicker
                modalState={modalState}
                {...memberPickerProps}
                onSelect={onSelect}
                value={value}
            />
            {hasMember ? (
                <div className="flex flex-col flex-1 w-full h-full">
                    <TransactionMemberProfile
                        allowRemoveButton
                        className="h-full"
                        hasTransaction={false}
                        memberInfo={value}
                        onRemove={handleClearMember}
                        viewOnly
                    />
                </div>
            ) : (
                <>
                    <ScannerView
                        isScanning={startScanner}
                        onScanSuccess={handleSuccessScan}
                        onStartScan={() => setStartScanner(true)}
                    />
                    <div className="flex flex-col flex-1 w-full h-full">
                        {isLoadingScanner ? (
                            <p className="text-muted-foreground/70 flex items-center p-4">
                                <LoadingSpinner className="mr-2 h-4 w-4" />
                                Loading member profile...
                            </p>
                        ) : (
                            <>
                                <TransactionViewNoMemberSelected
                                    onClick={(e) => {
                                        e.preventDefault()
                                        modalState?.onOpenChange(true)
                                    }}
                                />
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export default MemberProfilePickerWithScanner
