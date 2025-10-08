import { cn } from '@/helpers/tw-utils'

import { ClockCancelIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { useModalState } from '@/hooks/use-modal-state'

import { CancelledCashCheckVoucherCreateUpdateFormModal } from './forms/cancelled-cash-check-voucher-form-modal'
import CancelledCashCheckVoucherTable from './tables'

const CancelledCashCheckVoucherButton = () => {
    const createModal = useModalState(false)
    return (
        <Popover modal>
            <PopoverTrigger asChild>
                <Button
                    className="group rounded-full"
                    hoverVariant="primary"
                    size="sm"
                    variant="secondary"
                >
                    <ClockCancelIcon className="mr-2 text-primary duration-300 group-hover:text-inherit" />
                    Manage Cancelled Vouchers
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className=" w-[900px] h-[500px] p-2 max-w-[1000px] border-none  shadow-none"
            >
                <CancelledCashCheckVoucherCreateUpdateFormModal
                    className={cn('!min-w-2xl !max-w-2xl')}
                    {...createModal}
                />
                <CancelledCashCheckVoucherTable
                    toolbarProps={{
                        createActionProps: {
                            onClick: () => {
                                createModal.onOpenChange(true)
                            },
                        },
                    }}
                />
            </PopoverContent>
        </Popover>
    )
}

export default CancelledCashCheckVoucherButton
