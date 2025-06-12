import {
    BatchBlotterSummaryView,
    BatchBlotterSummaryViewProps,
} from '../batch-blotter-summary'
import Modal, { IModalProps } from '@/components/modals/modal'
import TransBatchTitleUserDisplay from '@/components/elements/trans-batch-title-user-display'

import { cn } from '@/lib'

export const BatchBlotterQuickViewModal = ({
    className,
    batchBlotterProps,
    ...props
}: IModalProps & {
    batchBlotterProps: Omit<BatchBlotterSummaryViewProps, 'className'>
}) => {
    return (
        <Modal
            titleClassName="hidden"
            descriptionClassName="hidden"
            closeButtonClassName="hidden"
            className={cn('bg-popover p-2', className)}
            {...props}
        >
            <div className="space-y-4">
                <TransBatchTitleUserDisplay
                    transBatch={batchBlotterProps.transBatch}
                />
                <div className="rounded-xl bg-background p-2">
                    <BatchBlotterSummaryView {...batchBlotterProps} />
                </div>
            </div>
        </Modal>
    )
}
