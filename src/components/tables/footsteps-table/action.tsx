import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import { IFootstepTableActionComponentProp } from './columns'

interface IFootstepTableActionProps extends IFootstepTableActionComponentProp {}

const FootstepTableAction = (_props: IFootstepTableActionProps) => {
    // No edit/delete for footsteps, but you can add actions here if needed
    return <RowActionsGroup otherActions={<></>} />
}

export default FootstepTableAction
