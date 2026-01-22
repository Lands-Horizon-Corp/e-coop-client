import { useCallback, useState } from 'react'

import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

// import { SHORTCUT_SCOPES } from '@/constants'
import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IQRMemberProfileDecodedResult } from '@/modules/qr-crypto'
import {
    TransactionFromSchema,
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
    form: UseFormReturn<z.infer<typeof TransactionFromSchema>>
}

const TransactionMemberScanner = ({
    className,
    transactionId,
    handleRemoveMember,
    form,
}: MemberQrScannerProps) => {
    const [startScan, setStartScan] = useState(false)

    const { setOpenMemberPicker, openMemberPicker } = useTransactionStore()

    const focusedId = form.watch('decoded_member_profile_id') ?? ''
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

    const selectedMemberId = form.getValues('member_profile_id')
    const hasSelectedMember = !!form.getValues('member_profile_id')
    return (
        <div
            className={cn(
                'flex flex-col xl:flex-row w-full xl:h-fit h-full ecoop-scroll rounded-2xl',
                hasSelectedMember ? 'h-fit!' : '',
                className
            )}
        >
            <MemberPicker
                modalState={{
                    open: openMemberPicker,
                    onOpenChange: setOpenMemberPicker,
                }}
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
                                        Click start to scan member QR
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
                        setOpenMemberPicker(true)
                    }}
                />
                // <div className='min-h-54'>
                //     hello
                // </div>
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
                {selectedMemberId && (
                    <div className="h-full">
                        <TransactionMemberProfile
                            allowRemoveButton
                            className="h-full"
                            hasTransaction={false}
                            memberInfo={form.getValues('member_profile')}
                            onRemove={handleRemoveMember}
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
