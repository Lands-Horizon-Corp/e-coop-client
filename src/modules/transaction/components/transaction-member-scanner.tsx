import { useState } from 'react'

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
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import { Kbd } from '@/components/ui/kbd'
import { Skeleton } from '@/components/ui/skeleton'

import { IBaseProps } from '@/types'

import MemberPicker from '../../member-profile/components/member-picker'
import { useGetMemberProfile } from '../../member-profile/member-profile.service'
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
        handlers: { resetTransaction },
    } = useTransactionContext()

    const {
        mutate: getMemberProfile,
        isPending: isLoadingMember,
        error: rawError,
    } = useGetMemberProfile({
        options: {
            onSuccess: (data) => {
                form.setValue('member_profile', data)
                form.setValue('member_profile_id', data.id)
            },
            onError: (error) => {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage || 'Failed to fetch member profile')
            },
        },
    })

    const error = serverRequestErrExtractor({ error: rawError })

    useHotkeys('s', (e) => {
        e.preventDefault()
        if (!transactionId) {
            setStartScan((start) => !start)
        }
    })

    const hasMember = !!selectedMember && !!selectedMemberId
    const showEmptyState = !isLoadingMember && !hasMember

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
            {!hasMember && (
                <div className="flex flex-col justify-center items-center">
                    <div className="w-full flex justify-center">
                        <div
                            className={cn(
                                startScan && !hasMember ? 'size-48' : 'p-4'
                            )}
                        >
                            {startScan && !hasMember ? (
                                <QrCodeScanner<IQRMemberProfileDecodedResult>
                                    allowMultiple
                                    onSuccessDecode={(data) => {
                                        if (data.type !== 'member-qr') {
                                            return toast.error(
                                                'Invalid QR. Please use a valid Member Profile QR'
                                            )
                                        }
                                        getMemberProfile(
                                            data.data.member_profile_id
                                        )
                                    }}
                                />
                            ) : (
                                <div className="flex flex-col size-40 aspect-square items-center justify-center text-center gap-y-2">
                                    <ScanLineIcon className="text-muted-foreground/70 size-[40%]" />
                                    <Button
                                        disabled={
                                            !!transactionId ||
                                            !!selectedMemberId
                                        }
                                        onClick={() =>
                                            setStartScan((prev) => !prev)
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

            {/* Right: Content Column */}
            <div className="flex flex-col flex-1 ">
                {isLoadingMember && <MemberProfileSkeleton />}

                {!isLoadingMember && error && (
                    <FormErrorMessage errorMessage={error} />
                )}

                {hasMember && !isLoadingMember && (
                    <div className="h-full">
                        <TransactionMemberProfile
                            allowRemoveButton
                            className="h-full"
                            hasTransaction={false}
                            memberInfo={selectedMember}
                            onRemove={resetTransaction}
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

                {/* 4️⃣ Empty State */}
                {showEmptyState && (
                    <TransactionViewNoMemberSelected
                        className="min-h-54"
                        disabledSelectTrigger={!!transactionId}
                        onClick={(e) => {
                            e.preventDefault()
                            memberScanner.onOpenChange(true)
                        }}
                    />
                )}
            </div>
        </div>
    )
}

const MemberProfileSkeleton = () => {
    return (
        <div className="space-y-4 p-4 flex w-full h-full items-center justify-center ">
            <div className="w-full inline-flex items-start justify-center rounded-2xl bg-card p-5">
                <Skeleton className=" size-20 rounded-xl" />
                <div className=" w-full flex flex-col items-start justify-between gap-y-3 ml-4">
                    <Skeleton className="h-4 w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4 rounded-xl" />
                    <Skeleton className="h-4 w-1/2 rounded-xl" />
                </div>
            </div>
        </div>
    )
}

export default TransactionMemberScanner
