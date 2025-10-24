import { useGetAllBranches } from '@/modules/branch'
import { useGetAllOrganizations } from '@/modules/organization'

const useExploreData = () => {
    const {
        data: organizations = [],
        isPending: isLoadingOrgs,
        error: orgsError,
    } = useGetAllOrganizations()

    const {
        data: branches = [],
        isPending: isLoadingBranches,
        error: branchesError,
    } = useGetAllBranches()

    const isLoading = isLoadingOrgs || isLoadingBranches
    const hasError = orgsError || branchesError

    return {
        organizations,
        branches,
        isLoading,
        hasError,
    }
}

export default useExploreData
