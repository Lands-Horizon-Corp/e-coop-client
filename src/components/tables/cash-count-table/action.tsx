import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import { ICashCountTableActionComponentProp } from './columns'

interface ICashCountTableActionProps
    extends ICashCountTableActionComponentProp {
    onCashCountUpdate?: () => void
    onDeleteSuccess?: () => void
}

const CashCountTableAction = ({
    row: _row,
    onDeleteSuccess: _onDeleteSuccess,
}: ICashCountTableActionProps) => {
    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                otherActions={
                    <>
                        <p className="mx-auto text-center text-muted-foreground/70 text-xs p-4">
                            no action available
                        </p>
                    </>
                }
            />
        </>
    )
}

export default CashCountTableAction
