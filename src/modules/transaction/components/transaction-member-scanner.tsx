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

    useHotkeys('s', (e) => {
        e.preventDefault()
        if (!transactionId) {
            setStartScan((start) => !start)
        }
    })
    return (
        <div
            className={cn(
                'flex flex-col xl:flex-row w-full h-fit bg-sidebar min-h-fit ecoop-scroll  rounded-2xl',
                className
            )}
        >
            <MemberPicker
                triggerClassName="hidden"
                modalState={{
                    open: openMemberPicker,
                    onOpenChange: setOpenMemberPicker,
                }}
                onSelect={(selectedMember) => {
                    setSelectedMember(selectedMember)
                }}
                placeholder="Select Member"
            />
            {/* Left: Scanner */}
            <div className="flex flex-col flex-shrink-0 xl:w-[15rem] justify-center items-center w-full">
                <div className="w-full xl:p-1 mr-1 mb-1 xl:mb-0 flex justify-center">
                    <div
                        className={cn(
                            startScan && !selectedMember
                                ? 'xl:w-fit w-full aspect-square min-h-[150px] md:w-[50%] max-w-full rounded-2xl overflow-hidden '
                                : 'p-4'
                        )}
                    >
                        {startScan && !selectedMember ? (
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
                        ) : (
                            <div className="flex flex-col size-full aspect-square min-h-[150px] max-w-full items-center justify-center text-center gap-y-2 ">
                                <ScanLineIcon
                                    size={50}
                                    className=" text-muted-foreground/70"
                                />
                                <Button
                                    disabled={
                                        !!transactionId || !!selectedMember
                                    }
                                    onClick={() =>
                                        setStartScan((start) => !start)
                                    }
                                    size="sm"
                                >
                                    <EyeIcon className="mr-1 h-4 w-4" />
                                    Start
                                </Button>
                                <p className="text-muted-foreground/70 text-xs">
                                    Click start to scan member QR
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col flex-1 w-full h-full">
                {isPending && decodedMemberProfile !== undefined && (
                    <p className="text-muted-foreground/70 flex items-center">
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                        Loading member profile
                    </p>
                )}
                {error && <FormErrorMessage errorMessage={error} />}
                {selectedMember ? (
                    <div className="h-full">
                        <TransactionMemberProfile
                            className="h-full"
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
