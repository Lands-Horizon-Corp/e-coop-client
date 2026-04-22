import { useNavigate } from '@tanstack/react-router'

import { TEntityId } from '@/types'

const useTransactionNavigation = (fullPath: string) => {
    const navigate = useNavigate()
    return {
        open: (id: TEntityId) =>
            navigate({ to: fullPath, search: { transactionId: id } }),
        clear: () => navigate({ to: fullPath, search: {} }),
    }
}

export default useTransactionNavigation
