import React, { createContext, useContext } from 'react'

import { IUserOrganization } from '@/modules/user-organization'

import type { TEntityId } from '@/types'

type Value = {
    isSeeding?: boolean
    organizationId: TEntityId
    showActions?: boolean
    showJoinBranch?: boolean
    userOrganizations?: IUserOrganization[]
}

const BranchesContext = createContext<Value | undefined>(undefined)

export const BranchesProvider = ({
    value,
    children,
}: {
    value: Value
    children: React.ReactNode
}) => (
    <BranchesContext.Provider value={value}>
        {children}
    </BranchesContext.Provider>
)

export const useBranchesContext = () => {
    const ctx = useContext(BranchesContext)
    if (!ctx)
        throw new Error(
            'useBranchesContext must be used inside BranchesProvider'
        )
    return ctx
}
