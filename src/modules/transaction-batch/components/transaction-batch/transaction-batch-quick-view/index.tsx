import { cn } from '@/helpers'

import Modal, { IModalProps } from '@/components/modals/modal'

import TransBatchTitleUserDisplay from '../../trans-batch-title-user-display'
import {
    BatchBlotterSummaryView,
    BatchBlotterSummaryViewProps,
} from '../batch-blotter-summary'

export const BatchBlotterQuickViewModal = ({
    className,
    batchBlotterProps,
    ...props
}: IModalProps & {
    batchBlotterProps: Omit<BatchBlotterSummaryViewProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('bg-popover p-2', className)}
            closeButtonClassName="hidden"
            descriptionClassName="hidden"
            titleClassName="hidden"
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
