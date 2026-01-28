import { useCallback, useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IQRMemberProfileDecodedResult } from '@/modules/qr-crypto'
import {
    TransactionMemberProfile,
    TransactionViewNoMemberSelected,
} from '@/modules/transaction'
import { ScanLineIcon } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import { EyeIcon } from '@/components/icons'
import QrCodeScanner from '@/components/qrcode-scanner'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import { Kbd } from '@/components/ui/kbd'

import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import { IBaseProps } from '@/types'

import { IMemberProfile } from '../../member-profile'
import MemberPicker from '../../member-profile/components/member-picker'
import { useGetMemberProfileById } from '../../member-profile/member-profile.service'
import { useTransactionContext } from '../context/transaction-context'

interface MemberQrScannerProps extends IBaseProps {}

const TransactionMemberScanner = ({ className }: MemberQrScannerProps) => {
    const [startScan, setStartScan] = useState(false)

    const {
        transactionId,
        form,
        memberScanner,
        selectedMember,
        selectedMemberId,
        hasSelectedMember,
    } = useTransactionContext()

    const focusedId = form.getValues('decoded_member_profile_id') ?? ''
    const {
        data,
        isPending,
        isError,
        error: rawError,
        isSuccess,
    } = useGetMemberProfileById({
        id: focusedId,
        options: {
            enabled: focusedId !== undefined && focusedId !== null,
        },
    })

    const handleSuccess = useCallback(
        (data: IMemberProfile) => {
            form.setValue('member_profile', data)
            form.setValue('member_profile_id', data.id)
        },
        [form]
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
                'flex flex-col xl:flex-row w-full xl:h-fit h-full ecoop-scroll rounded-2xl',
                hasSelectedMember ? 'h-fit! pb-2' : 'p-2',
                className
            )}
        >
            <MemberPicker
                modalState={memberScanner}
                onSelect={(selectedMember) => {
                    form.setValue('member_profile', selectedMember)
                    form.setValue('member_profile_id', selectedMember.id)
                }}
                placeholder="Select Member"
                triggerClassName="hidden"
            />
            {/* Left: Scanner Column */}
            {!selectedMemberId && (
                <div className="flex flex-col justify-center items-center">
                    <div className="w-full flex justify-center">
                        <div
                            className={cn(
                                '',
                                startScan && !selectedMemberId
                                    ? 'size-48'
                                    : 'p-4'
                            )}
                        >
                            {startScan && !selectedMemberId ? (
                                <QrCodeScanner<IQRMemberProfileDecodedResult>
                                    allowMultiple
                                    onSuccessDecode={(data) => {
                                        if (data.type !== 'member-qr') {
                                            return toast.error(
                                                'Invalid QR. Please use a valid Member Profile QR'
                                            )
                                        }
                                        form.setValue(
                                            'decoded_member_profile_id',
                                            data.data.member_profile_id
                                        )
                                    }}
                                />
                            ) : (
                                <div className="flex flex-col size-40 aspect-square items-center justify-center text-center gap-y-2">
                                    <ScanLineIcon className=" text-muted-foreground/70 size-[40%]" />
                                    <Button
                                        disabled={
                                            !!transactionId ||
                                            !!selectedMemberId
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
                                        Press <Kbd>S</Kbd> to start scan
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {!selectedMemberId && (
                <TransactionViewNoMemberSelected
                    className="min-h-54"
                    disabledSelectTrigger={!!transactionId}
                    onClick={(e) => {
                        e.preventDefault()
                        memberScanner.onOpenChange(true)
                    }}
                />
            )}

            {/* Right: Content Column */}
            <div className="flex flex-col flex-1">
                {isPending && focusedId !== undefined && (
                    <p className="text-muted-foreground/70 flex items-center">
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                        Loading member profile
                    </p>
                )}
                {error && <FormErrorMessage errorMessage={error} />}
                {selectedMember && selectedMemberId && (
                    <div className="h-full">
                        <TransactionMemberProfile
                            allowRemoveButton
                            className="h-full"
                            hasTransaction={false}
                            memberInfo={selectedMember}
                            onRemove={() => {
                                form.setValue('member_profile', undefined)
                                form.setValue('member_profile_id', undefined)
                            }}
                            onSelectedJointMember={(selectedMember) => {
                                if (selectedMember) {
                                    form.setValue(
                                        'member_join_id',
                                        selectedMember
                                    )
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default TransactionMemberScanner
