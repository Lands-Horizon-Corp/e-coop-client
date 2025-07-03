import {
    INavGroupItem,
    INavItem,
    INavItemSingle,
    TQuickSearchGroup,
} from './types'

export const sidebarRouteMatcher = (
    selfUrl: string | undefined,
    toCompareUrl: string
) => {
    return toCompareUrl === selfUrl || toCompareUrl.startsWith(selfUrl + '/')
}

export function flattenNavItems(
    items: INavItem[],
    parentPath = ''
): INavItemSingle[] {
    const result: INavItemSingle[] = []

    for (const item of items) {
        const selfPath = `${parentPath}${item.url}`

        if (item.type === 'item') {
            result.push({
                ...item,
                url: selfPath,
            })
        } else {
            result.push(...flattenNavItems(items, selfPath))
        }
    }

    return result
}

export const flatSidebarGroupItem = (
    groupItems: INavGroupItem[]
): TQuickSearchGroup[] => {
    const groups: TQuickSearchGroup[] = []

    for (const { title, navItems } of groupItems) {
        let flattenNav: INavItemSingle[] = []

        navItems.forEach((item) => {
            if (item.type === 'item') {
                flattenNav.push(item)
            } else {
                flattenNav = [
                    ...flattenNav,
                    ...flattenNavItems(item.items, item.url),
                ]
            }
        })

        groups.push({
            title,
            items: flattenNav,
        })
    }

    return groups
}
