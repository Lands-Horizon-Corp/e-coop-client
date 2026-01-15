import { useState } from 'react'

import { IOrganization } from '@/modules/organization'

import { Particles } from '@/components/ui/background-particles'
import AuthGuard from '@/components/wrappers/auth-guard'

import { useModalState } from '@/hooks/use-modal-state'
import { useUrlModal } from '@/hooks/use-url-modal'

import ExploreHeader from '../components/explore-header'
import OrganizationBranchesModal from '../components/modals/organization-preview-modal'
import useExploreData from '../hooks/use-explore-data'
import { getCategories } from '../utils/data-grouping'
import { ExploreCategoriesMain } from './explore-by-categories'
import ExploreFeatured from './explore-featured'

const ExplorePage = () => {
    const orgModal = useModalState()
    const [searchTerm, setSearchTerm] = useState('')

    const { hasError, organizations } = useExploreData()

    const categories = getCategories(organizations)

    const {
        isOpen: isModalOpen,
        paramValue: organizationId,
        openWithParam: openOrganizationModal,
        onOpenChange,
    } = useUrlModal({ paramName: 'organization_id', defaultOpen: false })

    const handleOpenOrgPreview = (organization: IOrganization) => {
        orgModal.onOpenChange(true)
        openOrganizationModal(organization.id)
    }

    if (hasError) {
        return (
            <AuthGuard>
                <div className="container mx-auto px-4 py-8">
                    <p className="text-muted-foreground">
                        Failed to load explore data. Please try again.
                    </p>
                </div>
            </AuthGuard>
        )
    }

    return (
        <>
            {organizationId && (
                <OrganizationBranchesModal
                    onOpenChange={onOpenChange}
                    open={isModalOpen}
                    organizationId={organizationId}
                />
            )}
            <div className="to-background/0 via-background/0 from-primary/50 top-0 absolute overflow-y-hidden -mt-36 -z-10 h-screen w-[100%] bg-radial-[ellipse_100%_80%_at_10%_10%] to-100% dark:block hidden" />
            <div className="min-h-screen max-w-full">
                <Particles
                    className="absolute inset-0"
                    color="#ffffff"
                    ease={80}
                    quantity={300}
                    size={0.01}
                />
                <ExploreHeader
                    categories={categories}
                    setSearchTerm={setSearchTerm}
                />
                <div className="w-full pl-10">
                    <div className="space-y-8">
                        {['featured', 'recently'].map((mode) => (
                            <ExploreFeatured
                                handleSelectedOrganization={(item) => {
                                    handleOpenOrgPreview(item)
                                }}
                                key={mode}
                                mode={mode as 'featured' | 'recently'}
                                searchTerm={searchTerm}
                            />
                        ))}
                        <ExploreCategoriesMain
                            handleSelectedOrganization={(item) => {
                                handleOpenOrgPreview(item)
                            }}
                            searchTerm={searchTerm}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ExplorePage
