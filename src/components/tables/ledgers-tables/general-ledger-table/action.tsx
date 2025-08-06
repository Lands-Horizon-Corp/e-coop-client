import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { EyeIcon } from '@/components/icons'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

import { IGeneralLedgerTableActionComponentProp } from './columns'

interface IGeneralLedgerTableActionProps
    extends IGeneralLedgerTableActionComponentProp {}

const GeneralLedgerTableAction = ({
    row: _row,
}: IGeneralLedgerTableActionProps) => {
    // const ledgerEntry = row.original
    const detailsModal = useModalState()

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                otherActions={
                    <>
                        <DropdownMenuItem
                            onClick={() => detailsModal.onOpenChange(true)}
                        >
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View Details
                        </DropdownMenuItem>
                    </>
                }
            />
        </>
    )
}

export default GeneralLedgerTableAction
