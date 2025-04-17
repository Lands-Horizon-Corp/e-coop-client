import {
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
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
            <DropdownMenuLabel>Filter Logic</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
                value={filterLogic}
                onValueChange={(selected) =>
                    setFilterLogic(selected as TFilterLogic)
                }
            >
                <DropdownMenuRadioItem value="AND">AND</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="OR">OR</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
    )
}

export default DataTableFilterLogicOption
