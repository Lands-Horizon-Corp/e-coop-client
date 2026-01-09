import { useCallback, useState } from 'react'

import { toast } from 'sonner'

// import { SHORTCUT_SCOPES } from '@/constants'
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
// import { useShortcutContext } from '@/components/shorcuts/general-shortcuts-wrapper'
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
    handleRemoveMember?: () => void
}

const TransactionMemberScanner = ({
    className,
    transactionId,
    handleRemoveMember,
}: MemberQrScannerProps) => {
    const [startScan, setStartScan] = useState(false)
    // const { setActiveScope } = useShortcutContext()

    const {
        setSelectedMember,
        selectedMember,
        setOpenMemberPicker,
        openMemberPicker,
        setDecodedMemberProfile,
        decodedMemberProfile,
        handleResetAll,
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
                'flex flex-col xl:flex-row w-full h-fit min-h-fit ecoop-scroll rounded-2xl',
                className
            )}
            onClick={(e) => {
                e.preventDefault()
                // setActiveScope(SHORTCUT_SCOPES.PAYMENT)
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
            {!selectedMember && (
                <div className="flex flex-col flex-shrink-0 justify-center items-center">
                    <div className="w-full flex justify-center">
                        <div
                            className={cn(
                                '',
                                startScan && !selectedMember ? 'size-48' : 'p-4'
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
                                <div className="flex flex-col size-40 aspect-square items-center justify-center text-center gap-y-2">
                                    <ScanLineIcon className=" text-muted-foreground/70 size-[40%]" />
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
            )}

            {/* Right: Content Column */}
            <div className="flex flex-col flex-1 h-full">
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
                            allowRemoveButton
                            className="h-full"
                            hasTransaction={false}
                            memberInfo={selectedMember}
                            onRemove={() => {
                                setSelectedMember(null)
                                handleResetAll()
                                handleRemoveMember?.()
                            }}
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
