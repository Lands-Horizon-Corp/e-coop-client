import { cn } from '@/helpers'
import AmortizationScheduleTable from '@/modules/loan-amortization-schedule/components/amortization-schedule-table'

import { CalendarNumberIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Skeleton } from '@/components/ui/skeleton'

import { IClassProps, TEntityId } from '@/types'

import { useGetLoanAmortization } from '..'

interface Props extends IClassProps {
    loanTransactionId: TEntityId
}

const LoanAmortization = ({ className, loanTransactionId }: Props) => {
    const { data, isPending } = useGetLoanAmortization({
        loanTransactionId,
        options: { enabled: loanTransactionId !== undefined },
    })

    return (
        <div
            className={cn('rounded max-w-full min-w-0 p-2 gap-x-2', className)}
        >
            <p className="p-1">
                <CalendarNumberIcon className="inline text-muted-foreground/60" />{' '}
                Amortization Schedule
            </p>
            {isPending ? (
                <div className="space-y-3 p-4">
                    <div className="flex gap-2 pb-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-4 flex-1" />
                        <Skeleton className="h-4 flex-1" />
                    </div>
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div className="flex gap-2" key={index}>
                            <Skeleton className="h-6 w-full" />
                        </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 flex-1" />
                    </div>
                </div>
            ) : data !== undefined ? (
                <AmortizationScheduleTable
                    className="max-h-[80vh]"
                    currency={data?.currency}
                    schedules={data?.schedule || []}
                    total={data?.total || 0}
                />
            ) : (
                <p className="text-center text-muted-foreground">
                    No amortization result yet
                </p>
            )}
        </div>
    )
}

export const LoanAmortizationModal = ({
    loanTransactionId,
    ...props
}: IModalProps & {
    loanTransactionId: TEntityId
}) => {
    return (
        <Modal
            {...props}
            className="!max-w-[90vw] p-4 shadow-none border-none gap-y-0"
            closeButtonClassName="top-2 right-2"
            descriptionClassName="sr-only"
            titleClassName="sr-only"
        >
            <LoanAmortization
                className="col-span-5 p-0"
                loanTransactionId={loanTransactionId}
            />
        </Modal>
    )
}

export default LoanAmortization
