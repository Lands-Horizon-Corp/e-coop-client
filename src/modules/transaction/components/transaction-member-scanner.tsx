import { useCallback, useState } from 'react'

import { toast } from 'sonner'

import { SHORTCUT_SCOPES } from '@/constants'
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
import { useShortcutContext } from '@/components/shorcuts/general-shortcuts-wrapper'
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
    const { setActiveScope } = useShortcutContext()

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
                'flex flex-col xl:flex-row w-full h-fit min-h-fit ecoop-scroll rounded-2xl p-4',
                className
            )}
            onClick={(e) => {
                e.preventDefault()
                setActiveScope(SHORTCUT_SCOPES.PAYMENT)
            }}
        >
            <MemberPicker
                modalState={{
                    open: openMemberPicker,
                    onOpenChange: setOpenMemberPicker,
                }}
                onSelect={(selectedMember) => {
                    setSelectedMember(selectedMember)
                }}
                placeholder="Select Member"
                triggerClassName="hidden"
            />
            {/* Left: Scanner Column */}
            <div className="flex flex-col flex-shrink-0 xl:w-[15rem] justify-center items-center w-full">
                {/* Inner Scanner Wrapper: Removed mr-1/mb-1. Added consistent p-2 for spacing. */}
                <div className="w-full xl:p-2 flex justify-center">
                    <div
                        className={cn(
                            // Apply styles for the active scanner state
                            startScan && !selectedMember
                                ? 'xl:w-fit w-full aspect-square min-h-[150px] md:w-[50%] max-w-full rounded-2xl overflow-hidden'
                                : // Apply padding for the static placeholder state
                                  'p-4'
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
                            // Placeholder box: use size-full and flex-1 to occupy space consistently
                            <div className="flex flex-col size-full aspect-square min-h-[150px] max-w-full items-center justify-center text-center gap-y-2">
                                <ScanLineIcon
                                    className=" text-muted-foreground/70"
                                    size={50}
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

            {/* Right: Content Column */}
            {/* Use 'flex-1 min-w-0' to make it take up the rest of the space in xl:flex-row */}
            <div className="flex flex-col flex-1 w-full h-full p-2">
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
                            hasTransaction={false}
                            memberInfo={selectedMember}
                        />
                    </div>
                ) : (
                    <TransactionViewNoMemberSelected
                        disabledSelectTrigger={!!transactionId}
                        onClick={(e) => {
                            e.preventDefault()
                            setOpenMemberPicker(true)
                        }}
                    />
                )}
            </div>
        </div>
    )
}

export default TransactionMemberScanner
