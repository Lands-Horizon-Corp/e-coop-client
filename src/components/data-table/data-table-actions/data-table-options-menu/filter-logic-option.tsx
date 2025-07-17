import { FunnelIcon } from '@/components/icons'
import {
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

import { TFilterLogic } from '../../../../contexts/filter-context'

export interface IDataTableFilterLogicOptionProps {
    filterLogic: TFilterLogic
    setFilterLogic: (newFilterLogic: TFilterLogic) => void
}

const DataTableFilterLogicOption = ({
    filterLogic,
    setFilterLogic,
}: IDataTableFilterLogicOptionProps) => {
    return (
        <DropdownMenuGroup>
            <DropdownMenuLabel className="flex justify-between items-center">
                Filter Logic
                <FunnelIcon />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
                value={filterLogic}
                onValueChange={(selected) =>
                    setFilterLogic(selected as TFilterLogic)
                }
            >
                <DropdownMenuRadioItem
                    value="AND"
                    onSelect={(e) => e.preventDefault()}
                >
                    AND
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                    value="OR"
                    onSelect={(e) => e.preventDefault()}
                >
                    OR
                </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
    )
}

export default DataTableFilterLogicOption
