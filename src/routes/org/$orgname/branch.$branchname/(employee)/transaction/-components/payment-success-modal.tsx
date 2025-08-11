import { CheckFillIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'

import { IGeneralLedger } from '@/types'

interface PaymentSuccessModalProps extends IModalProps {
    transaction: IGeneralLedger | null
    newTransaction?: () => void
    currentMember?: () => void
}

const PaymentSuccessModal = ({
    transaction,
    newTransaction,
    currentMember,
    ...others
}: PaymentSuccessModalProps) => {
    if (!transaction) {
        return null
    }

    const memberName = transaction?.member_profile?.full_name

    return (
        <Modal {...others}>
            <div className="flex items-center justify-center w-full h-full">
                <div className="flex flex-col items-center justify-center gap-2">
                    <span className="size-16 bg-primary/20 flex items-center justify-center rounded-full">
                        <CheckFillIcon size={25} className=" text-primary" />
                    </span>
                    <p className="font-bold text-2xl text-white">
                        Payment Successful!
                    </p>
                    <p>
                        Successfully added payment to{' '}
                        <span className=" font-extrabold italic">
                            {memberName}
                        </span>
                    </p>
                    <div className="mt-5 flex flex-col items-center justify-center w-full space-y-2">
                        <Button
                            onClick={() => newTransaction?.()}
                            variant={'outline'}
                        >
                            New Transaction
                        </Button>
                        <Button
                            onClick={() => currentMember?.()}
                            className="w-full"
                        >
                            Pay Again (use this current member)
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default PaymentSuccessModal
