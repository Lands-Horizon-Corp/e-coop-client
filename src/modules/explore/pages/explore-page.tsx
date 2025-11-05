import { useState } from 'react'

import { IOrganization } from '@/modules/organization'
import OrganizationPreviewModal from '@/modules/organization/components/organization-modal'

import { FlickeringGrid } from '@/components/backgrounds/flickering-grid'
import AuthGuard from '@/components/wrappers/auth-guard'

import { useModalState } from '@/hooks/use-modal-state'

import ExploreHeader from '../components/explore-header'
import useExploreData from '../hooks/use-explore-data'
import { getCategories } from '../utils/data-grouping'
import { ExploreCategoriesMain } from './explore-by-categories'
import ExploreFeatured from './explore-featured'

const ExplorePage = () => {
    const orgModal = useModalState()
    const [searchTerm, setSearchTerm] = useState('')

    const [selectedOrganization, setSelectedOrganization] =
        useState<IOrganization | null>(null)

    const { hasError, organizations } = useExploreData()

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

    const categories = getCategories(organizations)
    const handleOpenOrgPreview = (organization: IOrganization) => {
        orgModal.onOpenChange(true)
        setSelectedOrganization(organization)
    }

    return (
        <AuthGuard>
            <OrganizationPreviewModal
                {...orgModal}
                organization={selectedOrganization}
                showActions={false}
            />
            <div className="min-h-screen max-w-full">
                <FlickeringGrid
                    className="fixed"
                    flickerChance={0.05}
                    gridGap={1}
                    maxOpacity={0.9}
                    squareSize={64}
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
        </AuthGuard>
    )
}

export default ExplorePage
