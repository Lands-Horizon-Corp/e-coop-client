import { RowSpacingIcon } from '@/components/icons'
import {
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export interface IDataTableScrollableOptionProps {
    isScrollable: boolean
    setIsScrollable: (val: boolean) => void
}

const DataTableScrollOption = ({
    isScrollable,
    setIsScrollable,
}: IDataTableScrollableOptionProps) => {
    return (
        <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center justify-between">
                Table Sizing <RowSpacingIcon className="inline" />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
                value={isScrollable ? 'true' : 'false'}
                onValueChange={(newVal) =>
                    setIsScrollable(newVal === 'true' ? true : false)
                }
            >
                <DropdownMenuRadioItem
                    value="true"
                    onSelect={(e) => e.preventDefault()}
                >
                    Default (Scroll)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                    value="false"
                    onSelect={(e) => e.preventDefault()}
                >
                    Full (No Scroll)
                </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
    )
}

export default DataTableScrollOption
