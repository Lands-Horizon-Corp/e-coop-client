import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'

import Map from '@/components/map'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { PencilOutlineIcon, TrashIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import PageContainer from '@/components/containers/page-container'
import BranchBanner from '@/components/branch-profile/branch-banner'
import BranchDescription from '@/components/branch-profile/branch-description'
import { BranchEditFormModal } from '@/components/forms/branch-forms/branch-edit-form'
import BranchBasicDetailsList from '@/components/branch-profile/branch-basic-details-list'
import BranchDeleteModalContent from '@/pages/owner/components/branch-delete-modal-description'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { branchLoader, useDeleteBranch } from '@/hooks/api-hooks/use-branch'

const OwnerViewBranch = () => {
    const { onOpen } = useConfirmModalStore()
    const [editModal, setEditModal] = useState(false)
    const { branchId } = useParams({
        from: '/owner/company/branches/$branchId',
    })

    const { data } = useSuspenseQuery(branchLoader(branchId))
    const { mutate: deleteBranch, isPending: isDeleting } = useDeleteBranch()

    return (
        <PageContainer className="gap-y-4">
            <BranchEditFormModal
                open={editModal}
                onOpenChange={setEditModal}
                formProps={{
                    branchId,
                    defaultValues: {
                        ...data,
                    },
                    disabledFields: ['companyId'],
                }}
            />
            <BranchBanner branch={data} />
            <div className="my-0 flex w-full items-center justify-between">
                <div className="flex items-center gap-x-4 text-foreground/60 dark:text-foreground/70">
                    <p className="text-xs font-medium text-foreground">
                        Quick Links:
                    </p>
                    <Link
                        className="border-b border-transparent hover:border-primary hover:text-foreground"
                        to="/owner/users/members"
                    >
                        Members
                    </Link>
                    <Link
                        className="border-b border-transparent hover:border-primary hover:text-foreground"
                        to="/owner/users/employees"
                    >
                        Employees
                    </Link>
                </div>
                <div className="flex items-center gap-x-2">
                    <Button
                        size="sm"
                        variant="default"
                        onClick={() => setEditModal((val) => !val)}
                    >
                        <PencilOutlineIcon className="mr-2" />
                        Edit Branch
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        disabled={isDeleting}
                        className="text-destructive hover:text-destructive-foreground/70"
                        hoverVariant="destructive"
                        onClick={() =>
                            onOpen({
                                title: 'Branch Deletion',
                                description:
                                    'Deleting this branch is a significant action that cannot be undone. Please confirm your decision carefully.',
                                content: <BranchDeleteModalContent />,
                                confirmString: 'delete',
                                onConfirm: () => deleteBranch(branchId),
                            })
                        }
                    >
                        {isDeleting ? (
                            <LoadingSpinner />
                        ) : (
                            <TrashIcon className="mr-2" />
                        )}
                        Delete
                    </Button>
                </div>
            </div>
            <div className="w-full rounded-xl border bg-secondary">
                <p className="p-4 font-medium">Company Details</p>
                <Separator className="dark:bg-background" />
                <div className="grid grid-cols-5 gap-4 p-4">
                    {data?.latitude && data?.longitude ? (
                        <Map
                            viewOnly
                            zoom={13}
                            hideControls
                            className="pointer-events-nonee pointer-events-none z-10 col-span-3 min-h-40 overflow-clip rounded-xl p-0"
                            mapContainerClassName="sm:rounded-none"
                            center={{
                                lng: data.longitude,
                                lat: data.latitude,
                            }}
                            defaultMarkerPins={[
                                {
                                    lng: data.longitude,
                                    lat: data.latitude,
                                },
                            ]}
                        />
                    ) : (
                        <div className="col-span-3 flex min-h-40 items-center justify-center rounded-lg border bg-popover p-4 text-foreground/50">
                            <p>Unable to show branch location map</p>
                        </div>
                    )}
                    <BranchBasicDetailsList branch={data} />
                </div>
            </div>
            <div className="w-full rounded-xl border bg-secondary">
                <p className="p-4 font-medium">About</p>
                <Separator className="dark:bg-background" />
                <BranchDescription
                    className="!bg-transparent"
                    description={data.description}
                />
            </div>
        </PageContainer>
    )
}

export default OwnerViewBranch
