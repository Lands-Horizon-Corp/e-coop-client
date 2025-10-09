import { RowSpacingIcon } from '@/components/icons'
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
    return (
        <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center justify-between">
                Table Sizing <RowSpacingIcon className="inline" />
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
                onValueChange={(newVal) =>
                    setIsScrollable(newVal === 'true' ? true : false)
                }
                value={isScrollable ? 'true' : 'false'}
            >
                <DropdownMenuRadioItem
                    onSelect={(e) => e.preventDefault()}
                    value="true"
                >
                    Default (Scroll)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                    onSelect={(e) => e.preventDefault()}
                    value="false"
                >
                    Full (No Scroll)
                </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
    )
}

export default DataTableScrollOption
