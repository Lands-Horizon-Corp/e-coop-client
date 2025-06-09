import { ITimesheetTableActionComponentProp } from './columns'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'

interface ITimesheetTableActionProps
    extends ITimesheetTableActionComponentProp {}

const TimesheetTableAction = (_props: ITimesheetTableActionProps) => {
    // No edit/delete for timesheets, but you can add actions here if needed
    return <RowActionsGroup otherActions={<></>} />
}

export default TimesheetTableAction
