import { ReactNode } from 'react'

import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import { EyeIcon } from '@/components/icons'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet'

import { IFootstep } from '../../footstep.types'
import FootstepDetail from '../footstep-detail'
import { IFootstepTableActionComponentProp } from './columns'

export type FootstepActionType = 'view-footstep'

export type FootstepActionExtra = Record<string, never>

interface UseFootstepActionsProps {
    row: Row<IFootstep>
    onDeleteSuccess?: () => void
}

const useFootstepActions = ({ row }: UseFootstepActionsProps) => {
    const footstep = row.original
    const { open } = useTableRowActionStore<
        IFootstep,
        FootstepActionType,
        FootstepActionExtra
    >()

    const handleViewFootstep = () => {
        open('view-footstep', {
            id: footstep.id,
            defaultValues: footstep,
        })
    }

    return {
        footstep,
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
    const { handleViewFootstep } = useFootstepActions({
        row,
        onDeleteSuccess,
    })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
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
    const { handleViewFootstep } = useFootstepActions({
        row,
        onDeleteSuccess,
    })

    return (
        <>
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

export const FootstepTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IFootstep,
        FootstepActionType,
        FootstepActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const footstep = state.defaultValues

    return (
        <>
            {state.action === 'view-footstep' && (
                <Sheet onOpenChange={close} open={state.isOpen}>
                    <SheetContent
                        className="!max-w-lg bg-transparent p-2 focus:outline-none border-none"
                        side="right"
                    >
                        <SheetTitle className="sr-only hidden">
                            Footstep View
                        </SheetTitle>
                        <SheetDescription className="sr-only hidden">
                            Viewing the footstep detail
                        </SheetDescription>
                        <div className="rounded-xl bg-popover p-6 ecoop-scroll relative h-full overflow-y-auto">
                            <FootstepDetail footstep={footstep} />
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </>
    )
}

export default FootstepAction
