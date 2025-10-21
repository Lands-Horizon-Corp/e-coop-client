import { cn, formatNumber } from '@/helpers';
import { currencyFormat } from '@/modules/currency'

import { CalendarNumberIcon, EyeIcon } from '@/components/icons'
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
import { LoanViewModal } from './loan-view'

interface Props extends IClassProps {
    loanTransaction: ILoanTransaction
}

const LoanMiniInfoCard = ({ className, loanTransaction }: Props) => {
    const amortViewer = useModalState()

    return (
        <div className={cn('bg-popover p-4 rounded border', className)}>
            <Modal
                {...amortViewer}
                className="!max-w-[90vw] p-0 shadow-none border-none bg-transparent gap-y-0"
                closeButtonClassName="top-2 right-2"
                description=""
                descriptionClassName="sr-only"
                title=""
                titleClassName="sr-only"
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
                        {currencyFormat(loanTransaction.applied_1, {
                            currency: loanTransaction.account?.currency,
                            showSymbol: !!loanTransaction.account?.currency,
                        })}
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
                            mode={loanTransaction.mode_of_payment}
                            size="sm"
                        />
                    </div>
                </div>
                <div>
                    <p className="text-muted-foreground text-xs">Loan Type</p>
                    <div className="text-lg">
                        {loanTransaction.loan_type && (
                            <LoanTypeBadge
                                loanType={loanTransaction.loan_type}
                                size="sm"
                            />
                        )}
                    </div>
                </div>
            </div>
            <Button
                className="w-full"
                onClick={() => amortViewer.onOpenChange(true)}
                variant="secondary"
            >
                <CalendarNumberIcon className="inline" /> View Loan Amortization
            </Button>
        </div>
    )
}

export const LoanMicroInfoCard = ({ className, loanTransaction }: Props) => {
    const viewLoanState = useModalState()

    return (
        <div
            className={cn(
                'bg-popover p-4 rounded border overflow-x-auto ecoop-scroll min-w-[300px]',
                className
            )}
        >
            <LoanViewModal
                {...viewLoanState}
                loanTransactionId={loanTransaction.id}
            />
            <div className="flex items-start justify-between">
                <div>
                    <p>Loan Summary</p>
                    <div className="text-xs">
                        <CopyWrapper textToCopy={loanTransaction.id}>
                            <span className="text-muted-foreground/70">
                                Copy ID
                            </span>
                        </CopyWrapper>
                    </div>
                </div>
                {/* <LoanStatusIndicator loanTransactionDates={loanTransaction} /> */}
                <div className="flex items-center gap-x-1">
                    <span className="text-sm bg-accent/50 px-2 py-1 rounded-full">
                        <CalendarNumberIcon className="inline mr-1" />
                        {loanTransaction.terms && loanTransaction.terms > 0
                            ? `${loanTransaction.terms} Mos`
                            : `${loanTransaction.mode_of_payment_fixed_days || 0} Days`}
                    </span>
                    <Button
                        className="size-fit p-1"
                        onClick={() => viewLoanState.onOpenChange(true)}
                        size="icon"
                    >
                        <EyeIcon />
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 pt-4">
                <div>
                    <p className="text-muted-foreground text-xs">MOP</p>
                    <div className="text-sm">
                        <LoanModeOfPaymentBadge
                            mode={loanTransaction.mode_of_payment}
                            size="sm"
                        />
                    </div>
                </div>
                <div>
                    <p className="text-muted-foreground text-xs">Loan Type</p>
                    <div className="text-lg">
                        {loanTransaction.loan_type && (
                            <LoanTypeBadge
                                loanType={loanTransaction.loan_type}
                                size="sm"
                            />
                        )}
                    </div>
                </div>
                <div>
                    <p className="text-muted-foreground text-xs text-right">
                        Applied
                    </p>
                    <div className="text-xs text-right ml-auto font-mono px-2 py-0.5 rounded-md text-accent-foreground w-fit bg-accent">
                        {formatNumber(loanTransaction.applied_1, 2)}
                    </div>
                </div>
                <div>
                    <p className="text-muted-foreground text-xs text-right">
                        Balance
                    </p>
                    <div className="text-xs ml-auto text-right text-orange-400 font-mono px-2 py-0.5 rounded-md w-fit bg-accent">
                        {formatNumber(loanTransaction.balance || 0, 2)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoanMiniInfoCard
