import { TEntityId } from '@/types'

import { IAccount, TAccountType } from './account.types'

export const getAccountTypePriority = (accountType: TAccountType) => {
    switch (accountType) {
        case 'Loan':
            return 1
        case 'Interest':
            return 2
        case 'SVF-Ledger':
            return 3
        case 'Fines':
            return 4
        default:
            return 5
    }
}

export const getAccountColorClass = (i: number) => {
    const colors = [
        'bg-primary/20',
        'bg-blue-400/30 text-blue-800 dark:text-blue-300',
        'bg-orange-400/40 text-orange-900 dark:text-orange-300',
        'bg-accent/70 text-accent-foreground',
        'bg-card-400 text-card-700',
        'bg-warning text-warning-foreground',
    ]

    return colors[i % colors.length]
}

export const mapAccountColor = (accounts: IAccount[]) => {
    const colorMap: Record<TEntityId, string> = {}

    accounts.forEach((account, index) => {
        colorMap[account.id] = getAccountColorClass(index)
    })

    return colorMap
}
