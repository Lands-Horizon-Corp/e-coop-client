import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import FootstepDetail from '@/components/elements/sheet-displays/footstep-detail'
import { EyeIcon } from '@/components/icons'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent } from '@/components/ui/sheet'

import { useModalState } from '@/hooks/use-modal-state'

import { IFootstepTableActionComponentProp } from './columns'

interface IFootstepTableActionProps extends IFootstepTableActionComponentProp {}

const FootstepTableAction = ({
    row: { original: footstep },
}: IFootstepTableActionProps) => {
    const footstepModal = useModalState()

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <Sheet {...footstepModal}>
                    <SheetContent
                        side="right"
                        className="!max-w-lg bg-transparent p-2 focus:outline-none border-none"
                    >
                        <div className="rounded-xl bg-popover p-6 ecoop-scroll relative h-full overflow-y-auto">
                            <FootstepDetail footstep={footstep} />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
            <RowActionsGroup
                otherActions={
                    <>
                        <DropdownMenuItem
                            onClick={() => footstepModal.onOpenChange(true)}
                        >
                            <EyeIcon className="mr-2" strokeWidth={1.5} />
                            View footstep&apos;s Info
                        </DropdownMenuItem>
                    </>
                }
            />
        </>
    )
}

export default FootstepTableAction
