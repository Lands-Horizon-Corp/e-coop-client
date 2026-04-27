import useConfirmModalStore from '@/store/confirm-modal-store'

import { BadgeExclamationIcon, RowSpacingIcon } from '@/components/icons'
import {
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu'

export interface IDataTableScrollableOptionProps {
    isScrollable: boolean
    setIsScrollable: (val: boolean) => void
}

const DataTableScrollOption = ({
    isScrollable,
    setIsScrollable,
}: IDataTableScrollableOptionProps) => {
    const { onOpen } = useConfirmModalStore()

    return (
        <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center justify-between">
                Table Sizing <RowSpacingIcon className="inline" />
            </DropdownMenuLabel>

            <DropdownMenuRadioGroup value={isScrollable ? 'true' : 'false'}>
                <DropdownMenuRadioItem
                    onSelect={(e) => {
                        e.preventDefault()
                        setIsScrollable(true)
                    }}
                    value="true"
                >
                    Default (Scroll)
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem
                    onSelect={(e) => {
                        e.preventDefault()

                        if (!isScrollable) return

                        onOpen({
                            title: 'Warning',
                            onConfirm: () => {
                                setIsScrollable(false)
                            },
                            content: (
                                <div className="flex items-start gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm">
                                    <BadgeExclamationIcon className="size-4 mt-0.5 shrink-0 text-destructive" />
                                    <div className="space-y-1">
                                        <p className="font-medium text-destructive">
                                            Performance warning
                                        </p>
                                        <p className="text-muted-foreground">
                                            Disabling scroll renders all rows at
                                            once. With large datasets this may
                                            cause noticeable lag or freeze the
                                            page.
                                        </p>
                                    </div>
                                </div>
                            ),
                        })
                    }}
                    value="false"
                >
                    Full (No Scroll)
                </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
    )
}

export default DataTableScrollOption
