import { ReactNode } from 'react'

import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { ITimesheet } from '../../timesheet.types'
import { ITimesheetTableActionComponentProp } from './columns'

interface UseTimesheetActionsProps {
    row: Row<ITimesheet>
    onDeleteSuccess?: () => void
}

const useTimesheetActions = ({ row }: UseTimesheetActionsProps) => {
    const timesheet = row.original

    // No edit/delete for timesheets currently, but actions can be added here if needed

    return {
        timesheet,
    }
}

interface ITimesheetTableActionProps
    extends ITimesheetTableActionComponentProp {
    onTimesheetUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const TimesheetAction = ({
    row,
    onDeleteSuccess,
}: ITimesheetTableActionProps) => {
    useTimesheetActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                row={row}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

interface ITimesheetRowContextProps extends ITimesheetTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const TimesheetRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ITimesheetRowContextProps) => {
    useTimesheetActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                row={row}
                otherActions={<>{/* Additional actions can be added here */}</>}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default TimesheetAction
