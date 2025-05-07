import { IconType } from 'react-icons/lib'

export type TNavItemType = 'dropdown' | 'item'

export interface INavItemBase {
    url?: string
    title: string
    depth?: number
    isSub?: boolean
    icon?: IconType
}

export interface INavItemSingle extends INavItemBase {
    type: 'item'
}

export interface INavItemDropdown extends INavItemBase {
    type: 'dropdown'
    items: INavItem[]
}

export type INavItem = INavItemDropdown | INavItemSingle

export interface INavGroupItem {
    title: string
    navItems: INavItem[]
}

// Beyond this point, this is for sidebar quick navigation

interface IQuickSearchItem extends INavItemBase {
    onClick?: (self: IQuickSearchItem) => void
}

export type TQuickSearchGroup = {
    title: string
    items: IQuickSearchItem[]
}
