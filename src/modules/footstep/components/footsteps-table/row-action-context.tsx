import { ReactNode } from 'react'

import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { EyeIcon } from '@/components/icons'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent } from '@/components/ui/sheet'

import { useModalState } from '@/hooks/use-modal-state'

import { IFootstep } from '../../footstep.types'
import FootstepDetail from '../footstep-detail'
import { IFootstepTableActionComponentProp } from './columns'

interface UseFootstepActionsProps {
    row: Row<IFootstep>
    onDeleteSuccess?: () => void
}

const useFootstepActions = ({ row }: UseFootstepActionsProps) => {
    const footstep = row.original
    const footstepModal = useModalState()

    const handleViewFootstep = () => footstepModal.onOpenChange(true)

    return {
        footstep,
        footstepModal,
        handleViewFootstep,
    }
}

interface IFootstepTableActionProps extends IFootstepTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const FootstepAction = ({
    row,
    onDeleteSuccess,
}: IFootstepTableActionProps) => {
    const { footstep, footstepModal, handleViewFootstep } = useFootstepActions({
        row,
        onDeleteSuccess,
    })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <Sheet {...footstepModal}>
                    <SheetContent
                        className="!max-w-lg bg-transparent p-2 focus:outline-none border-none"
                        side="right"
                    >
                        <div className="rounded-xl bg-popover p-6 ecoop-scroll relative h-full overflow-y-auto">
                            <FootstepDetail footstep={footstep} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
            <RowActionsGroup
                canSelect
                otherActions={
                    <>
                        <DropdownMenuItem onClick={handleViewFootstep}>
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View footstep&apos;s Info
                        </DropdownMenuItem>
                    </>
                }
                row={row}
            />
        </>
    )
}

interface IFootstepRowContextProps extends IFootstepTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const FootstepRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IFootstepRowContextProps) => {
    const { footstep, footstepModal, handleViewFootstep } = useFootstepActions({
        row,
        onDeleteSuccess,
    })

    return (
        <>
            <Sheet {...footstepModal}>
                <SheetContent
                    className="!max-w-lg bg-transparent p-2 focus:outline-none border-none"
                    side="right"
                >
                    <div className="rounded-xl bg-popover p-6 ecoop-scroll relative h-full overflow-y-auto">
                        <FootstepDetail footstep={footstep} />
                    </div>
                </SheetContent>
            </Sheet>
            <DataTableRowContext
                otherActions={
                    <>
                        <ContextMenuItem onClick={handleViewFootstep}>
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View footstep&apos;s Info
                        </ContextMenuItem>
                    </>
                }
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default FootstepAction
