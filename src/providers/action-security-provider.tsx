import type { ReactNode } from 'react'

import ActionSecurityModal from '@/components/modals/action-security-modal'

export function ActionSecurityProvider({ children }: { children?: ReactNode }) {
    return (
        <>
            {children}
            <ActionSecurityModal />
        </>
    )
}
