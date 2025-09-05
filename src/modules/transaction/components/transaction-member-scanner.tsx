import { useCallback, useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IQRMemberProfileDecodedResult } from '@/modules/qr-crypto'
import {
    TransactionMemberProfile,
    TransactionViewNoMemberSelected,
} from '@/modules/transaction'
import { useTransactionStore } from '@/store/transaction/transaction-store'
import { ScanLineIcon } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import { EyeIcon } from '@/components/icons'
import QrCodeScanner from '@/components/qrcode-scanner'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'

import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import { IBaseProps, TEntityId } from '@/types'

import { IMemberProfile } from '../../member-profile'
import MemberPicker from '../../member-profile/components/member-picker'
import { useGetMemberProfileById } from '../../member-profile/member-profile.service'

interface MemberQrScannerProps extends IBaseProps {
    transactionId: TEntityId
    fullPath: string
    handleSetTransactionId: () => void
}

const TransactionMemberScanner = ({
    className,
    transactionId,
}: MemberQrScannerProps) => {
    const [startScan, setStartScan] = useState(false)

    const {
        setSelectedMember,
        selectedMember,
        setOpenMemberPicker,
        openMemberPicker,
        setDecodedMemberProfile,
        decodedMemberProfile,
    } = useTransactionStore()
    const focusedId = decodedMemberProfile?.member_profile_id
    const {
        data,
        isPending,
        isError,
        error: rawError,
        isSuccess,
    } = useGetMemberProfileById({
        id: focusedId as TEntityId,
        options: {
            enabled: focusedId !== undefined && focusedId !== null,
        },
    })

    const handleSuccess = useCallback(
        (data: IMemberProfile) => {
            setSelectedMember(data)
        },
        [setSelectedMember]
    )

    useQeueryHookCallback({
        data,
        onSuccess: handleSuccess,
        error: rawError,
        isError,
        isSuccess,
    })

    const error = serverRequestErrExtractor({ error: rawError })

    useHotkeys('s', () => {
        if (!transactionId) {
            setStartScan((start) => !start)
        }
    })

    return (
        <div
            className={cn(
                'flex flex-col lg:flex-row w-full h-fit bg-secondary/20 rounded-2xl p-5',
                className
            )}
        >
            <div className="hidden">
                <MemberPicker
                    modalState={{
                        open: openMemberPicker,
                        onOpenChange: setOpenMemberPicker,
                    }}
                    onSelect={(selectedMember) => {
                        setSelectedMember(selectedMember)
                    }}
                    placeholder="Select Member"
                />
            </div>
            {/* Left: Scanner */}
            <div className="flex flex-col flex-shrink-0 lg:w-[15rem] justify-center items-center w-full">
                <div className="w-fit">
                    {startScan && !selectedMember ? (
                        <div className="w-full aspect-square max-w-[90%] rounded-xl overflow-hidden ">
                            <QrCodeScanner<IQRMemberProfileDecodedResult>
                                allowMultiple
                                onSuccessDecode={(data) => {
                                    if (data.type !== 'member-qr') {
                                        return toast.error(
                                            'Invalid QR. Please use a valid Member Profile QR'
                                        )
                                    }
                                    setDecodedMemberProfile(data.data)
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col h-full items-center justify-center text-center py-8">
                            <ScanLineIcon className="mx-auto h-16 w-16 text-muted-foreground/70" />
                            <Button
                                disabled={!!transactionId || !!selectedMember}
                                onClick={() => setStartScan((start) => !start)}
                                size="sm"
                                variant="outline"
                            >
                                <EyeIcon className="mr-1 h-4 w-4" />
                                Start
                            </Button>
                            <p className="text-muted-foreground/70 text-sm mt-4">
                                Click start to scan member QR
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col flex-1 w-full space-y-4">
                {isPending && decodedMemberProfile !== undefined && (
                    <p className="text-muted-foreground/70 flex items-center">
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                        Loading member profile
                    </p>
                )}
                {error && <FormErrorMessage errorMessage={error} />}
                {selectedMember ? (
                    <div className="space-y-4">
                        <TransactionMemberProfile
                            memberInfo={selectedMember}
                            hasTransaction={false}
                        />
                    </div>
                ) : (
                    <TransactionViewNoMemberSelected
                        onClick={(e) => {
                            e.preventDefault()
                            setOpenMemberPicker(true)
                        }}
                        disabledSelectTrigger={!!transactionId}
                    />
                )}
            </div>
        </div>
    )
}

export default TransactionMemberScanner
