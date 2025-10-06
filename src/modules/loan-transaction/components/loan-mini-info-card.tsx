import { cn, formatNumber } from '@/helpers'

import { CalendarNumberIcon } from '@/components/icons'
import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import { ILoanTransaction } from '../loan-transaction.types'
import LoanAmortization from './loan-amortization'
import LoanModeOfPaymentBadge from './loan-mode-of-payment-badge'
import LoanStatusIndicator from './loan-status-indicator'
import { LoanTypeBadge } from './loan-type-badge'

interface Props extends IClassProps {
    loanTransaction: ILoanTransaction
}

const LoanMiniInfoCard = ({ className, loanTransaction }: Props) => {
    const amortViewer = useModalState()

    return (
        <div className={cn('bg-popover p-4 rounded border', className)}>
            <Modal
                {...amortViewer}
                title=""
                description=""
                closeButtonClassName="top-2 right-2"
                titleClassName="sr-only"
                descriptionClassName="sr-only"
                className="!max-w-[90vw] p-0 shadow-none border-none bg-transparent gap-y-0"
            >
                <LoanAmortization
                    className="col-span-5 p-0 bg-transparent"
                    loanTransactionId={loanTransaction.id}
                />
            </Modal>
            <div className="flex items-center justify-between">
                <div>
                    <p>Loan Summary</p>
                    <div className="text-xs">
                        <CopyWrapper>
                            <span className="text-muted-foreground/70">
                                {loanTransaction.id}
                            </span>
                        </CopyWrapper>
                    </div>
                </div>
                <LoanStatusIndicator loanTransactionDates={loanTransaction} />
            </div>
            <div className="grid grid-cols-4 gap-4 py-4">
                <div>
                    <p className="text-muted-foreground text-xs">
                        Ammount Applied
                    </p>
                    <div className="text-lg">
                        {formatNumber(loanTransaction.applied_1, 2)}
                    </div>
                </div>
                <div>
                    <p className="text-muted-foreground text-xs">Terms</p>
                    <p className="text-lg">{loanTransaction.terms}</p>
                </div>
                <div>
                    <p className="text-muted-foreground text-xs">
                        Mode of Payment
                    </p>
                    <div className="text-lg">
                        <LoanModeOfPaymentBadge
                            size="sm"
                            mode={loanTransaction.mode_of_payment}
                        />
                    </div>
                </div>
                <div>
                    <p className="text-muted-foreground text-xs">Loan Type</p>
                    <div className="text-lg">
                        <LoanTypeBadge
                            size="sm"
                            loanType={loanTransaction.loan_type}
                        />
                    </div>
                </div>
            </div>
            <Button
                variant="secondary"
                className="w-full"
                onClick={() => amortViewer.onOpenChange(true)}
            >
                <CalendarNumberIcon className="inline" /> View Loan Amortization
            </Button>
        </div>
    )
}

export default LoanMiniInfoCard
