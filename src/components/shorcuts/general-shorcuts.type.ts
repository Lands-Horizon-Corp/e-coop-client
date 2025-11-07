export type Shortcut = {
    text: string
    shortcut: string
    description?: string
    icon?: React.ReactNode
}

export type TGroupShorcuts = {
    key: string
    title: string
    items: Shortcut[]
}
