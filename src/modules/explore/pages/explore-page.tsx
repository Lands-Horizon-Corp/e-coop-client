import { useState } from 'react'

import { IOrganization } from '@/modules/organization'
import OrganizationPreviewModal from '@/modules/organization/components/organization-modal'

import { FlickeringGrid } from '@/components/backgrounds/flickering-grid'
import AuthGuard from '@/components/wrappers/auth-guard'

import { useModalState } from '@/hooks/use-modal-state'

import ExploreHeader from '../components/explore-header'
import useExploreData from '../hooks/use-explore-data'
import { ExploreCategoriesMain } from './explore-by-categories'
import ExploreFeatured from './explore-featured'

const ExplorePage = () => {
    const orgModal = useModalState()
    const [searchTerm, setSearchTerm] = useState('')

    const [selectedOrganization, setSelectedOrganization] =
        useState<IOrganization | null>(null)

    const { hasError } = useExploreData()

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
            {/* <BranchModalDisplay
                {...branchModal}
                branch={selectedBranch}
                isLoading={false}
                showActions={false}
            /> */}
            <div className="min-h-screen px-12 max-auto max-w-full">
                <FlickeringGrid
                    className="fixed"
                    flickerChance={0.05}
                    gridGap={1}
                    maxOpacity={0.9}
                    squareSize={64}
                />
                <div className="to-background/0 via-background/0 from-primary/50 absolute right-0 -z-10 -mt-16 h-screen w-full bg-radial-[ellipse_at_20%_0%] to-100% dark:block hidden" />
                <ExploreHeader setSearchTerm={setSearchTerm} />
                <div className="sticky w-full top-0 border-b">
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
