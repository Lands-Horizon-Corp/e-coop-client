import {
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
            <DropdownMenuLabel>Table Display</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
                value={isScrollable ? 'true' : 'false'}
                onValueChange={(newVal) =>
                    setIsScrollable(newVal === 'true' ? true : false)
                }
            >
                <DropdownMenuRadioItem value="true">
                    Default (Scroll)
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="false">
                    Full (No Scroll)
                </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
    )
}

export default DataTableScrollOption
