import { IOrgUserOrganizationGroup } from '@/modules/user-organization'
import { create } from 'zustand'

import { TEntityId } from '@/types'

type SelectedOrganizationState = {
    selectedOrg: IOrgUserOrganizationGroup | null
    setSelectedOrg: (org: IOrgUserOrganizationGroup | null) => void
    switchingOrgId: TEntityId | null
    setSwitchingOrgId: (id: TEntityId | null) => void
    clear: () => void
}

export const useSelectedOrganizationStore = create<SelectedOrganizationState>(
    (set) => ({
        selectedOrg: null,
        setSelectedOrg: (org) => set({ selectedOrg: org }),
        switchingOrgId: null,
        setSwitchingOrgId: (id) => set({ switchingOrgId: id }),
        clear: () => set({ selectedOrg: null, switchingOrgId: null }),
    })
)

export default useSelectedOrganizationStore
